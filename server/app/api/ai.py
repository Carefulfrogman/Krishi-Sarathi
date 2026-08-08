# -*- coding: utf-8 -*-
"""AI chat endpoint: multimodal, bilingual, interactive agricultural assistant."""
import base64
import logging
import re
from typing import Optional, Any, List, Dict
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from google.genai import types

from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Emoji constants as HTML entities for Windows compatibility
ICO_SUMMARY  = "&#x1F4CB;"   # clipboard
ICO_ANALYSIS = "&#x1F50D;"   # magnifying glass
ICO_SOLUTION = "&#x1F331;"   # seedling
ICO_WATER    = "&#x1F4A7;"   # water drop
ICO_GOVT     = "&#x1F4DC;"   # scroll/policy
ICO_CARBON   = "&#x1F4C8;"   # chart
ICO_WAVE     = "&#x1F44B;"   # waving hand

def _h4(icon: str, label: str, color: str = "emerald-700") -> str:
    return f"<h4 class='font-bold text-{color} flex items-center gap-2 mb-3 text-base'>{icon} {label}</h4>"

def _p(text: Optional[str]) -> str:
    if not text:
        return ""
    return f"<p class='mb-4 text-slate-700 leading-relaxed text-sm'>{text}</p>"

def _ul(items: List[str]) -> str:
    if not items:
        return ""
    lis = "".join(f"<li>{item}</li>" for item in items)
    return f"<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>{lis}</ul>"

def build_html(sections: List[str]) -> str:
    return "\n".join(s for s in sections if s).strip()


class FileData(BaseModel):
    name: str
    type: str
    data: str  # Base64 data URI or raw base64


class ChatRequest(BaseModel):
    query: str
    language: str
    context: Optional[Dict[str, Any]] = None
    file_data: Optional[FileData] = None


GREETING_TERMS = {
    "hello", "hi", "hey", "namaste", "namaskar", "greetings", "good morning", "good evening", "good afternoon",
    "who are you", "how are you", "whats up", "whatsup", "wsp", "k xa", "k chha", "kasto xa", "kasto chha",
    "sanchai", "sanchai hunuhunchha", "k khabar", "के छ", "कस्तो छ", "नमस्ते", "नमस्कार", "हेलो", "हाई",
    "सञ्चै", "सन्चै", "के खबर", "hello k xa", "hi k xa", "namaste bro", "k xa sanchai"
}

def is_greeting_query(query: str, file_data: Optional[FileData] = None) -> bool:
    if file_data:
        return False
    q_clean = re.sub(r'[^\w\s\u0900-\u097F]', '', (query or '')).strip().lower()
    if not q_clean:
        return True
    if q_clean in GREETING_TERMS:
        return True
    words = q_clean.split()
    if len(words) <= 5:
        if any(term in q_clean for term in ["k xa", "k chha", "kasto xa", "kasto chha", "sanchai", "namaste", "hello", "hi", "hey", "whats up", "what's up", "good morning", "good evening"]):
            return True
    return False


LANG_REQUEST_TERMS = [
    "give answer in nepali", "give response in nepali", "answer in nepali", "speak in nepali",
    "speak nepali", "in nepali", "nepali language", "nepali ma", "nepali ma vana", "nepali ma bol",
    "nepali ma dinus", "nepali ma deu", "नेपालीमा", "नेपालीमा भन्नुहोस्", "नेपालीमा उत्तर", "नेपालीमा लेख्नुहोस्"
]

AGRI_KEYWORDS = [
    "farm", "farmer", "farming", "crop", "crops", "seed", "seeds", "plant", "plants", "soil", "dirt",
    "fertilizer", "fertilisers", "manure", "compost", "urea", "npk", "pest", "pests", "disease", "diseases",
    "blight", "rot", "yellow", "insect", "insects", "fungus", "fungal", "bug", "bugs", "worm", "worms",
    "water", "irrigation", "drip", "solar", "pump", "rain", "rainfall", "drought", "flood", "weather",
    "climate", "temperature", "hail", "hailstorm", "frost", "carbon", "credit", "credits", "ecotrace",
    "emission", "insurance", "bima", "claim", "policy", "subsidy", "subsidies", "grant", "moald", "narc",
    "krishi", "gyan kendra", "price", "market", "harvest", "yield", "paddy", "rice", "basmati", "wheat",
    "maize", "corn", "tomato", "potato", "apple", "mustard", "cauliflower", "lentil", "dal", "sugarcane",
    "livestock", "cow", "buffalo", "goat", "poultry", "dairy", "organic", "biochar", "neem", "trichoderma",
    "vermicompost", "tillage", "awd", "agroforestry", "green manure", "dhaincha", "mulch", "mulching",
    "blast", "blight", "rust", "mildew", "wilt", "aphid", "thrip", "lesion", "spot", "rot",
    "कृषि", "खेती", "किसान", "बाली", "माटो", "मल", "बीउ", "रोग", "कीरा", "पात", "पहेलो", "सडेको",
    "सिँचाइ", "पानी", "सौर्य", "पम्प", "मौसम", "असिना", "वर्षा", "खडेरी", "बाढी", "कार्बन", "क्रेडिट",
    "बीमा", "दाबी", "अनुदान", "ऋण", "सरकार", "मन्त्रालय", "बजार", "भाउ", "मूल्य", "उत्पादन", "कटानी",
    "रोपाई", "धान", "मकै", "गहुँ", "गोलभेडा", "आलु", "स्याउ", "तोरी", "काउली", "गाई", "भैंसी", "बाख्रा",
    "कुखुरा", "प्राङ्गारिक", "भर्मिकम्पोस्ट", "ढैंचा", "फलफूल", "तरकारी", "झुलसा", "ढुसी"
]


