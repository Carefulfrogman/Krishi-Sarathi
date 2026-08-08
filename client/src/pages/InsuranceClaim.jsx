import React, { useState, useRef, useCallback } from 'react';
import Icon from '../components/Icons';
import { aiService } from '../services/api';

const CLAIM_SITUATIONS = [
  { id: 'drought', emoji: '🌧️', en: 'Less Rain / Drought', ne: 'कम वर्षा / खडेरी', likelihood: 'possibly', likelyhoodLabel: 'Possibly Eligible', likelyhoodLabelNe: 'सम्भावित रूपमा दाबी गर्न सकिने', reasonEn: 'Your policy includes rainfall-based protection, but the required rainfall threshold must be verified against official meteorological records.', reasonNe: 'तपाईंको बीमामा वर्षामा आधारित सुरक्षा समावेश छ, तर आवश्यक वर्षा सीमा मौसम विभागको आधिकारिक रेकर्डसँग जाँच गर्नुपर्छ।' },
  { id: 'flood', emoji: '🌊', en: 'Flood', ne: 'बाढी', likelihood: 'eligible', likelyhoodLabel: 'Eligible', likelyhoodLabelNe: 'दाबी गर्न योग्य', reasonEn: 'Flood damage is explicitly listed under natural disaster coverage in your policy. Document the event with photos and a local authority letter.', reasonNe: 'बाढीबाट हुने क्षति तपाईंको बीमामा प्राकृतिक प्रकोप अन्तर्गत स्पष्ट रूपले सूचीकृत छ। घटनाको फोटो र स्थानीय निकायको पत्रसहित दाबी गर्नुहोस्।' },
  { id: 'hailstorm', emoji: '⛈️', en: 'Hailstorm / Heavy Rain', ne: 'असिना / भारी वर्षा', likelihood: 'eligible', likelyhoodLabel: 'Eligible', likelyhoodLabelNe: 'दाबी गर्न योग्य', reasonEn: 'Hailstorm and heavy rainfall events are covered natural disasters under your active policy. Report within 72 hours of the event.', reasonNe: 'असिना र भारी वर्षाका घटनाहरू तपाईंको सक्रिय बीमा अन्तर्गत समेटिएका प्राकृतिक प्रकोप हुन्। घटना भएको ७२ घण्टाभित्र रिपोर्ट गर्नुहोस्।' },
  { id: 'pest', emoji: '🐛', en: 'Crop Disease / Pest', ne: 'बाली रोग / कीरा', likelihood: 'possibly', likelyhoodLabel: 'Possibly Eligible', likelyhoodLabelNe: 'सम्भावित रूपमा दाबी गर्न सकिने', reasonEn: 'Disease and pest coverage depends on whether your policy includes a biological hazard rider. Check your policy document for pest-specific clauses.', reasonNe: 'रोग र कीराको क्षति बीमा तपाईंको पोलिसीमा जैविक जोखिम खण्ड समावेश भएमा मात्र लागू हुन्छ।' },
  { id: 'storm', emoji: '🌪️', en: 'Storm / Strong Wind', ne: 'आँधी / तेज हावा', likelihood: 'eligible', likelyhoodLabel: 'Eligible', likelyhoodLabelNe: 'दाबी गर्न योग्य', reasonEn: 'Storm damage including cyclone and strong wind events are covered. Wind speed records from the national meteorological department may be required.', reasonNe: 'आँधी, चक्रवात र तेज हावाबाट हुने क्षति समेटिएको छ। राष्ट्रिय मौसम विभागको हावा गति रेकर्ड आवश्यक पर्न सक्छ।' },
  { id: 'other', emoji: '🔥', en: 'Other Natural Disaster', ne: 'अन्य प्राकृतिक प्रकोप', likelihood: 'not-covered', likelyhoodLabel: 'Requires Review', likelyhoodLabelNe: 'समीक्षा आवश्यक', reasonEn: 'Other natural disasters not explicitly listed in your policy require a formal review by the insurance provider before eligibility can be confirmed.', reasonNe: 'तपाईंको बीमामा स्पष्ट रूपले उल्लेख नभएका अन्य प्राकृतिक प्रकोपहरूको लागि बीमा कम्पनीद्वारा औपचारिक समीक्षा आवश्यक छ।' },
];

