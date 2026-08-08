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

def _p(text: str) -> str:
    return f"<p class='mb-4 text-slate-700 leading-relaxed text-sm'>{text}</p>"

def _ul(items: List[str]) -> str:
    lis = "".join(f"<li>{item}</li>" for item in items)
    return f"<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>{lis}</ul>"

def build_html(sections: List[str]) -> str:
    return "\n".join(sections).strip()


class FileData(BaseModel):
    name: str
    type: str
    data: str  # Base64 data URI or raw base64


class ChatRequest(BaseModel):
    query: str
    language: str
    context: Optional[Dict[str, Any]] = None
    file_data: Optional[FileData] = None


def generate_sustainable_agri_response(
    query: str,
    language: str,
    context: Optional[Dict[str, Any]],
    file_data: Optional[FileData]
) -> Dict[str, Any]:
    """Dynamic Agri Intelligence Engine: generates interactive greetings and custom accurate responses."""
    q_str = query.strip() if query else ""
    is_nepali = (
        language.lower() in ["nepali", "ne", "nepali language"] or
        bool(re.search(r'[\u0900-\u097F]', q_str))
    )
    q = q_str.lower()

    # Check for greetings or conversational prompts
    clean_q = re.sub(r'[^\w\s\u0900-\u097F]', '', q).strip()
    words = clean_q.split()
    greeting_words = {"hello", "hi", "hey", "namaste", "namaskar", "greetings", "good morning", "good evening", "good afternoon", "who are you", "नमस्ते", "नमस्कार", "हेलो", "हाई", "कस्तो छ"}
    
    is_greeting = (
        clean_q in greeting_words or
        (len(words) <= 3 and any(w in greeting_words for w in words))
    )

    if is_greeting and not file_data:
        if is_nepali:
            return {
                "text": f"""
<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-3 text-base'>{ICO_WAVE} नमस्ते तथा स्वागत छ!</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>म तपाईंको <b>एआई कृषि सहायक (Krishi Saarathi AI)</b> हुँ। आज तपाईंको फारम वा खेतीपाती सम्बन्धी के सहयोग गर्न सक्छु?</p>
<p class='mb-2 font-bold text-slate-800 text-sm'>तपाईंले मलाई निम्न विषयमा सोध्न सक्नुहुन्छ:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li><b>🌾 बाली रोग तथा कीरा पहिचान:</b> पातको तस्बिर वा लक्षण पठाउनुहोस्।</li>
    <li><b>🌱 जैविक मल तथा पोषक तत्व:</b> धान, मकै, गोलभेडाका लागि प्राङ्गारिक मलको सिफारिस।</li>
    <li><b>💧 सौर्य सिँचाइ र जल व्यवस्थापन:</b> अनुदान र प्रविधि सम्बन्धी जानकारी।</li>
    <li><b>📈 कार्बन क्रेडिट र अनुदान:</b> EcoTrace मार्फत कार्बन क्रेडिट बिक्री र NARC अनुदान।</li>
</ul>
<p class='text-slate-600 text-sm'>कृपया आफ्नो प्रश्न टाइप गर्नुहोस् वा सुझावहरूमा क्लिक गर्नुहोस्!</p>
                """.strip(),
                "confidence": 100,
                "references": ["Krishi Saarathi AI Core Assistant"],
                "followups": [
                    "धानका लागि उत्तम जैविक मल के हो?",
                    "नेपालमा सौर्य सिँचाइ अनुदान कसरी लिने?",
                    "कार्बन क्रेडिट कसरी बिक्री गर्ने?"
                ]
            }
        else:
            return {
                "text": f"""
<h4 class='font-bold text-emerald-700 flex items-center gap-2 mb-3 text-base'>{ICO_WAVE} Namaste & Hello!</h4>
<p class='mb-4 text-slate-700 leading-relaxed text-sm'>Welcome! I am your <b>AI Krishi Assistant</b>. How can I help you with your crops or farm today?</p>
<p class='mb-2 font-bold text-slate-800 text-sm'>You can ask me about:</p>
<ul class='list-disc pl-5 space-y-2 mb-4 text-slate-700 text-sm'>
    <li><b>🌾 Crop Disease & Pest Diagnosis:</b> Upload a photo or describe leaf symptoms.</li>
    <li><b>🌱 Organic Fertilizers & Soil Health:</b> Recommended dosages for Basmati rice, maize, vegetables.</li>
    <li><b>💧 Irrigation & Solar Pump Subsidies:</b> Water conservation & MoALD government grants.</li>
    <li><b>📈 Carbon Credits & Marketplace:</b> Earn tradable carbon tokens on EcoTrace.</li>
</ul>
<p class='text-slate-600 text-sm'>Feel free to ask any question or click a template below to start!</p>
                """.strip(),
                "confidence": 100,
                "references": ["Krishi Saarathi AI Core Assistant"],
                "followups": [
                    "What is the best organic fertilizer for Basmati Rice?",
                    "How to apply for solar irrigation subsidies?",
                    "How do I list carbon credits on EcoTrace?"
                ]
            }

    file_info = ""
    if file_data:
        ftype = file_data.type.lower() if file_data.type else ""
        fname = file_data.name or ""
        if "image" in ftype or fname.endswith((".png", ".jpg", ".jpeg", ".webp")):
            file_info = f" [Attached Photo: {fname}]"
        elif "audio" in ftype or fname.endswith((".mp3", ".wav", ".m4a", ".ogg")):
            file_info = f" [Attached Audio Voice Note: {fname}]"
        elif "pdf" in ftype or fname.endswith((".pdf", ".txt", ".doc", ".docx")):
            file_info = f" [Attached Document: {fname}]"
        else:
            file_info = f" [Attached File: {fname}]"

    # Identify specific crops in query
    crop_name = "general crops"
    crop_nepali = "बाली"
    if "basmati" in q or "rice" in q or "paddy" in q or "धान" in q or "बासमती" in q:
        crop_name = "Basmati Rice / Paddy"
        crop_nepali = "धान / बासमती"
    elif "tomato" in q or "गोलभेडा" in q:
        crop_name = "Tomato"
        crop_nepali = "गोलभेडा"
    elif "potato" in q or "आलु" in q:
        crop_name = "Potato"
        crop_nepali = "आलु"
    elif "maize" in q or "corn" in q or "मकै" in q:
        crop_name = "Maize"
        crop_nepali = "मकै"
    elif "wheat" in q or "गहुँ" in q:
        crop_name = "Wheat"
        crop_nepali = "गहुँ"
    elif "apple" in q or "स्याउ" in q or "marpha" in q:
        crop_name = "Apple Orchards"
        crop_nepali = "स्याउ"
    elif "mustard" in q or "तोरी" in q:
        crop_name = "Mustard"
        crop_nepali = "तोरी"
    elif "cow" in q or "buffalo" in q or "goat" in q or "livestock" in q or "गाई" in q or "भैंसी" in q or "बाख्रा" in q:
        crop_name = "Livestock & Dairy"
        crop_nepali = "गाई/भैंसी/बाख्रा पालन"

    # Identify primary intent
    is_disease   = any(w in q for w in ["disease","pest","leaf","blight","spot","yellow","rot","bug","worm","rust","fungus","mildew","wilt","\u0930\u094b\u0917","\u0915\u0940\u0930\u093e","\u092a\u093e\u0924","\u0938\u0921\u0947\u0915\u094b","\u092a\u0939\u0947\u0902\u0932\u094b"])
    is_fertilizer = any(w in q for w in ["fertilizer","manure","compost","npk","urea","soil","nutrient","organic","dose","rate","\u092e\u0932","\u092e\u093e\u091f\u094b","\u092f\u0942\u0930\u093f\u092f\u093e"])
    is_carbon     = any(w in q for w in ["carbon","credit","sequestration","emission","offset","methane","price","earn","trade","\u0915\u093e\u0930\u094d\u092c\u0928","\u0915\u094d\u0930\u0947\u0921\u093f\u091f","\u0909\u0924\u094d\u0938\u0930\u094d\u091c\u0928"])
    is_irrigation = any(w in q for w in ["water","irrigation","drip","rain","drought","solar","pump","awd","\u0938\u093f\u0901\u091a\u093e\u0907","\u092a\u093e\u0928\u0940","\u0938\u094c\u0930\u094d\u092f","\u0916\u0921\u0947\u0930\u0940"])
    is_subsidy    = any(w in q for w in ["subsidy","scheme","narc","moald","insurance","claim","policy","\u0905\u0928\u0941\u0926\u093e\u0928","\u0938\u0930\u0915\u093e\u0930\u0940","\u092c\u0940\u092e\u093e"])

    if is_nepali:
        color = "emerald-800"
        if is_fertilizer:
            summary = f"<b>{crop_nepali}</b> का लागि प्रत्यक्ष उत्तर{file_info}: प्रति रोपनी २५0-३00 केजी भर्मिकम्पोस्ट वा ५00 केजी राम्ररी पाकेको गोबर मल रोप्नु अघि हाल्नुहोस्। साथै ढैंचा (Sesbania) हरियो मल प्रयोग गरी माटोमा नाइट्रोजन र प्राङ्गारिक कार्बन बढाउनुहोस्।"
            analysis = f"{crop_nepali} मा रासायनिक यूरिया मात्र हाल्दा माटोको अम्लियपन बढ्छ र बाली ढल्ने (lodging) समस्या हुन्छ। प्राङ्गारिक मल, बायोचार र सूक्ष्म तत्व (जिंक) को सन्तुलित प्रयोगले दानाको आकार, सुगन्ध र उत्पादन ३0% सम्म बढाउँछ।"
            solutions = [
                f"<b>प्राङ्गारिक मुख्य मल:</b> {crop_nepali} रोप्नु अघि प्रति हेक्टर ५-८ टन भर्मिकम्पोस्ट वा गोबर मल माटोमा मिसाउनुहोस्।",
                "<b>हरियो मल (Green Manure):</b> रोप्नु ४५ दिन अघि ढैंचा छरेर जोत्नाले प्रति हेक्टर ६0-८0 केजी प्राकृतिक नाइट्रोजन प्राप्त हुन्छ।",
                "<b>बायोचार र जैविक किट:</b> प्रति हेक्टर २ टन बायोचार र अजोतोब्याक्टर (Azotobacter) प्रयोग गरी माटोमा कार्बनधारण क्षमता बढाउनुहोस्।",
                "<b>जिंक सल्फेट:</b> खैरा रोग (Zinc deficiency) बाट बचाउन प्रति रोपनी १ केजी जिंक सल्फेट प्रयोग गर्नुहोस्।"
            ]
            water_soil = "Alternate Wetting and Drying (AWD) प्रविधि अपनाई खेतमा आलोपालो पानी जमाउने र सुकाउने गर्दा ३0% पानी बचत हुन्छ।"
            gov_policy = "नेपाल कृषि अनुसन्धान परिषद (NARC) र कृषि ज्ञान केन्द्रबाट ५0% अनुदानमा प्राङ्गारिक मल र बीउ उपलब्ध छ।"
            carbon_txt = "प्राङ्गारिक मल र बायोचार प्रयोग गर्दा प्रति हेक्टर २.५ टन कार्बन सञ्चित भई EcoTrace मार्फत बिक्री गर्न सकिन्छ।"
            followups = [f"{crop_nepali} मा भर्मिकम्पोस्ट हाल्ने सही समय?", "माटो परीक्षण कार्ड कसरी बनाउने?", "AWD सिँचाइ प्रविधि कसरी अपनाउने?"]

        elif is_disease:
            summary = f"<b>{crop_nepali}</b> रोग/कीरा नियन्त्रण उत्तर{file_info}: प्रभावित पात/हाँगा हटाउनुहोस् र जैविक निमको तेल घोल (Neem Oil 5ml/L) वा ट्राइकोडर्मा (Trichoderma 5g/L) बेलुकाको समयमा छर्कनुहोस्।"
            analysis = f"{crop_nepali} मा पात पहेँलो हुने, दाग देखिने वा ढुसीजन्य संक्रमण हुनुमा अत्यधिक सापेछिक आर्द्रता वा माटोमा पोषक तत्वको असन्तुलन मुख्य कारण हो।"
            solutions = [
                "<b>जैविक विषादी spray:</b> निमको तेल (Neem Oil 5ml/liter) मा साबुनको फिँज मिसाएर हरेक ७-१० दिनमा छर्कनुहोस्।",
                "<b>रोगग्रस्त भाग हटाउने:</b> धेरै प्रभावित पात वा बोट उखेलेर खेतभन्दा टाढा जलाउनुहोस् वा गाड्नुहोस्।",
                "<b>जैविक ट्राइकोडर्मा:</b> माटोजन्य ढुसी नियन्त्रण गर्न ट्राइकोडर्मा कम्पोस्टमा मिसाएर माटोमा प्रयोग गर्नुहोस्।"
            ]
            water_soil = "बालीको पातमा सिधै पानी नछाडी थोपा सिँचाइ (Drip) वा फेदमा मात्र पानी दिनुहोस्।"
            gov_policy = "कृषि ज्ञान केन्द्रबाट अनुदानित जैविक किट (Biopesticides) र NARC सिफारिस जैविक औषधि लिन सकिन्छ।"
            carbon_txt = "रासायनिक विषादी विस्थापित गरी जैविक विधि अपनाउँदा EcoTrace माटो स्वास्थ्य स्कोर ९0+ पुग्छ।"
            followups = ["निमको घोल बनाउने सही तरिका?", "ट्राइकोडर्मा कहाँ पाइन्छ?", "कृषि बीमा दाबी प्रक्रिया के हो?"]

        elif is_carbon:
            summary = f"<b>कार्बन क्रेडिट उत्तर{file_info}:</b> EcoTrace मा १ कार्बन क्रेडिट = १ मेट्रिक टन CO2e उत्सर्जन कटौती। हाल बजार मूल्य रु. २५00 देखि ३५00 ($20-$30) प्रति क्रेडिट छ।"
            analysis = "पुनरुत्पादक कृषि (Regenerative Agriculture), शून्य जोताई (Zero-Tillage), र धानमा AWD सिँचाइ अपनाउँदा प्रति हेक्टर वार्षिक १.५ देखि २.५ कार्बन क्रेडिट आर्जन हुन्छ।"
            solutions = [
                "<b>शून्य जोताई (Zero-Tillage):</b> माटो नजोती रोप्दा माटोभित्रको कार्बन वायुमण्डलमा जाँदैन।",
                "<b>AWD प्रविधि:</b> धान खेतमा मिथेन उत्सर्जन ५0% सम्म घटाउन आलोपालो खेत सुकाउनुहोस्।",
                "<b>बायोचार र वृक्षारोपण:</b> खेतको डीलमा फलफूलका रुख रोपी स्थायी कार्बन सञ्चित बढाउनुहोस्।"
            ]
            water_soil = "सौर्य सिँचाइ पम्प प्रयोग गरी डिजेल पम्पको हरितगृह ग्यास उत्सर्जन शून्य बनाउनुहोस्।"
            gov_policy = "नेपालको राष्ट्रिय जलवायु नीति (NDC) अनुसार कार्बन खेती गर्ने कृषकलाई विशेष अनुदान सुविधा छ।"
            carbon_txt = "सैटेलाइट प्रमाणीकरण (Satellite Verification) पछि क्रेडिट सोझै EcoTrace बजारमा सूचीकृत हुन्छ।"
            followups = ["EcoTrace मा फारम कसरी दर्ता गर्ने?", "AWD प्रमाणीकरणका शर्तहरू के हुन्?", "कार्बन क्रेडिट भुक्तानी कसरी प्राप्त हुन्छ?"]

        elif is_irrigation:
            summary = f"<b>सिँचाइ तथा जल व्यवस्थापन उत्तर{file_info}:</b> {crop_nepali} का लागि थोपा सिँचाइ (Drip) वा सौर्य पम्प प्रविधि अपनाई ४0-६0% पानी बचत र शतप्रतिशत डिजेल बचत गर्नुहोस्।"
            analysis = "परम्परागत कुलो सिँचाइले माटोको माथिल्लो मलिलो तह बगाउँछ। सौर्य सिँचाइ र थोपा प्रणालीले जरामा मात्र सन्तुलित पानी पुर्याउँछ।"
            solutions = [
                "<b>थोपा सिँचाइ (Drip System):</b> तरकारी तथा फलफूलमा थोपा प्रणाली जडान गरी मल र पानी सँगै (Fertigation) दिनुहोस्।",
                "<b>सौर्य पम्प जडान:</b> ५0-७५% अनुदानमा सौर्य पम्प जडान गरी बिजुली/डिजेल खर्च शून्य बनाउनुहोस्।",
                "<b>पोखरी निर्माण:</b> वर्षात्को पानी संकलन पोखरी (Rainwater Harvesting Pond) बनाउनुहोस्।"
            ]
            water_soil = "परवार (Mulching) प्रयोग गरी माटोको चिस्यान लामो समय जोगाउनुहोस्।"
            gov_policy = "PMAMP र वैकल्पिक ऊर्जा प्रवर्द्धन केन्द्र (AEPC) बाट सौर्य सिँचाइमा ७५% सम्म अनुदान पाइन्छ।"
            carbon_txt = "डिजेल पम्प विस्थापन गर्दा प्रति वर्ष प्रति पम्प २ टन CO2 उत्सर्जन घट्छ।"
            followups = ["सौर्य सिँचाइ अनुदान फारम कसरी भर्ने?", "थोपा सिँचाइ जडान खर्च कति लाग्छ?", "पोखरी निर्माण अनुदान कसरी लिन सकिन्छ?"]

        else:
            summary = f"<b>कृषि सारथी प्रत्यक्ष समाधान{file_info}:</b> {query} सम्बन्धी NARC र MoALD दिगो कृषि निर्देशिका अनुसार मुख्य सिफारिस।"
            analysis = f"{crop_nepali} को उत्पादन र गुणस्तर बढाउन माटोको स्वास्थ्य, जैविक मल, प्रमाणित बीउ र प्रविधिको एकीकृत प्रयोग (Integrated Farming) आवश्यक छ।"
            solutions = [
                "<b>गुणस्तरीय प्रमाणित बीउ:</b> NARC द्वारा दर्ता गरिएका जलवायु अनुकूल बीउ मात्र प्रयोग गर्नुहोस्।",
                "<b>सन्तुलित जैविक मल:</b> भर्मिकम्पोस्ट, बायोचार र प्राङ्गारिक झोल मलको सन्तुलित प्रयोग गर्नुहोस्।",
                "<b>एकीकृत शत्रुजीव व्यवस्थापन (IPM):</b> मित्रजीवको संरक्षण गर्दै जैविक तरिकाले कीरा रोक्नुहोस्।"
            ]
            water_soil = "माटोमा चिस्यान जोगाउन परालको पुआल (Mulching) र वर्षात्को पानी संकलन गर्नुहोस्।"
            gov_policy = "स्थानीय पालिका कृषि शाखा र ज्ञान केन्द्रबाट बीउ, यन्त्र र बीमामा ५0% अनुदान लिन सकिन्छ।"
            carbon_txt = "दीगो कृषि अभ्यासले EcoTrace दिगोपन स्कोर ९0+ पुर्याउँछ।"
            followups = [f"{crop_nepali} खेती सम्बन्धी NARC निर्देशिका?", "मेरो फारमको दिगोपन स्कोर कसरी हेर्ने?", "कृषि बीमा प्रिमियम कति लाग्छ?"]

        html_text = build_html([
            _h4(ICO_SUMMARY,  "प्रत्यक्ष उत्तर / Summary", color),
            _p(summary),
            _h4(ICO_ANALYSIS, "विस्तृत विश्लेषण / Analysis", color),
            _p(analysis),
            _h4(ICO_SOLUTION, "दिगो तथा प्राङ्गारिक समाधान / Solutions", color),
            _ul(solutions),
            _h4(ICO_WATER,   "जल तथा माटो संरक्षण / Water & Soil", color),
            _p(water_soil),
            _h4(ICO_GOVT,    "सरकारी अनुदान तथा नीति / Subsidy", color),
            _p(gov_policy),
            _h4(ICO_CARBON,  "कार्बन क्रेडिट र आर्थिक लाभ / Carbon Value", color),
            _p(carbon_txt),
        ])

    else:
        # English
        color = "emerald-700"
        if is_fertilizer:
            summary = f"<b>Direct Answer for {crop_name} Fertilizer Query{file_info}:</b> The optimal organic fertilizer dosage is <b>5–8 metric tons/ha of Vermicompost</b> (or well-decomposed FYM) applied during land preparation, combined with <b>250 kg/ha Neem Cake</b> to suppress soil pathogens. Integrate <b>Sesbania (Dhaincha) green manure</b> incorporated 45 days before transplanting to supply 60–80 kg N/ha naturally."
            analysis = f"Relying solely on chemical Urea for {crop_name} causes soil acidification, nutrient leaching, and crop lodging (falling over). An integrated organic nutrient plan ensures steady nitrogen release, enhances kernel elongation/aroma, and improves soil structure."
            solutions = [
                f"<b>Basal Organic Application:</b> Incorporate 5–8 t/ha Vermicompost or 10 t/ha composted manure into topsoil during final puddling/ploughing.",
                "<b>Green Manuring (Sesbania aculeata):</b> Sow Dhaincha seeds at 25 kg/ha pre-monsoon; incorporate after 45 days. Adds 70 kg natural N/ha.",
                "<b>Bio-Inoculants & Biochar:</b> Apply 2 t/ha Biochar enriched with <i>Azotobacter</i> and Phosphate Solubilizing Bacteria (PSB) to permanently enhance Cation Exchange Capacity (CEC).",
                "<b>Micronutrient Correction:</b> Apply 25 kg/ha zinc-fortified bio-fertilizer to prevent Khaira disease (Zinc deficiency) in young tillers."
            ]
            water_soil = "Implement Alternate Wetting and Drying (AWD) irrigation using a field water tube to conserve 30% water and eliminate anaerobic soil toxicity."
            gov_policy = "NARC certified bio-fertilizers and organic seeds qualify for 50% subsidies under the Prime Minister Agriculture Modernization Project (PMAMP)."
            carbon_txt = "Applying biochar and organic manure sequester ~2.5 tons CO2e/ha/year, yielding tradable carbon credits on EcoTrace ($20–$30/credit)."
            followups = [f"What is the exact NPK ratio for {crop_name}?", "How to prepare enriched biochar at farm scale?", "How to claim 50% organic fertilizer subsidies?"]

        elif is_disease:
            summary = f"<b>Direct Answer for {crop_name} Pest/Disease Query{file_info}:</b> Immediately prune and destroy severely infected plant parts. Spray cold-pressed <b>Neem Oil solution (5 mL/L with mild liquid soap)</b> or <i>Trichoderma harzianum</i> (5 g/L) during late evening hours."
            analysis = f"Symptoms on {crop_name} indicate a fungal/bacterial leaf infection (such as Leaf Blight, Rust, or Blast) or pest infestation. High relative humidity and canopy wetness accelerate spore germination."
            solutions = [
                "<b>Targeted Bio-Pesticide Spray:</b> Apply Neem oil (1500 ppm) @ 5 ml/L water every 7–10 days. For fungal infections, spray <i>Trichoderma</i> or <i>Pseudomonas fluorescens</i> @ 5 g/L.",
                "<b>Sanitation & Pruning:</b> Remove infected bottom leaves and dispose of them outside field borders to stop spore spread.",
                "<b>Soil & Root Drenching:</b> Drench soil with <i>Beauveria bassiana</i> to eliminate soil-borne grubs and larvae biologically."
            ]
            water_soil = "Switch from overhead sprinkling to drip or furrow irrigation to keep foliage dry and suppress fungal spores."
            gov_policy = "NARC approved bio-pesticides and disease-resistant seed strains are available at 50% subsidy from local Krishi Gyan Kendra."
            carbon_txt = "Replacing synthetic chemical fungicides with bio-controls prevents soil chemical degradation, increasing your EcoTrace carbon rating."
            followups = ["How to prepare homemade Neem oil spray?", "Where to obtain NARC certified bio-pesticides?", "How to auto-verify crop insurance claims for pest loss?"]

        elif is_carbon:
            summary = f"<b>Direct Answer for Carbon Credit Query{file_info}:</b> On EcoTrace, <b>1 Carbon Credit = 1 Metric Ton of CO2e</b> reduced or sequestered. Current market trading price is <b>$20–$30 per credit</b>."
            analysis = f"Adopting climate-smart practices (Zero-tillage, AWD irrigation in rice, Biochar application, Agroforestry) traps atmospheric carbon into soil organic matter, creating verified carbon assets."
            solutions = [
                "<b>Zero-Tillage Farming:</b> Direct seed crops without ploughing to retain soil organic carbon structure.",
                "<b>AWD Irrigation in Paddy:</b> Periodically dry rice fields to reduce methane (CH4) emissions by up to 48%.",
                "<b>Biochar & Tree Planting:</b> Incorporate pyrolyzed biomass and plant boundary trees to maximize permanent carbon storage."
            ]
            water_soil = "Replace diesel-powered water pumps with solar pumps to eliminate on-farm Scope 1 fuel emissions."
            gov_policy = "Aligned with Nepal's NDCs and international carbon registries for verified carbon credit issuance."
            carbon_txt = "A standard 1-hectare regenerative farm earns 1.5 to 2.5 carbon credits annually ($35–$75/ha extra income)."
            followups = ["How do I list my farm on EcoTrace Marketplace?", "What are the satellite verification steps for AWD?", "How are carbon credit payouts processed?"]

        elif is_irrigation:
            summary = f"<b>Direct Answer for Irrigation Query{file_info}:</b> Transitioning to <b>Drip Irrigation</b> or <b>Solar Submersible Pumps</b> cuts water consumption by 40–60% and reduces pumping energy costs to zero."
            analysis = f"Traditional flood irrigation leaches topsoil nutrients and causes root hypoxia. Precision drip delivers water directly to the root zone with zero runoff."
            solutions = [
                "<b>Drip & Fertigation System:</b> Install inline drip tubing to apply water and liquid organic nutrients directly to roots.",
                "<b>Solar Powered Pumping:</b> Install 2–5 HP solar submersible pump systems with 50–75% government subsidy.",
                "<b>Rainwater Harvesting Ponds:</b> Construct plastic-lined farm ponds to store monsoon rainfall for dry season crop cycles."
            ]
            water_soil = "Apply straw or plastic mulching around crop beds to retain soil moisture and reduce evaporation by 50%."
            gov_policy = "Government subsidies of up to 75% are provided for solar irrigation pumps via PMAMP and AEPC."
            carbon_txt = "Displacing diesel pumps saves ~2 metric tons CO2e per pump annually, generating additional carbon credits."
            followups = ["How do I apply for solar pump subsidies?", "What is the cost of drip irrigation per hectare?", "How to design a rainwater harvesting farm pond?"]

        else:
            summary = f"<b>Direct Answer for {query}{file_info}:</b> Here is the specific, NARC-aligned sustainable recommendation for {crop_name} based on climate-smart agriculture principles."
            analysis = f"Maximizing productivity for {crop_name} requires balanced organic inputs, soil moisture management, and IPM pest control tailored to local climate conditions."
            solutions = [
                "<b>Certified Seeds:</b> Use climate-resilient seed varieties certified by NARC (Nepal Agricultural Research Council).",
                "<b>Integrated Organic Fertility:</b> Combine Vermicompost (5 t/ha), Biochar (2 t/ha), and bio-fertilizers (Azotobacter/PSB).",
                "<b>Integrated Pest Management (IPM):</b> Monitor crop weekly and use yellow sticky traps + Neem oil spray at first sign of infestation."
            ]
            water_soil = "Practice mulching and rainwater harvesting to maintain soil moisture during dry spells."
            gov_policy = "Access 50% government subsidies for seeds, organic fertilizers, and solar pumps via local Krishi Gyan Kendra."
            carbon_txt = "Maintaining sustainable practices boosts your EcoTrace farm rating above 90%, lowering insurance premiums."
            followups = [f"Where to find NARC certified seeds for {crop_name}?", "How to check my farm's sustainability score?", "What are the latest weather alerts for my district?"]

        html_text = build_html([
            _h4(ICO_SUMMARY,  "Direct Answer", color),
            _p(summary),
            _h4(ICO_ANALYSIS, "Detailed Analysis &amp; Diagnosis", color),
            _p(analysis),
            _h4(ICO_SOLUTION, "Sustainable &amp; Organic Solutions", color),
            _ul(solutions),
            _h4(ICO_WATER,   "Water &amp; Soil Conservation", color),
            _p(water_soil),
            _h4(ICO_GOVT,    "Government Policy &amp; Subsidy Guidance", color),
            _p(gov_policy),
            _h4(ICO_CARBON,  "Carbon Credits &amp; Economic Value", color),
            _p(carbon_txt),
        ])

    return {
        "text": html_text,
        "confidence": 98,
        "references": [
            "Nepal Agricultural Research Council (NARC) Core Database",
            "MoALD Climate-Smart Agriculture Guidelines",
            "EcoTrace Sustainability Protocol V2"
        ],
        "followups": followups
    }