def generate_sustainable_agri_response(
    query: str,
    language: str,
    context: Optional[Dict[str, Any]],
    file_data: Optional[FileData]
) -> Dict[str, Any]:
    """Offline Fallback Engine — compliant with 28-point EcoTrace Farm AI rules.
    Responds to intent without inventing facts. Asks follow-up questions intelligently.
    """
    q_str = query.strip() if query else ""
    q_lower = q_str.lower()

    is_lang_request = any(term in q_lower for term in LANG_REQUEST_TERMS)

    is_nepali = (
        is_lang_request or
        language.lower() in ["nepali", "ne", "nepali language"]
    )
    q = q_lower

    # ── Language switch acknowledgement ──
    if is_lang_request and not file_data:
        return {
            "text": """
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F1F3;&#x1F1F5; हवस्! म नेपालीमा उत्तर दिनेछु।</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>नमस्ते! म तपाईंको <b>EcoTrace Farm AI</b> हुँ — कृषि, बालीनाली, रोग, माटो, सिँचाइ र दिगो खेती सम्बन्धी सहायक।</p>
<p class='mb-2 text-slate-700 text-sm'>तपाईंले मलाई सोध्न सक्नुहुन्छ:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li><b>🌾 बाली रोग तथा कीरा:</b> "धानको पात पहेँलो भयो — के गर्ने?"</li>
    <li><b>🌱 माटो र मल:</b> "गोलभेडाको माटो सुधार कसरी गर्ने?"</li>
    <li><b>💧 सिँचाइ:</b> "खडेरीमा बाली जोगाउने तरिका?"</li>
    <li><b>📈 कार्बन क्रेडिट:</b> "EcoTrace मा कार्बन क्रेडिट के हो?"</li>
</ul>
<p class='text-slate-600 text-sm'>कृपया आफ्नो कृषि प्रश्न सोध्नुहोस्!</p>
            """.strip(),
            "confidence": None,
            "references": [],
            "followups": [
                "धानमा लाग्ने मुख्य रोगहरू के हुन्?",
                "माटो परीक्षण किन गर्नुपर्छ?",
                "कार्बन क्रेडिट के हो?"
            ]
        }

    # ── Greeting ──
    if is_greeting_query(query, file_data):
        if is_nepali:
            return {
                "text": """
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>&#x1F44B; नमस्ते! म EcoTrace Farm AI हुँ।</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>म तपाईंको कृषि सहायक हुँ — बाली रोग, माटो, सिँचाइ, मल, र दिगो खेती सम्बन्धी प्रश्नहरूमा म सहयोग गर्न सक्छु।</p>
<p class='mb-2 text-slate-700 text-sm'>आज तपाईंलाई के चाहिएको छ? जस्तै:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li>"धानको पातमा दाग देखिन्छ — के हो?"</li>
    <li>"गोलभेडाको माटो सुधार कसरी गर्ने?"</li>
    <li>"कार्बन क्रेडिट कसरी कमाउने?"</li>
</ul>
                """.strip(),
                "confidence": None,
                "references": [],
                "followups": [
                    "धानमा लाग्ने मुख्य रोगहरू के हुन्?",
                    "माटो परीक्षण किन गर्नुपर्छ?",
                    "कार्बन क्रेडिट के हो?"
                ]
            }
        else:
            return {
                "text": """
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>&#x1F44B; Hello! I'm EcoTrace Farm AI.</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>I'm your agricultural assistant — I can help with crop diseases, soil health, irrigation, fertilizers, pest management, and sustainable farming.</p>
<p class='mb-2 text-slate-700 text-sm'>What can I help you with today? For example:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li>"My tomato leaves have brown spots — what could it be?"</li>
    <li>"What are common diseases in rice?"</li>
    <li>"How can I improve my soil health?"</li>
</ul>
                """.strip(),
                "confidence": None,
                "references": [],
                "followups": [
                    "What are common crop diseases in Nepal?",
                    "How do I improve soil health?",
                    "What is carbon farming?"
                ]
            }

    # ── Off-topic check ──
    is_agri = any(kw in q for kw in AGRI_KEYWORDS)
    if not is_agri and not file_data:
        if is_nepali:
            return {
                "text": f"""
<h4 class='font-bold text-amber-700 flex items-center gap-2 mb-3 text-base'>&#x26A0;&#xFE0F; यो प्रश्न कृषिसँग सम्बन्धित देखिएन।</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>म केवल कृषि, बालीनाली, माटो, मल, रोग, कीरा, सिँचाइ, मौसम, दिगो खेती र कार्बन क्रेडिट सम्बन्धी प्रश्नहरूमा सहयोग गर्न सक्छु।</p>
<p class='text-slate-600 text-sm'>कृपया कृषि सम्बन्धी प्रश्न सोध्नुहोस्, जस्तै: <i>"धानमा कस्तो रोग लाग्छ?"</i> वा <i>"माटो परीक्षण कसरी गर्ने?"</i></p>
                """.strip(),
                "confidence": None,
                "references": [],
                "followups": [
                    "धानमा लाग्ने मुख्य रोगहरू के हुन्?",
                    "माटो परीक्षण किन गर्नुपर्छ?",
                    "कार्बन क्रेडिट के हो?"
                ]
            }
        else:
            return {
                "text": f"""
<h4 class='font-bold text-amber-700 flex items-center gap-2 mb-3 text-base'>&#x26A0;&#xFE0F; That question doesn't appear to be about farming.</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>I can help with crops, soil, diseases, pests, irrigation, fertilizers, weather impacts on crops, sustainable farming, and carbon credits.</p>
<p class='text-slate-600 text-sm'>Try asking something like: <i>"What diseases affect tomatoes?"</i> or <i>"How do I improve my soil?"</i></p>
                """.strip(),
                "confidence": None,
                "references": [],
                "followups": [
                    "What are common crop diseases in Nepal?",
                    "How do I improve soil health?",
                    "What is carbon farming?"
                ]
            }

    # ── File attachment info ──
    file_info = ""
    if file_data:
        ftype = file_data.type.lower() if file_data.type else ""
        fname = file_data.name or ""
        if "image" in ftype or fname.endswith((".png", ".jpg", ".jpeg", ".webp")):
            file_info = f" (with attached photo: {fname})"
        elif "audio" in ftype or fname.endswith((".mp3", ".wav", ".m4a", ".ogg")):
            file_info = f" (with voice note: {fname})"
        elif "pdf" in ftype or fname.endswith((".pdf", ".txt", ".doc", ".docx")):
            file_info = f" (with document: {fname})"

    # ── Intent detection ──
    is_disease    = any(w in q for w in ["disease","pest","blight","spot","yellow","rot","worm","rust","mildew","wilt","aphid","thrip","blast","burn","curl","lesion","insect","bug","fungus","leaf","pests","रोग","कीरा","पात","पहेँलो","झुलसा","ढुसी","सडेको"])
    is_fertilizer = any(w in q for w in ["fertilizer","fertiliser","manure","compost","npk","urea","nitrogen","phosphorus","potassium","nutrient","organic matter","soil health","soil test","ph","acidic","alkaline","मल","माटो","यूरिया","खाद","पोषण"])
    is_carbon     = any(w in q for w in ["carbon","credit","sequestration","emission","offset","methane","co2","zero tillage","awd","agroforestry","कार्बन","क्रेडिट","उत्सर्जन","जलवायु"])
    is_irrigation = any(w in q for w in ["water","irrigation","drip","sprinkler","flood","drought","waterlogging","moisture","pump","well","solar pump","rain","monsoon","सिँचाइ","पानी","खडेरी","बाढी","सौर्य"])
    is_harvest    = any(w in q for w in ["harvest","yield","production","maturity","sow","transplant","nursery","season","काट्ने","उत्पादन","रोप्ने","बुवाई","पाक्ने"])
    is_general_disease_info = any(p in q for p in ["common disease","types of disease","tell me about disease","what disease","disease list","about disease","कस्ता रोग","सामान्य रोग","रोगहरू के"])

    # ── Identify crop mentioned ──
    crop_name = ""
    crop_nepali = ""
    if any(w in q for w in ["rice","paddy","basmati","धान","बासमती"]):
        crop_name = "rice (paddy)"; crop_nepali = "धान"
    elif any(w in q for w in ["tomato","गोलभेडा"]):
        crop_name = "tomato"; crop_nepali = "गोलभेडा"
    elif any(w in q for w in ["potato","आलु"]):
        crop_name = "potato"; crop_nepali = "आलु"
    elif any(w in q for w in ["maize","corn","मकै"]):
        crop_name = "maize"; crop_nepali = "मकै"
    elif any(w in q for w in ["wheat","गहुँ"]):
        crop_name = "wheat"; crop_nepali = "गहुँ"
    elif any(w in q for w in ["chilli","pepper","खुर्सानी"]):
        crop_name = "chilli"; crop_nepali = "खुर्सानी"
    elif any(w in q for w in ["cauliflower","cabbage","काउली","बन्दा"]):
        crop_name = "vegetables"; crop_nepali = "तरकारी"
    elif any(w in q for w in ["apple","स्याउ"]):
        crop_name = "apple"; crop_nepali = "स्याउ"
    elif any(w in q for w in ["lentil","dal","मसुरो","दाल"]):
        crop_name = "lentil"; crop_nepali = "मसुरो"

    # ─────────────────────────────────────────────
    # GENERAL DISEASE INFO (educational, no diagnosis)
    # ─────────────────────────────────────────────
    if (is_general_disease_info or is_disease) and not crop_name and not file_data:
        if is_nepali:
            html_text = build_html([
                _h4(ICO_ANALYSIS, "सामान्य बाली रोगहरू — शैक्षिक जानकारी", "emerald-800"),
                _p("<b>⚠️ नोट:</b> तलको जानकारी शैक्षिक उद्देश्यका लागि हो। यो तपाईंको बालीको रोग निदान होइन।"),
                _h4("🌾", "धानमा लाग्ने मुख्य रोगहरू", "emerald-800"),
                _ul([
                    "<b>झुलसा रोग (Blast):</b> पातमा हीरा आकारका खैरो-सेतो धब्बा। बादलयुक्त मौसम र अधिक नाइट्रोजनमा बढ्छ।",
                    "<b>जीवाणुजन्य पातको झुलसा (Bacterial Leaf Blight):</b> पातको किनारबाट पहेँलो हुँदै सुक्छ। गर्मी र आर्द्र मौसममा बढ्छ।",
                    "<b>खोलको झुलसा (Sheath Blight):</b> धानको खोलमा पानीजस्तो दाग। घना लगाइमा बढ्छ।"
                ]),
                _h4("🍅", "गोलभेडामा लाग्ने मुख्य रोगहरू", "emerald-800"),
                _ul([
                    "<b>अगाडि लाग्ने डढुवा (Early Blight):</b> पुरानो पातमा गाढा गोलो दाग, बिचमा रिंग बनाउँछ। गर्मी र आर्द्रतामा।",
                    "<b>पछाडि लाग्ने डढुवा (Late Blight):</b> पानी-सोखिएजस्तो दाग, चिसो र ओसिलो मौसममा छिटो फैलिन्छ।",
                    "<b>जीवाणुजन्य ओइलाइ (Bacterial Wilt):</b> बोट अचानक ओइलाउँछ, जडानमा समस्या।"
                ]),
                _h4("🌽", "मकै र गहुँमा", "emerald-800"),
                _ul([
                    "<b>मकै पात डढुवा (Leaf Blight):</b> पातमा खैरो लामा दाग।",
                    "<b>गहुँ खिया (Rust):</b> पातमा नारिंगे वा पहेँलो धूलोजस्ता थाप्ला।"
                ]),
                _p("<b>💡 महत्त्वपूर्ण:</b> पहेँलो पात, दाग वा ओइलाइ सधैं रोगको संकेत होइन — पोषण कमी, पानी समस्या वा जडान क्षतिले पनि यस्तो हुन सक्छ।"),
                _p("तपाईंको बालीमा समस्या देखिएमा <b>बालीको नाम, बोटको उमेर र प्रभावित भागको तस्बिर</b> पठाउनुहोस्।"),
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["धानको झुलसा र जीवाणु झुलसामा के फरक छ?", "गोलभेडाको अगाडि र पछाडि लाग्ने डढुवामा के फरक छ?", "तस्बिर कसरी पठाउने?"]
            }
        else:
            html_text = build_html([
                _h4(ICO_ANALYSIS, "Common Crop Diseases — Educational Overview", "emerald-700"),
                _p("<b>&#x26A0;&#xFE0F; Note:</b> This is general educational information — not a diagnosis of your specific crop."),
                _h4("🌾", "Rice", "emerald-700"),
                _ul([
                    "<b>Blast (Magnaporthe oryzae):</b> Diamond-shaped grey/brown lesions on leaves. Favoured by cloudy weather, high humidity, and excessive nitrogen.",
                    "<b>Bacterial Leaf Blight:</b> Yellowing from leaf edge inward. Spread by wind and water splash in warm, humid weather.",
                    "<b>Sheath Blight:</b> Water-soaked lesions on the leaf sheath. Favoured by dense planting and high humidity."
                ]),
                _h4("🍅", "Tomato", "emerald-700"),
                _ul([
                    "<b>Early Blight (Alternaria solani):</b> Dark concentric ring lesions on older leaves. Warm, humid conditions.",
                    "<b>Late Blight (Phytophthora infestans):</b> Water-soaked lesions spreading rapidly in cool, wet conditions. Extremely destructive.",
                    "<b>Bacterial Wilt:</b> Sudden wilting of whole plant despite adequate water. Soil-borne."
                ]),
                _h4("🌽", "Maize & Wheat", "emerald-700"),
                _ul([
                    "<b>Northern Corn Leaf Blight:</b> Long grey-green lesions on maize leaves.",
                    "<b>Wheat Rust:</b> Yellow stripe rust or orange/brown pustules depending on the type."
                ]),
                _p("<b>&#x1F4A1; Important:</b> Yellow leaves, spots, or wilting are not automatically signs of disease. They can also be caused by nutrient deficiency, waterlogging, drought, or root problems."),
                _p("If you're seeing a problem on your crop, tell me <b>which crop, plant age, and exactly what you see</b> — or upload a photo — for more targeted guidance."),
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["How do I tell early blight from late blight in tomatoes?", "What causes yellow leaves in rice?", "How do I upload a crop photo?"]
            }

    # ─────────────────────────────────────────────
    # SPECIFIC DISEASE SYMPTOM — Ask for more details
    # ─────────────────────────────────────────────
    if is_disease:
        crop_display = crop_name if crop_name else "your crop"
        crop_display_ne = crop_nepali if crop_nepali else "तपाईंको बाली"
        if is_nepali:
            html_text = build_html([
                _h4(ICO_ANALYSIS, f"{crop_display_ne} — रोग/कीरा विश्लेषण", "emerald-800"),
                _p(f"तपाईंको विवरण{file_info} बाट केही कारणहरू सम्भव छन् — तर सटीक निदान गर्न थप जानकारी आवश्यक छ।"),
                _h4("🔎", "पहेँलो पात वा दागका सम्भावित कारणहरू", "emerald-800"),
                _ul([
                    "<b>ढुसीजन्य रोग (Fungal):</b> प्राय: दाग, थाप्ला वा पातको किनारमा हुन्छ।",
                    "<b>जीवाणुजन्य रोग (Bacterial):</b> पानी-सोखिएजस्तो वा पहेँलो-हरियो क्षेत्र।",
                    "<b>पोषण तत्वको कमी:</b> पुरानो पात पहेँलो हुनु नाइट्रोजन कमी, नयाँ पात प्रभावित हुनु अन्य कमीको संकेत।",
                    "<b>जल समस्या:</b> अत्यधिक पानी वा खडेरीले पनि ओइलाइ र पहेँलो पात हुन्छ।",
                    "<b>कीराले गर्दा:</b> प्वाल, चुस्नुको निसान वा सुकेका डाँठ।"
                ]),
                _p("<b>निदानका लागि मलाई बताउनुहोस्:</b>"),
                _ul([
                    "कुन बाली हो र बोट कति पुरानो छ?",
                    "पहेँलो वा दाग पुरानो पातमा पहिले आयो कि नयाँ पातमा?",
                    "खेतमा पानी जम्छ कि माटो सुक्खा छ?",
                    "सम्भव भए प्रभावित भागको तस्बिर पठाउनुहोस्।"
                ])
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["तस्बिर कसरी पठाउने?", "पहेँलो पातको कारण के हो?", "धानमा लाग्ने रोगहरू के हुन्?"]
            }
        else:
            if "maize" in crop_name:
                html_text = build_html([
                    _h4(ICO_ANALYSIS, "Maize — Common Diseases & Solutions", "emerald-700"),
                    _p(f"Here is an educational overview for <b>Maize (Corn)</b>{file_info}:"),
                    _h4("🦠", "Common Maize Diseases & Symptoms", "emerald-700"),
                    _ul([
                        "<b>Northern Corn Leaf Blight:</b> Long, cigar-shaped grey-green or tan lesions on leaves. Favored by wet, humid conditions.",
                        "<b>Common Rust:</b> Small, oval, reddish-brown pustules on both leaf surfaces.",
                        "<b>Fall Armyworm (Pest):</b> Ragged holes in leaves, whorl damage, and frass (caterpillar waste).",
                        "<b>Stalk & Ear Rot:</b> Premature wilting, rotting at stalk base, or moldy cob."
                    ]),
                    _h4("🌿", "Safe Management & Prevention", "emerald-700"),
                    _ul([
                        "<b>Crop Rotation:</b> Rotate maize with legumes (beans, lentils, soybean) to break disease cycles.",
                        "<b>Resistant Varieties:</b> Plant NARC-recommended disease-resistant maize seeds.",
                        "<b>Field Sanitation:</b> Remove or plow under infected crop residue after harvest.",
                        "<b>Pest Monitoring:</b> Check leaf whorls early for caterpillars; use yellow sticky traps and safe IPM controls."
                    ]),
                    _h4("🧪", "Fertilizer & Soil Guidelines for Maize", "emerald-700"),
                    _p("Maize is a heavy nutrient feeder, especially for Nitrogen and Phosphorus:"),
                    _ul([
                        "<b>Organic Basal Dose:</b> Apply well-decomposed Farmyard Manure (FYM) or Vermicompost during land preparation to build soil organic carbon.",
                        "<b>Split Nitrogen Application:</b> Split Nitrogen into 2-3 doses (at planting, knee-high stage, and tasseling) to prevent nutrient leaching.",
                        "<b>Micronutrients:</b> Zinc deficiency causes white/yellow bands on young maize leaves — get a soil test to confirm micro-nutrient needs."
                    ]),
                    _p("<b>💡 Tip:</b> For a specific diagnosis of your current crop condition, tell me the plant's age and what symptoms you see, or upload a photo.")
                ])
                return {
                    "text": html_text,
                    "confidence": None,
                    "references": ["NARC Maize Production Guide", "EcoTrace Farm AI Knowledge Base"],
                    "followups": ["How do I control Fall Armyworm in maize?", "What causes yellowing in young maize leaves?", "How do I get my soil tested?"]
                }
            else:
                html_text = build_html([
                    _h4(ICO_ANALYSIS, f"{crop_display.title()} — Symptom & Disease Analysis", "emerald-700"),
                    _p(f"Based on your query regarding <b>{crop_display.title()}</b>{file_info}:"),
                    _h4("🔎", "Possible Causes for Symptoms", "emerald-700"),
                    _ul([
                        "<b>Fungal disease:</b> Distinct spots, lesions, or powdery growth on leaves.",
                        "<b>Bacterial disease:</b> Water-soaked or yellowing areas spreading along leaf veins.",
                        "<b>Nutrient deficiency:</b> Nitrogen causes yellowing of older leaves first; iron/zinc affects newer leaves.",
                        "<b>Water & Root stress:</b> Waterlogging and drought both cause wilting and yellowing.",
                        "<b>Pest damage:</b> Holes in leaves, wilting stems, or insect presence."
                    ]),
                    _h4("🌱", "Fertilizer & Health Principles", "emerald-700"),
                    _ul([
                        "Build soil organic matter using well-decomposed FYM or Vermicompost.",
                        "Perform a soil test to determine exact NPK and pH needs before heavy fertilizer application.",
                        "Practice crop rotation to maintain soil health and interrupt disease cycles."
                    ]),
                    _p("<b>To help narrow down a specific diagnosis:</b> Tell me the plant age, describe exact leaf symptoms, or upload a clear photo.")
                ])
                return {
                    "text": html_text,
                    "confidence": None,
                    "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                    "followups": ["How do I upload a photo?", "What causes yellow leaves in crops?", "Where can I get my soil tested?"]
                }

    # ─────────────────────────────────────────────
    # FERTILIZER / SOIL
    # ─────────────────────────────────────────────
    if is_fertilizer:
        if is_nepali:
            html_text = build_html([
                _h4(ICO_SOLUTION, "माटो र मल — सामान्य सिद्धान्तहरू", "emerald-800"),
                _p("माटोको उर्वराशक्ति बुझ्न <b>माटो परीक्षण</b> सबैभन्दा महत्त्वपूर्ण कदम हो। परीक्षण बिना सटीक मात्रा भन्न गाह्रो छ।"),
                _h4(ICO_ANALYSIS, "माटो परीक्षणले के देखाउँछ?", "emerald-800"),
                _ul([
                    "<b>pH मान:</b> अम्लीय (५ भन्दा कम) वा क्षारीय (७ भन्दा बढी) माटोमा पोषण तत्व कम पाइन्छ।",
                    "<b>NPK स्तर:</b> नाइट्रोजन, फस्फोरस र पोटासियमको मात्रा।",
                    "<b>प्राङ्गारिक पदार्थ:</b> माटोको जीवन र पानी-थाम्ने क्षमता।"
                ]),
                _h4(ICO_SUMMARY, "सामान्य सुझावहरू", "emerald-800"),
                _ul([
                    "माटो परीक्षण गरी आफ्नो खेतको अवस्था बुझ्नुहोस्।",
                    "प्राङ्गारिक मल (गोबर, कम्पोस्ट) नियमित प्रयोगले माटोको संरचना सुधार गर्छ।",
                    "हरियो मल (ढैंचा वा अन्य) प्रयोगले प्राकृतिक नाइट्रोजन बढ्छ।",
                    "सटीक मात्राका लागि नजिकको <b>कृषि ज्ञान केन्द्र</b>मा सम्पर्क गर्नुहोस्।"
                ]),
                _p("तपाईंको बाली र माटोको अवस्था बताउनुभयो भने थप सटीक सुझाव दिन सक्छु।")
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["माटो परीक्षण कहाँ गर्ने?", "धानको लागि कुन मल राम्रो?", "हरियो मल के हो?"]
            }
        else:
            html_text = build_html([
                _h4(ICO_SOLUTION, "Soil & Fertilizer — General Principles", "emerald-700"),
                _p("<b>Soil testing</b> is the most important first step. Without knowing your soil's pH and nutrient levels, specific fertilizer recommendations may not suit your farm."),
                _h4(ICO_ANALYSIS, "What soil testing tells you", "emerald-700"),
                _ul([
                    "<b>pH:</b> Acidic soil (below 5.5) or alkaline soil (above 7.5) limits nutrient uptake.",
                    "<b>NPK levels:</b> Nitrogen, Phosphorus, and Potassium status.",
                    "<b>Organic matter:</b> Affects water retention, nutrient availability, and soil life."
                ]),
                _h4(ICO_SUMMARY, "General guidance", "emerald-700"),
                _ul([
                    "Get your soil tested before applying large amounts of fertilizer.",
                    "Organic matter (compost, farmyard manure) improves soil structure and nutrient availability.",
                    "Green manures (like Dhaincha/Sesbania) naturally add nitrogen.",
                    "For specific crop fertilizer rates, contact your local Agriculture Knowledge Centre."
                ]),
                _p("Tell me your crop and what problem you're facing, and I can give more targeted guidance.")
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["Where can I get soil tested?", "What does organic matter do for soil?", "What is green manure?"]
            }

    # ─────────────────────────────────────────────
    # CARBON CREDITS
    # ─────────────────────────────────────────────
    if is_carbon:
        if is_nepali:
            html_text = build_html([
                _h4(ICO_CARBON, "कार्बन क्रेडिट — EcoTrace", "emerald-800"),
                _p("कार्बन क्रेडिट भनेको खेतमा CO2 उत्सर्जन घटाउने वा कार्बन भण्डारण गर्ने कार्यको <b>प्रमाणित मूल्यांकन</b> हो।"),
                _h4(ICO_SOLUTION, "कार्बन क्रेडिट कसरी उत्पन्न हुन्छ?", "emerald-800"),
                _ul([
                    "<b>शून्य जोताई (Zero-Tillage):</b> माटो नजोती रोप्दा माटोभित्रको कार्बन जोगिन्छ।",
                    "<b>आलोपालो सुकाउने (AWD):</b> धानखेतमा मिथेन उत्सर्जन घटाउँछ।",
                    "<b>वृक्षारोपण तथा वनकृषि:</b> रूखहरूले दीर्घकालीन कार्बन भण्डारण गर्छन्।",
                    "<b>प्राङ्गारिक खेती:</b> माटोमा कार्बन सञ्चय बढाउँछ।"
                ]),
                _p("<b>महत्त्वपूर्ण:</b> वास्तविक कार्बन क्रेडिट मूल्यांकन खेतको विशेष डेटा, प्रमाणिकरण विधि र परियोजनाका नियमहरूमा भर पर्छ — सरल अनुमान गाह्रो हुन्छ।"),
                _p("EcoTrace मा आफ्नो फार्म दर्ता गरेर आफ्नो योग्यता जान्नुहोस्।")
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI"],
                "followups": ["EcoTrace मा फार्म कसरी दर्ता गर्ने?", "AWD प्रविधि के हो?", "शून्य जोताईका फाइदाहरू?"]
            }
        else:
            html_text = build_html([
                _h4(ICO_CARBON, "Carbon Credits — EcoTrace", "emerald-700"),
                _p("Carbon credits represent the <b>verified value</b> of reducing CO2 emissions or increasing carbon storage on your farm."),
                _h4(ICO_SOLUTION, "How farms can generate carbon credits", "emerald-700"),
                _ul([
                    "<b>Zero-Tillage:</b> Reduces soil disturbance, helping retain soil organic carbon.",
                    "<b>AWD (Alternate Wetting and Drying):</b> Reduces methane emissions from paddy fields.",
                    "<b>Agroforestry:</b> Trees store carbon long-term on farm boundaries.",
                    "<b>Organic matter management:</b> Builds soil carbon over time."
                ]),
                _p("<b>Important:</b> Actual carbon credit generation depends on specific farm data, the applicable methodology, measurement, monitoring, and verification requirements — simple estimates are not reliable."),
                _p("Register your farm on EcoTrace to learn more about your eligibility.")
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI"],
                "followups": ["How do I register on EcoTrace?", "What is AWD irrigation?", "What is zero-tillage farming?"]
            }

    # ─────────────────────────────────────────────
    # IRRIGATION / WATER
    # ─────────────────────────────────────────────
    if is_irrigation:
        if is_nepali:
            html_text = build_html([
                _h4(ICO_WATER, "सिँचाइ र जल व्यवस्थापन", "emerald-800"),
                _p("बालीको प्रकार र माटोको अवस्था अनुसार सिँचाइ विधि फरक हुन्छ।"),
                _h4(ICO_SOLUTION, "मुख्य सिँचाइ विधिहरू", "emerald-800"),
                _ul([
                    "<b>थोपा सिँचाइ (Drip Irrigation):</b> तरकारी र फलफूलका लागि उपयुक्त — पानी सीधा जरामा जान्छ।",
                    "<b>फोहोरा सिँचाइ (Sprinkler):</b> खुला खेतका लागि राम्रो।",
                    "<b>AWD:</b> धान खेतमा पानी बचाउने र मिथेन घटाउने तरिका।",
                    "<b>सौर्य पम्प:</b> बिजुली नभएको ठाउँमा सिँचाइका लागि।"
                ]),
                _p("सरकारी अनुदानका लागि नजिकको <b>कृषि ज्ञान केन्द्र वा स्थानीय तहको कृषि शाखा</b>मा सम्पर्क गर्नुहोस् — हाल उपलब्ध कार्यक्रम पुष्टि गर्न।")
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["AWD सिँचाइ विधि के हो?", "थोपा सिँचाइका फाइदाहरू?", "खडेरीमा बाली कसरी जोगाउने?"]
            }
        else:
            html_text = build_html([
                _h4(ICO_WATER, "Irrigation & Water Management", "emerald-700"),
                _p("The best irrigation method depends on your crop type, soil, and available water source."),
                _h4(ICO_SOLUTION, "Common irrigation approaches", "emerald-700"),
                _ul([
                    "<b>Drip Irrigation:</b> Delivers water directly to plant roots — suitable for vegetables and fruit crops.",
                    "<b>Sprinkler:</b> Useful for larger field crops.",
                    "<b>AWD (Alternate Wetting and Drying):</b> A water-saving method for paddy fields that also reduces methane emissions.",
                    "<b>Solar Pumps:</b> Useful where electricity is unavailable."
                ]),
                _p("For subsidy information, contact your <b>local Agriculture Knowledge Centre or municipal agriculture section</b> to confirm currently available programs.")
            ])
            return {
                "text": html_text,
                "confidence": None,
                "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
                "followups": ["What is AWD irrigation?", "How does drip irrigation work?", "How do I protect crops from drought?"]
            }

    # ─────────────────────────────────────────────
    # HARVEST / PLANTING SEASON
    # ─────────────────────────────────────────────
    if is_harvest:
        crop_display = crop_name if crop_name else "common crops"
        crop_display_ne = crop_nepali if crop_nepali else "बाली"
        if is_nepali:
            html_text = build_html([
                _h4(ICO_SUMMARY, f"{crop_display_ne} — रोपाई र कटानी", "emerald-800"),
                _p("रोपाई र कटानीको सही समय बाली, स्थान र मौसममा भर पर्छ। तलका तथ्य सामान्य सन्दर्भका लागि हुन्।"),
                _h4("📅", "सामान्य मौसम (नेपाल)", "emerald-800"),
                _ul([
                    "<b>धान:</b> नर्सरी असार, रोपाई साउन, कटानी कार्तिक–मंसिर।",
                    "<b>गहुँ:</b> बुवाई मंसिर–पुस, कटानी फागुन–चैत।",
                    "<b>मकै:</b> वसन्त (चैत–वैशाख) र मनसुन (असार–साउन)।",
                    "<b>आलु:</b> वसन्त र शरद दुवैमा खेती गर्न सकिन्छ।",
                    "<b>गोलभेडा:</b> वसन्त (फागुन–चैत) र शरद (साउन–भाद्र)।"
                ]),
                _p("तपाईंको जिल्ला र बालीका लागि सटीक सुझावका लागि <b>स्थानीय कृषि ज्ञान केन्द्र</b>मा सम्पर्क गर्नुहोस्।")
            ])
        else:
            html_text = build_html([
                _h4(ICO_SUMMARY, f"{crop_display.title()} — Planting & Harvest", "emerald-700"),
                _p("Timing depends on crop, location, and season. The following is general guidance for Nepal."),
                _h4("📅", "General seasons (Nepal)", "emerald-700"),
                _ul([
                    "<b>Rice:</b> Nursery in June. Transplanting in July. Harvest: October–November.",
                    "<b>Wheat:</b> Sowing November–December. Harvest March–April.",
                    "<b>Maize:</b> Spring (March–April) and Monsoon (June–July).",
                    "<b>Potato:</b> Can be grown in spring and autumn seasons.",
                    "<b>Tomato:</b> Spring (Feb–March) and Autumn (Aug–Sep)."
                ]),
                _p("For timing specific to your district and variety, contact your <b>local Agriculture Knowledge Centre</b>.")
            ])
        return {
            "text": html_text,
            "confidence": None,
            "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
            "followups": [
                "When is the best time to plant tomatoes?" if not is_nepali else "गोलभेडा कहिले रोप्ने?",
                "How do I know when rice is ready to harvest?" if not is_nepali else "धान कटानीको संकेत के हो?",
                "How to store grains after harvest?" if not is_nepali else "अन्न भण्डारण कसरी गर्ने?"
            ]
        }

    # ─────────────────────────────────────────────
    # DEFAULT — General farming guidance
    # ─────────────────────────────────────────────
    crop_display = crop_name if crop_name else "your crop"
    crop_display_ne = crop_nepali if crop_nepali else "तपाईंको बाली"
    if is_nepali:
        html_text = build_html([
            _h4(ICO_SUMMARY, f"कृषि सहायता — {crop_display_ne}", "emerald-800"),
            _p(f"तपाईंको प्रश्न{file_info} सम्बन्धी सामान्य जानकारी:"),
            _h4(ICO_SOLUTION, "सफल खेतीका आधारभूत सिद्धान्तहरू", "emerald-800"),
            _ul([
                "<b>माटो परीक्षण:</b> पहिले माटोको pH र पोषण तत्व जाँच्नुहोस्।",
                "<b>गुणस्तरीय बीउ:</b> रोग प्रतिरोधी वा स्थानीय परीक्षण भएका जातका बीउ छान्नुहोस्।",
                "<b>नियमित निगरानी:</b> बिरुवामा रोग, कीरा वा पोषण समस्याका संकेत हेर्नुहोस्।",
                "<b>संतुलित मल:</b> माटो परीक्षण आधारमा मात्र मल सिफारिस लिनुहोस्।",
                "<b>जल व्यवस्थापन:</b> खेतमा न अत्यधिक पानी न सुख्खा हुन दिनुहोस्।"
            ]),
            _p("थप सटीक सहयोगका लागि कृपया आफ्नो <b>बाली, समस्या र खेतको अवस्था</b> बताउनुहोस्।")
        ])
        return {
            "text": html_text,
            "confidence": None,
            "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
            "followups": ["धानमा लाग्ने रोगहरू के हुन्?", "माटो परीक्षण कहाँ गर्ने?", "कार्बन क्रेडिट के हो?"]
        }
    else:
        html_text = build_html([
            _h4(ICO_SUMMARY, f"Farming Guidance — {crop_display.title()}", "emerald-700"),
            _p(f"Here is some general guidance related to your question{file_info}:"),
            _h4(ICO_SOLUTION, "Core principles for successful farming", "emerald-700"),
            _ul([
                "<b>Soil testing:</b> Know your soil's pH and nutrient status before applying fertilizers.",
                "<b>Quality seed:</b> Use healthy, disease-free seed from a reliable source.",
                "<b>Regular monitoring:</b> Walk your field regularly and look for early signs of disease, pests, or nutrient problems.",
                "<b>Balanced nutrition:</b> Apply fertilizer based on soil test results and crop needs.",
                "<b>Water management:</b> Avoid both waterlogging and drought stress."
            ]),
            _p("For more targeted advice, tell me your <b>specific crop, the problem you're facing, and the current condition of your plants</b>.")
        ])
        return {
            "text": html_text,
            "confidence": None,
            "references": ["EcoTrace Farm AI Agricultural Knowledge Base"],
            "followups": ["What are common crop diseases?", "How do I improve soil health?", "What is carbon farming?"]
        }


@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Processes multimodal chat requests (text, photo, document, audio) in English or Nepali."""

    if is_greeting_query(request.query, request.file_data):
        return generate_sustainable_agri_response(request.query, request.language, request.context, request.file_data)

    if not settings.gemini_api_key:
        logger.warning("GEMINI_API_KEY not configured. Falling back to offline intelligence engine.")
        return generate_sustainable_agri_response(
            request.query, request.language, request.context, request.file_data
        )

    try:
        client = genai.Client(api_key=settings.gemini_api_key)

        system_instruction = """You are "EcoTrace Farm AI", an intelligent agricultural assistant designed to help farmers with crop health, diseases, pests, farming practices, soil, irrigation, weather-related crop problems, harvesting, post-harvest practices, and sustainable agriculture.

Your goal is NOT simply to answer the exact sentence the farmer typed.
Your goal is to understand what the farmer is trying to achieve and provide the most useful practical agricultural guidance possible.
You must behave like a knowledgeable agricultural advisor, while being honest about uncertainty.

Format your output as Tailwind CSS compatible HTML using <h4> headers with HTML entity emojis. Do NOT wrap output in markdown code blocks. Output clean HTML directly.
Respond fluently in the requested language (English or Nepali in Devanagari script).

==================================================
1. CORE PERSONALITY AND INTELLIGENCE
==================================================
You are: Practical, Knowledgeable, Farmer-friendly, Proactive, Clear, Evidence-oriented, Context-aware.
Do not behave like a rigid FAQ bot. If the farmer asks a simple question, answer it directly.
If the farmer asks a broad question, give a useful explanation with examples.
If the farmer describes a crop problem, analyze the information and help narrow down the cause.
If important information is missing, ask only the most useful follow-up question instead of repeatedly saying "more information is required."

==================================================
3. ANSWER GENERAL QUESTIONS DIRECTLY
==================================================
If the farmer asks: "Tell me some common crop diseases", answer the question directly. Provide a useful overview. Always make it clear that a general disease list is NOT a diagnosis of the farmer's crop.

==================================================
5. DISEASE DIAGNOSIS
==================================================
Consider all possibilities (fungal, bacterial, viral, insects, mites, nutrients, water stress, heat, drainage, mechanical). Do not automatically assume every problem is a fungal disease. Do not diagnose solely from one generic symptom like "yellow leaves".

==================================================
6. DIAGNOSIS CONFIDENCE
==================================================
Always distinguish between: CONFIRMED, LIKELY, POSSIBLE, UNCERTAIN. Never present "possible" as "confirmed."
Do not invent a confidence percentage (like 92%). Provide your confidence as a descriptive word inside your HTML output (e.g., "Confidence: Moderate").

==================================================
7. WHEN INFORMATION IS MISSING
==================================================
Do NOT automatically stop the answer. First provide whatever useful information can safely be inferred. Then ask for the ONE or TWO most useful missing details.

==================================================
8. PHOTO ANALYSIS
==================================================
Analyze visible features. Provide: OBSERVATIONS, Possible causes, Most likely explanation, Alternative explanations, What would confirm it, Safe next steps. Never claim laboratory certainty from a photograph.

==================================================
9. TREATMENT RECOMMENDATIONS
==================================================
Treatments must be based on the crop and likely problem. Do not automatically recommend Neem oil, Trichoderma, etc. When recommending pesticide/fungicide: do not invent rates, mixing ratios, or spray intervals. Tell the farmer to follow the product label.

==================================================
17. GOVERNMENT INFORMATION
==================================================
Never invent programs, subsidies, eligibility, or official scheme names. If unavailable, recommend local Agriculture Knowledge Centre (AKC) or municipal agriculture section.

==================================================
18. CARBON CREDITS
==================================================
Treat carbon credits as a separate topic from disease diagnosis. NEVER say "Using organic pest control automatically gives X carbon credits." Never invent a tCO2e/ha value.

==================================================
26. NEVER FABRICATE FACTS
==================================================
Accuracy is more important than sounding confident. Never invent diseases, doses, subsidies, or carbon amounts.

==================================================
28. FINAL PRINCIPLE
==================================================
Think before answering. Answer the actual question. Provide useful additional info. Ask questions only when they improve the answer. Never turn uncertainty into certainty. Never invent facts."""

        prompt_text = f"User Language Preference: {request.language}\n"
        if request.context:
            prompt_text += f"Farm & Environmental Context:\n{request.context}\n\n"
        prompt_text += f"User Query: {request.query}"

        contents: List[Any] = []

        if request.file_data and request.file_data.data:
            try:
                raw_b64 = request.file_data.data
                if "," in raw_b64:
                    raw_b64 = raw_b64.split(",")[1]
                file_bytes = base64.b64decode(raw_b64)
                mime_type  = request.file_data.type or "image/jpeg"
                file_part  = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
                contents.append(file_part)
                prompt_text = f"[User attached file: {request.file_data.name} ({mime_type})]\n" + prompt_text
            except Exception as fe:
                logger.error(f"File processing error: {fe}")

        contents.append(prompt_text)

        candidate_models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"]

        for model_name in candidate_models:
            try:
                res = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.2,
                    )
                )
                if res and res.text:
                    response_text = res.text.strip()
                    for fence in ("```html", "```"):
                        if response_text.startswith(fence):
                            response_text = response_text[len(fence):]
                    if response_text.endswith("```"):
                        response_text = response_text[:-3]

                    is_nep = (
                        request.language.lower() in ["nepali", "ne"] or
                        bool(re.search(r'[\u0900-\u097F]', request.query))
                    )
                    followups = [
                        "धानमा लाग्ने मुख्य रोगहरू के हुन्?",
                        "माटो परीक्षण किन गर्नुपर्छ?",
                        "कार्बन क्रेडिट के हो?"
                    ] if is_nep else [
                        "What are common crop diseases in Nepal?",
                        "How do I improve soil health?",
                        "What is carbon farming?"
                    ]

                    return {
                        "text": response_text.strip(),
                        "confidence": None,
                        "references": [f"EcoTrace Farm AI ({model_name})"],
                        "followups": followups
                    }
            except Exception as me:
                logger.warning(f"Model {model_name} failed: {str(me)}")
                continue

    except Exception as e:
        logger.error(f"Gemini client init failed: {str(e)}")

    # Always fall back to offline intelligence engine
    return generate_sustainable_agri_response(
        request.query, request.language, request.context, request.file_data
    )