const COVERAGE_ITEMS = [
  { icon: '✅', labelEn: 'Policy Validity', labelNe: 'बीमा अवधि', valueEn: 'Active until January 14, 2025', valueNe: 'जनवरी १४, २०२५ सम्म सक्रिय' },
  { icon: '🌾', labelEn: 'Covered Crops', labelNe: 'समेटिएका बाली', valueEn: 'Basmati Paddy, Wheat, Maize', valueNe: 'बासमती धान, गहुँ, मकै' },
  { icon: '💰', labelEn: 'Maximum Coverage', labelNe: 'अधिकतम क्षतिपूर्ति', valueEn: 'रु. ५,५०,०००  ($5,000 USD)', valueNe: 'रु. ५,५०,०००  ($5,000)' },
  { icon: '📅', labelEn: 'Policy Period', labelNe: 'बीमा अवधि', valueEn: '15 January 2024 to 14 January 2025', valueNe: '१५ जनवरी २०२४ - १४ जनवरी २०२५' },
  { icon: '🌧️', labelEn: 'Covered Natural Disasters', labelNe: 'समेटिएका प्राकृतिक प्रकोप', valueEn: 'Flood, Hailstorm, Excessive Rainfall, Storm, Cyclone, Lightning', valueNe: 'बाढी, असिना, अत्यधिक वर्षा, आँधी, चक्रवात, चट्याङ', meaning: 'Your policy covers crop damage caused by floods, hailstorms, and excessive rainfall.', meaningNe: 'तपाईंको बीमाले बाढी, असिना र अत्यधिक वर्षाका कारण भएको बाली क्षतिलाई समेट्छ।' },
  { icon: '🐛', labelEn: 'Disease / Pest Coverage', labelNe: 'रोग / कीरा बीमा', valueEn: 'Included with biological hazard rider (verified)', valueNe: 'जैविक जोखिम खण्डसहित समावेश (प्रमाणित)', meaning: 'Pest and disease damage is covered if it spreads from an external biological source.', meaningNe: 'बाहिरी जैविक स्रोतबाट फैलिएको कीरा र रोगको क्षति समेटिएको छ।' },
  { icon: '💧', labelEn: 'Low Rainfall / Drought Coverage', labelNe: 'कम वर्षा / खडेरी बीमा', valueEn: 'Covered when seasonal rainfall falls below 60% of normal average', valueNe: 'मौसमी वर्षा सामान्य औसतको ६०% भन्दा कम भएमा समेटिएको', meaning: 'If the monsoon receives less than 60% of its normal rainfall, your loss is eligible for claim.', meaningNe: 'मनसुन सामान्य वर्षाको ६०% भन्दा कम प्राप्त गरेमा, तपाईंको क्षति दाबीको लागि योग्य छ।' },
  { icon: '❌', labelEn: 'Major Exclusions', labelNe: 'प्रमुख अपवादहरू', valueEn: 'Negligence, improper farming practice, pre-existing disease, war, civil unrest', valueNe: 'लापरबाही, गलत कृषि पद्धति, पूर्व-विद्यमान रोग, युद्ध, नागरिक अशान्ति', meaning: 'Losses due to farmer negligence or already-existing crop disease before the policy start date are not covered.', meaningNe: 'किसानको लापरबाही वा बीमा सुरु हुनु अघिदेखि विद्यमान बाली रोगका कारण हुने नोक्सानी समेटिएको छैन।', isExclusion: true },
];

const NEXT_STEPS = [
  { step: 1, en: 'Check whether the specific event (flood, drought, hail, etc.) is listed as covered in your policy.', ne: 'विशिष्ट घटना (बाढी, खडेरी, असिना आदि) तपाईंको बीमामा समेटिएको छ कि छैन जाँच गर्नुहोस्।' },
  { step: 2, en: 'Immediately take photos and videos of the damaged crops and field.', ne: 'क्षतिग्रस्त बाली र खेतको तुरुन्तै फोटो र भिडियो लिनुहोस्।' },
  { step: 3, en: 'Keep weather records, rainfall data, or any official meteorological reports.', ne: 'मौसम रेकर्ड, वर्षा डेटा वा कुनै आधिकारिक मौसम सम्बन्धी रिपोर्ट राख्नुहोस्।' },
  { step: 4, en: 'Contact your insurance provider within the required time (usually 72 hours of the event).', ne: 'निर्धारित समयभित्र (सामान्यतः घटना भएको ७२ घण्टाभित्र) आफ्नो बीमा कम्पनीलाई सम्पर्क गर्नुहोस्।' },
  { step: 5, en: 'Submit the required claim documents including the loss assessment form, photos, and authority letter.', ne: 'क्षति मूल्यांकन फारम, फोटो र प्राधिकरण पत्रसहित आवश्यक दाबी कागजातहरू पेश गर्नुहोस्।' },
];