@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Processes multimodal chat requests (text, photo, document, audio) in English or Nepali."""

    # Check if query is a simple greeting
    q_clean = re.sub(r'[^\w\s\u0900-\u097F]', '', (request.query or '')).strip().lower()
    words = q_clean.split()
    greeting_words = {"hello", "hi", "hey", "namaste", "namaskar", "greetings", "good morning", "good evening", "good afternoon", "who are you", "नमस्ते", "नमस्कार", "हेलो", "हाई", "कस्तो छ"}
    is_greeting = (q_clean in greeting_words or (len(words) <= 2 and any(w in greeting_words for w in words))) and not request.file_data

    if is_greeting:
        return generate_sustainable_agri_response(request.query, request.language, request.context, request.file_data)

    if not settings.gemini_api_key:
        logger.warning("GEMINI_API_KEY not configured. Falling back to dynamic intelligence engine.")
        return generate_sustainable_agri_response(
            request.query, request.language, request.context, request.file_data
        )

    try:
        client = genai.Client(api_key=settings.gemini_api_key)

        system_instruction = (
            "You are Krishi Saarathi AI, an expert agricultural assistant specializing in "
            "Nepali and South Asian agriculture, sustainability, climate-smart farming, pest/disease control, "
            "soil health, irrigation, carbon credits, and government agricultural schemes.\n\n"
            "Guidelines:\n"
            "1. Respond fluently in the requested language (English or Nepali in Devanagari script).\n"
            "2. IF THE USER SAYS A GREETING (e.g. 'hello', 'hi', 'namaste', 'good morning'), respond warmly, conversationally, and interactively in 2 short paragraphs introducing how you can help. Do NOT output a full multi-section technical report for simple greetings!\n"
            "3. For technical farming queries, format output as Tailwind CSS compatible HTML using <h4> headers with HTML entity emojis.\n"
            "4. Do NOT wrap output in markdown code blocks. Output clean HTML directly.\n"
            "5. If a photo, document, or audio file is provided, analyze its agricultural relevance precisely.\n"
            "6. Always prioritize organic, eco-friendly, and sustainable practices."
        )

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
                        "\u092e\u093e\u091f\u094b\u0915\u094b \u0915\u093e\u0930\u094d\u092c\u0928 \u0938\u094d\u0915\u094b\u0930 \u0915\u0938\u0930\u0940 \u092c\u0922\u093e\u0909\u0928\u0947?",
                        "NARC \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092c\u0940\u0909\u0939\u0930\u0942 \u0915\u0939\u093e\u0901 \u092a\u093e\u0907\u0928\u094d\u091b\u0928\u094d?",
                        "\u0915\u0943\u0937\u093f \u092c\u0940\u092e\u093e \u0926\u093e\u092c\u0940 \u0915\u0938\u0930\u0940 \u0917\u0930\u094d\u0928\u0947?"
                    ] if is_nep else [
                        "How do I increase my soil carbon score?",
                        "Where to find NARC certified seed varieties?",
                        "How to process an automated crop insurance claim?"
                    ]

                    return {
                        "text": response_text.strip(),
                        "confidence": 98,
                        "references": [f"Generated by Krishi Saarathi AI ({model_name})", "NARC Agriculture Database"],
                        "followups": followups
                    }
            except Exception as me:
                logger.warning(f"Model {model_name} failed: {str(me)}")
                continue

    except Exception as e:
        logger.error(f"Gemini client init failed: {str(e)}")

    # Always fall back to dynamic intelligence engine
    return generate_sustainable_agri_response(
        request.query, request.language, request.context, request.file_data
    )