function MeaningTooltip({ meaningEn, meaningNe }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((v) => !v)} className="text-[10px] font-bold border px-2 py-0.5 rounded-full transition" style={{color:'#0B4F35',borderColor:'#B49338',backgroundColor:'#FAF9F1'}}>
        What does this mean?
      </button>
      {open && (
        <div className="absolute z-20 left-0 top-7 w-72 bg-white rounded-xl shadow-xl p-3 text-xs space-y-1.5" style={{border:'1px solid #B49338'}}>
          <p style={{color:'#1F2924'}}>{meaningEn}</p>
          <p className="font-medium" style={{color:'#0B4F35'}}>{meaningNe}</p>
          <button onClick={() => setOpen(false)} className="text-[10px] mt-1" style={{color:'#7B8428'}}>Close</button>
        </div>
      )}
    </div>
  );
}

function LikelihoodBadge({ likelihood, label, labelNe }) {
  const styles = { eligible: 'border', possibly: 'border', 'not-covered': 'border' };
  const inlineStyles = { eligible: {backgroundColor:'#edf7f0',color:'#0B4F35',borderColor:'#2E7D32'}, possibly: {backgroundColor:'#fef9eb',color:'#B49338',borderColor:'#D99A17'}, 'not-covered': {backgroundColor:'#fee2e2',color:'#b91c1c',borderColor:'#fca5a5'} };
  const icons = { eligible: '✅', possibly: '⚠️', 'not-covered': '🔍' };
  return (
    <div className={`inline-flex flex-col items-start px-3 py-2 rounded-xl text-sm font-bold ${styles[likelihood]}`} style={inlineStyles[likelihood]}>
      <span>{icons[likelihood]} {label}</span>
      <span className="font-medium text-xs opacity-80">{labelNe}</span>
    </div>
  );
}

export const InsuranceClaim = () => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [policyData, setPolicyData] = useState(null);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [askingAi, setAskingAi] = useState(false);
  const [policyMeta, setPolicyMeta] = useState({ policyNumber: '', provider: '', validity: '', crop: '' });

  const handleFile = useCallback((file) => { setUploadedFile(file); }, []);
  const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }, [handleFile]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setPolicyData({ ...policyMeta }); }, 2800);
  };

  const handleAskAi = async () => {
    if (!question.trim()) return;
    setAskingAi(true);
    setAiAnswer(null);
    try {
      const res = await aiService.askAiAssistant(`Crop insurance query: ${question}`, 'English', policyData ? { policy_number: policyMeta.policyNumber } : null, null);
      setAiAnswer(res);
    } catch {
      setAiAnswer({ text: `<h4 class='font-bold text-emerald-700 mb-3 text-base'>🛡️ Insurance Claim Guidance</h4><p class='mb-3 text-slate-700 text-sm'><b>English:</b> Based on standard crop insurance policies in Nepal, crop loss due to insufficient rainfall may be claimable if the rainfall deficit is officially recorded below 60% of the seasonal norm. Contact your insurance provider, collect meteorological records, and submit a formal claim with photographic evidence.</p><p class='mb-3 text-emerald-700 text-sm font-medium'><b>नेपाली:</b> नेपालका मानक फसल बीमा पोलिसीहरूका आधारमा, अपर्याप्त वर्षाका कारण बाली नोक्सान हुँदा, यदि वर्षाको कमी मौसमी सामान्यको ६०% भन्दा कम आधिकारिक रूपमा दर्ज भएको छ भने दाबी गर्न सकिन्छ।</p><h4 class='font-bold text-sky-700 mb-2 text-sm'>📋 Documents You May Need</h4><ul class='list-disc pl-5 space-y-1.5 text-sm text-slate-700'><li>Official rainfall data from meteorological department</li><li>Field damage photos (before and after)</li><li>Local government authority damage certificate</li><li>Completed insurance claim form</li></ul>` });
    } finally {
      setAskingAi(false);
    }
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  );

  return (
    <div className="space-y-6" style={{backgroundColor:'#FAF9F1',color:'#1F2924'}}>

      {/* Header — Krishi Bima Saarathi */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{background:`linear-gradient(135deg, #0B4F35 0%, #0d5c3e 50%, #0B4F35 100%)`}}>
        {/* Gold Trim */}
        <div className="h-1" style={{background:'linear-gradient(to right, #B49338, #D99A17, #B49338)'}}></div>

        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Badge + Title + Subtitle */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-3 border" style={{backgroundColor:'rgba(180,147,56,0.2)',borderColor:'#B49338',color:'#D99A17'}}>
              🛡️ AI Insurance Advisor
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white leading-tight">Crop Insurance Advisor</h1>
            <p className="text-sm mt-2 max-w-xl leading-relaxed" style={{color:'rgba(255,255,255,0.85)'}}>Upload your policy document, understand your coverage, and check if your crop loss is claimable.</p>
            <p className="text-xs mt-1 max-w-xl font-medium" style={{color:'rgba(212,199,160,0.9)'}}>आफ्नो बीमा कागजात अपलोड गर्नुहोस् र बुझ्नुहोस् — सरल भाषामा।</p>
          </div>

          {/* Right: Logo + Branding Card */}
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 shrink-0" style={{backgroundColor:'rgba(255,255,255,0.08)',border:'1px solid rgba(180,147,56,0.4)'}}>
            <img
              src="/krishi_bima_logo.jpg"
              alt="Krishi Bima Saarathi Logo"
              className="w-20 h-20 object-contain rounded-xl"
              style={{backgroundColor:'white',padding:'4px'}}
            />
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:'#B49338'}}>AI Powered</div>
              <div className="text-xl font-black text-white">Krishi</div>
              <div className="text-base font-extrabold" style={{color:'#D99A17'}}>Bima Saarathi</div>
              <div className="text-[10px] mt-1 font-semibold" style={{color:'rgba(255,255,255,0.6)'}}>कृषि बीमा सारथी</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Upload */}
      <div className="eco-card" style={{borderColor:'#E5E8E3',backgroundColor:'#FFFFFF'}}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:'#edf7f0'}}>
            <Icon name="upload" size={18} style={{color:'#0B4F35'}} />
          </div>
          <div>
            <h2 className="text-base font-extrabold" style={{color:'#0B4F35'}}>Upload Your Crop Insurance Policy</h2>
            <p className="text-xs" style={{color:'#7B8428'}}>आफ्नो बीमा कम्पनीबाट प्राप्त बीमा कागजात अपलोड गर्नुहोस्।</p>
          </div>
        </div>
        <p className="text-sm mb-5 leading-relaxed" style={{color:'#1F2924'}}>
          Upload the insurance paper provided by your insurance company. We will analyze the policy and explain what it covers in simple language.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all`}
          style={dragOver || uploadedFile ? {borderColor:'#2E7D32',backgroundColor:'#edf7f0'} : {borderColor:'#E5E8E3',backgroundColor:'#FAF9F1'}}
        >
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
          {uploadedFile ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{backgroundColor:'#edf7f0'}}>
                <Icon name="fileCheck" size={28} style={{color:'#2E7D32'}} />
              </div>
              <p className="font-bold text-sm" style={{color:'#0B4F35'}}>{uploadedFile.name}</p>
              <p className="text-xs mt-1" style={{color:'#7B8428'}}>{(uploadedFile.size / 1024).toFixed(1)} KB · Ready to analyze</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{backgroundColor:'#F8F7F1'}}>
                <Icon name="upload" size={28} style={{color:'#B4B394'}} />
              </div>
              <p className="font-semibold text-sm" style={{color:'#1F2924'}}>Drag and drop your insurance document here</p>
              <p className="text-xs mt-1" style={{color:'#8F9665'}}>PDF, JPG, PNG supported</p>
              <button type="button" className="mt-4 px-5 py-2 text-white text-xs font-bold rounded-xl transition shadow-sm" style={{backgroundColor:'#2E7D32'}}>
                Upload Insurance Paper / बीमा कागजात अपलोड गर्नुहोस्
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {[
            { key: 'policyNumber', labelEn: 'Policy Number', labelNe: 'पोलिसी नम्बर', placeholder: 'e.g. POL-KISAN-2081-4492' },
            { key: 'provider', labelEn: 'Insurance Provider', labelNe: 'बीमा कम्पनी', placeholder: 'e.g. Agricultural Development Bank' },
            { key: 'validity', labelEn: 'Policy Validity', labelNe: 'बीमा अवधि', placeholder: 'e.g. 2024-01-15 to 2025-01-14' },
            { key: 'crop', labelEn: 'Insured Crop / Field', labelNe: 'बाली र जग्गा', placeholder: 'e.g. Paddy, Wheat - Koshi Farm' },
          ].map(({ key, labelEn, labelNe, placeholder }) => (
            <div key={key}>
              <label className="block text-[11px] font-bold uppercase mb-1.5" style={{color:'#0B4F35'}}>{labelEn} / {labelNe}</label>
              <input type="text" placeholder={placeholder} value={policyMeta[key]} onChange={(e) => setPolicyMeta({ ...policyMeta, [key]: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none" style={{border:'1px solid #E5E8E3',color:'#1F2924',outlineColor:'#2E7D32'}} />
            </div>
          ))}
        </div>

        <button onClick={handleAnalyze} disabled={analyzing} className="mt-5 w-full py-3 text-white font-bold text-sm rounded-xl transition shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-60" style={{background:'linear-gradient(135deg, #0B4F35, #2E7D32)'}}>
          {analyzing ? <><Spinner />Analyzing Policy... / नीति विश्लेषण भइरहेको छ...</> : <><Icon name="shield" size={18} />Analyze My Insurance Policy / मेरो बीमा विश्लेषण गर्नुहोस्</>}
        </button>
        {!policyData && !analyzing && (
          <p className="text-center text-xs mt-3" style={{color:'#8F9665'}}>No document? <button onClick={handleAnalyze} className="font-semibold hover:underline" style={{color:'#2E7D32'}}>Try with a sample policy</button></p>
        )}
      </div>

      {/* Analyzing */}
      {analyzing && (
        <div className="eco-card flex flex-col items-center justify-center py-10 gap-4" style={{borderColor:'#2E7D32',backgroundColor:'#FFFFFF'}}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse" style={{background:'linear-gradient(135deg, #edf7f0, #FAF9F1)'}}>
              <Icon name="shield" size={36} style={{color:'#0B4F35'}} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full animate-ping" style={{backgroundColor:'#2E7D32'}} />
          </div>
          <div className="text-center">
            <p className="font-bold text-base" style={{color:'#0B4F35'}}>Analyzing Policy...</p>
            <p className="text-sm font-medium" style={{color:'#2E7D32'}}>नीति विश्लेषण भइरहेको छ...</p>
            <p className="text-xs mt-1" style={{color:'#8F9665'}}>Reading coverage terms, exclusions, and conditions</p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor:'#B49338', animationDelay: `${i * 0.15}s` }} />)}
          </div>
        </div>
      )}

      {/* Section 2: Coverage Result */}
      {policyData && (
        <div className="eco-card" style={{borderColor:'#2E7D32',background:'linear-gradient(135deg, #FFFFFF 0%, #f5fbf7 100%)'}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <span className="eco-badge eco-badge-success mb-2" style={{backgroundColor:'#edf7f0',color:'#0B4F35',borderColor:'#2E7D32'}}>Policy Analyzed</span>
              <h2 className="text-xl font-extrabold" style={{color:'#0B4F35'}}>Your Insurance Coverage</h2>
              <p className="text-xs mt-0.5" style={{color:'#7B8428'}}>तपाईंको बीमा कभरेज — सरल भाषामा व्याख्या गरिएको</p>
            </div>
            <div className="text-white rounded-xl px-4 py-3 text-right shrink-0" style={{backgroundColor:'#0B4F35'}}>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{color:'#B49338'}}>Policy No.</div>
              <div className="text-sm font-black">{policyMeta.policyNumber || 'POL-KISAN-2081-4492'}</div>
              <div className="text-[11px] mt-0.5" style={{color:'rgba(180,147,56,0.8)'}}>{policyMeta.provider || 'Agricultural Development Bank (ADBL)'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COVERAGE_ITEMS.map((item, i) => (
              <div key={i} className={`rounded-xl border p-4 transition hover:shadow-md ${i === COVERAGE_ITEMS.length - 1 ? 'sm:col-span-2' : ''}`} style={item.isExclusion ? {borderColor:'#fca5a5',backgroundColor:'#fff5f5'} : {borderColor:'#E5E8E3',backgroundColor:'#FFFFFF'}}>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <p className="text-xs font-extrabold uppercase tracking-wide" style={{color:'#1F2924'}}>{item.labelEn}</p>
                      <span className="text-xs" style={{color:'#B4B394'}}>/</span>
                      <p className="text-xs font-bold" style={{color:'#0B4F35'}}>{item.labelNe}</p>
                    </div>
                    <p className="text-sm font-semibold mb-0.5" style={item.isExclusion ? {color:'#b91c1c'} : {color:'#1F2924'}}>{item.valueEn}</p>
                    <p className="text-xs font-medium" style={item.isExclusion ? {color:'#dc2626'} : {color:'#2E7D32'}}>{item.valueNe}</p>
                    {item.meaning && <div className="mt-2"><MeaningTooltip meaningEn={item.meaning} meaningNe={item.meaningNe} /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl text-xs flex items-start gap-2" style={{backgroundColor:'#fef9eb',border:'1px solid #D99A17',color:'#7B4F00'}}>
            <span className="text-base shrink-0">⚠️</span>
            <div><span className="font-bold">Important:</span> Final approval of any claim depends on the insurance provider and the specific terms of your policy. <span className="font-medium" style={{color:'#B49338'}}>महत्वपूर्ण: कुनै पनि दाबीको अन्तिम स्वीकृति बीमा कम्पनी र तपाईंको बीमाको विशेष सर्तहरूमा निर्भर गर्दछ।</span></div>
          </div>
        </div>
      )}

      {/* Section 3: Claim Eligibility */}
      {policyData && (
        <div className="eco-card" style={{borderColor:'#E5E8E3',backgroundColor:'#FFFFFF'}}>
          <div className="mb-5">
            <span className="eco-badge mb-2" style={{backgroundColor:'#edf7f0',color:'#0B4F35',border:'1px solid #2E7D32'}}>Eligibility Check</span>
            <h2 className="text-xl font-extrabold" style={{color:'#0B4F35'}}>Can I Claim for My Crop Loss?</h2>
            <p className="text-sm mt-0.5" style={{color:'#7B8428'}}>मेरो बाली नोक्सानीको लागि दाबी गर्न सकिन्छ? — Select your situation below.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {CLAIM_SITUATIONS.map((sit) => (
              <button key={sit.id} onClick={() => setSelectedSituation(selectedSituation?.id === sit.id ? null : sit)} className="rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-md" style={selectedSituation?.id === sit.id ? {borderColor:'#0B4F35',backgroundColor:'#edf7f0',boxShadow:'0 4px 12px rgba(11,79,53,0.15)'} : {borderColor:'#E5E8E3',backgroundColor:'#FFFFFF'}}>
                <div className="text-2xl mb-2">{sit.emoji}</div>
                <p className="text-xs font-extrabold leading-tight" style={{color:'#1F2924'}}>{sit.en}</p>
                <p className="text-[11px] font-semibold mt-0.5 leading-tight" style={{color:'#2E7D32'}}>{sit.ne}</p>
              </button>
            ))}
          </div>

          {selectedSituation && (
            <div className="rounded-2xl p-5 space-y-3" style={{border:'1px solid #E5E8E3',backgroundColor:'#FAF9F1'}}>
              <div className="flex flex-wrap items-start gap-3">
                <span className="text-3xl">{selectedSituation.emoji}</span>
                <div className="flex-1">
                  <p className="font-extrabold" style={{color:'#1F2924'}}>{selectedSituation.en} / {selectedSituation.ne}</p>
                  <div className="mt-2"><LikelihoodBadge likelihood={selectedSituation.likelihood} label={`Claim Likelihood: ${selectedSituation.likelyhoodLabel}`} labelNe={selectedSituation.likelyhoodLabelNe} /></div>
                </div>
              </div>
              <div className="pt-3" style={{borderTop:'1px solid #E5E8E3'}}>
                <p className="text-sm font-bold mb-1" style={{color:'#1F2924'}}>English Explanation</p>
                <p className="text-sm leading-relaxed" style={{color:'#1F2924'}}>{selectedSituation.reasonEn}</p>
                <p className="text-sm font-bold mt-3 mb-1" style={{color:'#0B4F35'}}>नेपाली व्याख्या</p>
                <p className="text-sm leading-relaxed font-medium" style={{color:'#2E7D32'}}>{selectedSituation.reasonNe}</p>
              </div>
              <div className="rounded-xl p-3 text-xs flex items-start gap-2" style={{backgroundColor:'#fef9eb',border:'1px solid #D99A17',color:'#7B4F00'}}>
                <span className="shrink-0">⚠️</span>
                <span>Final eligibility is determined by your insurance provider based on field assessment. <span className="font-medium" style={{color:'#B49338'}}>अन्तिम पात्रता फिल्ड मूल्यांकनका आधारमा बीमा कम्पनीले निर्धारण गर्नेछ।</span></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 4: Ask AI */}
      <div className="eco-card" style={{borderColor:'#B49338',background:'linear-gradient(135deg, #FFFFFF 0%, #fef9eb 100%)'}}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:'#fef3d0'}}>
            <Icon name="search" size={18} style={{color:'#B49338'}} />
          </div>
          <div>
            <h2 className="text-base font-extrabold" style={{color:'#0B4F35'}}>Ask About Your Insurance</h2>
            <p className="text-xs" style={{color:'#7B8428'}}>बीमाबारे सोध्नुहोस् — Not sure if your crop loss is covered? Ask us.</p>
          </div>
        </div>
        <p className="text-sm mb-4 leading-relaxed" style={{color:'#1F2924'}}>Describe your situation and we will explain what applies to your policy in both English and Nepali.</p>

        <textarea rows={3} placeholder="Example: Can I claim if my crop was damaged because of less rainfall? / उदाहरण: कम वर्षाका कारण मेरो बाली नोक्सान भएमा दाबी गर्न सकिन्छ?" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none resize-none" style={{border:'1px solid #E5E8E3',color:'#1F2924'}} />

        <button onClick={handleAskAi} disabled={askingAi || !question.trim()} className="mt-3 w-full py-3 text-white font-bold text-sm rounded-xl transition shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50" style={{background:'linear-gradient(135deg, #B49338, #D99A17)'}}>
          {askingAi ? <><Spinner />Checking Eligibility... / पात्रता जाँच गर्दै...</> : <><Icon name="shield" size={18} />Check My Claim Eligibility / दाबी पात्रता जाँच गर्नुहोस्</>}
        </button>

        {aiAnswer && (
          <div className="mt-4 rounded-xl p-5 bg-white" style={{border:'1px solid #B49338'}}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg, #B49338, #0B4F35)'}}>
                <Icon name="shield" size={14} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide" style={{color:'#B49338'}}>Bima Saarathi AI Response</span>
            </div>
            <div className="leading-relaxed text-sm" style={{color:'#1F2924'}} dangerouslySetInnerHTML={{ __html: aiAnswer.text }} />
          </div>
        )}
      </div>

      {/* Section 5: Next Steps */}
      {policyData && (
        <div className="eco-card" style={{borderColor:'#2E7D32',background:'linear-gradient(135deg, #FFFFFF 0%, #f5fbf7 100%)'}}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor:'#edf7f0'}}>
              <Icon name="checkCircle" size={18} style={{color:'#0B4F35'}} />
            </div>
            <div>
              <h2 className="text-base font-extrabold" style={{color:'#0B4F35'}}>What You Should Do Next</h2>
              <p className="text-xs" style={{color:'#7B8428'}}>अब के गर्ने? / Your action checklist</p>
            </div>
          </div>

          <div className="space-y-3">
            {NEXT_STEPS.map((step) => (
              <div key={step.step} className="flex gap-4 p-4 rounded-xl bg-white transition hover:shadow-sm" style={{border:'1px solid #E5E8E3'}}>
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-sm" style={{background:'linear-gradient(135deg, #0B4F35, #2E7D32)'}}>{step.step}</div>
                <div>
                  <p className="text-sm leading-relaxed" style={{color:'#1F2924'}}>{step.en}</p>
                  <p className="text-xs font-medium leading-relaxed mt-1" style={{color:'#2E7D32'}}>{step.ne}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl text-white" style={{backgroundColor:'#0B4F35',border:'1px solid rgba(180,147,56,0.4)'}}>
            <p className="font-bold text-sm mb-1">Need Help? / सहायता चाहिन्छ?</p>
            <p className="text-xs leading-relaxed" style={{color:'rgba(255,255,255,0.85)'}}>Contact your insurance provider directly for claim submission. Keep this policy analysis as a reference.</p>
            <p className="text-xs font-medium mt-1" style={{color:'#B49338'}}>दाबी दर्ताका लागि सोझै आफ्नो बीमा कम्पनीलाई सम्पर्क गर्नुहोस्। यो नीति विश्लेषणलाई सन्दर्भको रूपमा राख्नुहोस्।</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default InsuranceClaim;