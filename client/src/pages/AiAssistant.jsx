import React, { useState, useRef, useEffect } from 'react';
import { aiService, mockData } from '../services/api';
import Icon from '../components/Icons';

// Localized strings in English and Nepali
const localizations = {
  en: {
    title: 'AI Krishi Assistant',
    subtitle: 'Multilingual smart helper for crops, soil, pests, irrigation, and government schemes.',
    placeholder: 'Ask anything about crop diseases, fertilizers, weather, soil reports, carbon credits...',
    send: 'Send',
    recording: 'Recording Voice...',
    clickRecord: 'Speak',
    upload: 'Attach File',
    clearChat: 'Clear Chat',
    confidence: 'AI Confidence',
    references: 'References & Sources',
    followups: 'Suggested Follow-ups',
    unrelatedTitle: 'Off-topic Query Detected',
    unrelatedMessage: "I'm sorry, I am programmed to assist only with agriculture, crops, soil, weather, fertilizers, carbon credits, insurance, and government farming schemes. Please ask a farming-related question!",
    quickPrompts: [
      { text: 'Identify Paddy Leaf Disease from photo', icon: 'sprout' },
      { text: 'Best Organic Fertilizer for Basmati Rice', icon: 'activity' },
      { text: 'Subsidies for Solar Irrigation in Nepal', icon: 'shield' },
      { text: 'Explain Carbon Credit trading steps', icon: 'award' },
      { text: 'Analyze Soil Test Report PDF Document', icon: 'file' }
    ]
  },
  ne: {
    title: 'एआई कृषि सहायक',
    subtitle: 'बाली, माटो, कीरा, सिँचाइ र सरकारी योजनाहरूको लागि बहुभाषिक स्मार्ट सहायक।',
    placeholder: 'रोग, मौसम, माटो रिपोर्ट, मल, कार्बन क्रेडिट बारे सोध्नुहोस्...',
    send: 'पठाउनुहोस्',
    recording: 'आवाज रेकर्ड हुँदैछ...',
    clickRecord: 'बोल्नुहोस्',
    upload: 'फाइल थप्नुहोस्',
    clearChat: 'च्याट खाली गर्नुहोस्',
    confidence: 'एआई शुद्धता',
    references: 'सन्दर्भ र स्रोतहरू',
    followups: 'सुझाव गरिएका प्रश्नहरू',
    unrelatedTitle: 'गैर-कृषि प्रश्न फेला पर्यो',
    unrelatedMessage: 'माफ गर्नुहोस्, म केवल कृषि, बाली, माटो, मौसम, मल, कार्बन क्रेडिट, बीमा र सरकारी खेती योजनाहरूमा मद्दत गर्न सक्छु। कृपया खेती सम्बन्धी प्रश्न सोध्नुहोस्!',
    quickPrompts: [
      { text: 'तस्बिरबाट धानको पातको रोग पहिचान गर्नुहोस्', icon: 'sprout' },
      { text: 'बासमती धानका लागि उत्तम जैविक मल', icon: 'activity' },
      { text: 'नेपालमा सौर्य सिँचाइ अनुदान सम्बन्धी जानकारी', icon: 'shield' },
      { text: 'कार्बन क्रेडिट व्यापार कसरी गर्ने?', icon: 'award' },
      { text: 'माटो परीक्षण रिपोर्ट PDF विश्लेषण गर्नुहोस्', icon: 'file' }
    ]
  }
};

const getWelcomeMessage = (language) => ({
  id: 1,
  sender: 'ai',
  text: language === 'en'
    ? `<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-base'>&#x1F44B; Hello! I am your EcoTrace Farm AI.</h4>
<p class='mb-3 text-slate-700 leading-relaxed text-sm'>I am your agricultural assistant — I can help with crop health, disease diagnosis, soil fertility, irrigation, carbon credits, and sustainable farming practices.</p>
<p class='mb-2 font-bold text-slate-800 text-sm'>How you can interact with me:</p>
<ul class='list-disc pl-5 space-y-1.5 mb-3 text-slate-700 text-sm'>
  <li><b>📸 Crop Leaf Photo:</b> Upload an image of an affected leaf/plant part for symptom analysis.</li>
  <li><b>📄 Soil &amp; PDF Reports:</b> Upload soil test documents to get organic soil health advice.</li>
  <li><b>🎵 Voice Notes:</b> Record an audio question in English or Nepali.</li>
  <li><b>🌾 Direct Questions:</b> Ask any query about crop diseases, fertilizers, or carbon credits.</li>
</ul>`
    : `<h4 class='font-bold text-emerald-800 flex items-center gap-2 mb-2 text-base'>&#x1F44B; नमस्ते! म EcoTrace Farm AI हुँ।</h4>
<p class='mb-3 text-slate-700 leading-relaxed text-sm'>म तपाईंको कृषि सहायक हुँ — बाली रोग, माटो, सिँचाइ, मल र दिगो खेती सम्बन्धी प्रश्नहरूमा सहयोग गर्न सक्छु।</p>
<p class='mb-2 font-bold text-slate-800 text-sm'>तपाईंले मलाई कसरी प्रश्न सोध्न सक्नुहुन्छ:</p>
<ul class='list-disc pl-5 space-y-1.5 mb-3 text-slate-700 text-sm'>
  <li><b>📸 बाली पातको तस्बिर:</b> रोग पहिचानका लागि प्रभावित भागको तस्बिर पठाउनुहोस्।</li>
  <li><b>📄 माटो परीक्षण PDF:</b> माटो परीक्षण रिपोर्ट अपलोड गरी सुझाव लिनुहोस्।</li>
  <li><b>🎵 आवाज रेकर्ड:</b> नेपाली वा अंग्रेजीमा बोलेर प्रश्न सोध्नुहोस्।</li>
  <li><b>🌾 प्रत्यक्ष प्रश्न:</b> बालीनाली वा कार्बन क्रेडिट सम्बन्धी जुनसुकै प्रश्न टाइप गर्नुहोस्।</li>
</ul>`,
  references: ['EcoTrace Farm AI Core Assistant', 'NARC Guidelines'],
  followups: language === 'en'
    ? ['What are common crop diseases in Nepal?', 'How do I improve soil health?', 'What is carbon farming?']
    : ['धानमा लाग्ने मुख्य रोगहरू के हुन्?', 'माटो परीक्षण किन गर्नुपर्छ?', 'कार्बन क्रेडिट के हो?']
});

export const AiAssistant = () => {
  const [lang, setLang] = useState('en');
  const t = localizations[lang];

  const [messages, setMessages] = useState([getWelcomeMessage('en')]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 1) {
        return [getWelcomeMessage(lang)];
      }
      return prev;
    });
  }, [lang]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice Input via Web Speech API
  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert(lang === 'en' ? "Your browser doesn't support speech recognition." : "तपाईंको ब्राउजरले आवाज पहिचान समर्थन गर्दैन।");
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'en' ? 'en-US' : 'ne-NP';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        let finalTranscript = '';
        
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
             setInputText(prev => (prev.trim() + ' ' + finalTranscript.trim()).trim());
             finalTranscript = '';
          }
        };
        recognition.onerror = (event) => {
          console.error("Speech error:", event.error);
          if (event.error === 'not-allowed') {
            alert(lang === 'en' ? "Microphone access was denied. Please allow it in settings." : "माइक्रोफोन अनुमति अस्वीकार गरियो। कृपया सेटिङमा अनुमति दिनुहोस्।");
          }
          setIsRecording(false);
        };
        recognition.onend = () => setIsRecording(false);
        
        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error("Mic permission denied or error:", err);
        alert(lang === 'en' ? "Could not access microphone. Please check permissions." : "माइक्रोफोनमा पहुँच पुगेन। कृपया अनुमति जाँच्नुहोस्।");
        setIsRecording(false);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFile({
          file: file,
          name: file.name,
          type: file.type || 'application/octet-stream',
          base64: reader.result,
          size: (file.size / 1024).toFixed(1) + ' KB'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !attachedFile) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText || (lang === 'en' ? `[Analyzed attached ${attachedFile.name}]` : `[संलग्न ${attachedFile.name} को विश्लेषण गर्नुहोस्]`),
      file: attachedFile ? { 
        name: attachedFile.name, 
        type: attachedFile.type, 
        size: attachedFile.size,
        base64: attachedFile.base64
      } : null
    };

    setMessages((prev) => [...prev, userMsg]);
    
    let queryText = inputText;
    if (!queryText.trim() && attachedFile) {
      queryText = `Please analyze the attached ${attachedFile.type.includes('image') ? 'photo' : attachedFile.type.includes('audio') ? 'audio voice clip' : 'document'} (${attachedFile.name}) for agricultural recommendations.`;
    }

    let filePayload = null;
    if (attachedFile) {
      filePayload = {
        name: attachedFile.name,
        type: attachedFile.type,
        data: attachedFile.base64
      };
    }

    setInputText('');
    setAttachedFile(null);
    setIsTyping(true);

    try {
      const context = {
        farm: mockData.farms[0],
        weather: mockData.weather,
        sustainability: mockData.sustainability,
        carbonCredits: {
            available: mockData.carbonCredits.credits_available,
            price: mockData.carbonCredits.price_per_credit
        }
      };

      const response = await aiService.askAiAssistant(
        queryText, 
        lang === 'en' ? 'English' : 'Nepali', 
        context,
        filePayload
      );
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.text,
          confidence: response.confidence || 98,
          references: response.references || ["Generated by Krishi Saarathi AI"],
          followups: response.followups || []
        }
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMsg = lang === 'en' 
        ? `<h4 class="font-bold text-red-700 flex items-center gap-2 mb-3">⚠️ Service Notice</h4>
           <p>Unable to connect to the AI server. Please verify your connection or retry.</p>`
        : `<h4 class="font-bold text-red-700 flex items-center gap-2 mb-3">⚠️ सेवा सूचना</h4>
           <p>एआई सर्भरमा जडान गर्न सकिएन। कृपया आफ्नो इन्टरनेट जाँच गरी पुनः प्रयास गर्नुहोस्।</p>`;
           
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: errorMsg,
          confidence: 0,
          references: [],
          followups: []
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputText(promptText);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: lang === 'en' 
          ? 'Chat cleared. Ask me anything about farming, soil, pests, or carbon credits!' 
          : 'च्याट खाली गरियो। खेती, माटो, कीरा, वा कार्बन क्रेडिट बारे केही पनि सोध्नुहोस्!',
        confidence: 100,
        references: [],
        followups: []
      }
    ]);
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    return '📎';
  };

  return (
    <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col h-[calc(100vh-5.5rem)] min-h-[720px]">
      {/* Header & Language Toggle */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shrink-0 mb-4">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-blue-600 to-teal-500"></div>
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🤖</span> {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Language Toggle buttons */}
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-xs ${
              lang === 'en' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ne')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-xs ${
              lang === 'ne' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            नेपाली (Nepali)
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition ml-1"
            title={t.clearChat}
          >
            <Icon name="trash" size={20} />
          </button>
        </div>
      </div>

      {/* Main Chat Interface - Roomier & Expanded Height */}
      <div className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Chat History Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scroll-smooth" style={{scrollbarWidth:'thin', scrollbarColor:'#d1fae5 transparent'}}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble - Wider & More Readable */}
                <div
                  className={`w-full max-w-3xl sm:max-w-4xl p-5 sm:p-6 rounded-3xl text-sm sm:text-base leading-relaxed break-words overflow-hidden ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-md'
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none shadow-xs'
                  }`}
                >
                  {/* File attachment preview inside message */}
                  {msg.file && (
                    <div className="mb-3.5 p-3 bg-slate-900/10 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 border border-white/20">
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-lg">{getFileIcon(msg.file.type)}</span>
                        <span className="truncate font-bold">{msg.file.name}</span>
                      </span>
                      {msg.file.size && <span className="text-xs opacity-80 shrink-0">{msg.file.size}</span>}
                    </div>
                  )}

                  {/* Image preview thumbnail if uploaded photo */}
                  {msg.file && msg.file.type.includes('image') && msg.file.base64 && (
                    <div className="mb-4 rounded-2xl overflow-hidden max-h-64 border border-white/30 shadow-xs">
                      <img src={msg.file.base64} alt={msg.file.name} className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {msg.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} className="ai-formatted-content space-y-3" />
                  ) : (
                    msg.text
                  )}


                </div>

                {/* References and Suggested Follow-ups for AI messages */}
                {msg.sender === 'ai' && (msg.references?.length > 0 || msg.followups?.length > 0) && (
                  <div className="mt-3 pl-4 border-l-2 border-emerald-500/40 space-y-2.5 max-w-3xl sm:max-w-4xl">
                    {msg.references?.length > 0 && (
                      <div className="text-xs text-slate-400 font-medium">
                        <span className="font-extrabold uppercase text-slate-500">{t.references}: </span>
                        {msg.references.join(' • ')}
                      </div>
                    )}

                    {msg.followups?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.followups.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickPrompt(q)}
                            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-extrabold rounded-xl border border-emerald-200/80 transition shadow-xs text-left"
                          >
                            💡 {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2.5 p-4 sm:p-5 bg-slate-50 border border-slate-100 rounded-3xl rounded-tl-none w-36 shadow-xs">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-500 font-bold ml-1">AI Thinking</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Interactive Input Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3 shrink-0">
            
            {/* File attachment preview bar */}
            {attachedFile && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold shadow-xs">
                <span className="flex items-center gap-2 truncate">
                  <span className="text-xl">{getFileIcon(attachedFile.type)}</span>
                  <span className="truncate">{attachedFile.name}</span>
                  <span className="text-xs text-emerald-600 font-normal shrink-0">({attachedFile.size})</span>
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="px-2.5 py-1 text-emerald-700 hover:text-red-600 hover:bg-red-50 rounded-xl font-black transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Waveform Recording Animation */}
            {isRecording && (
              <div className="flex items-center justify-between p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs sm:text-sm font-bold shadow-xs">
                <span className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                  {t.recording}
                </span>
                <div className="flex items-center gap-1.5 h-6">
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-3"></span>
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-6 [animation-delay:0.1s]"></span>
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-3 [animation-delay:0.2s]"></span>
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-6 [animation-delay:0.3s]"></span>
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-4 [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* File Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
                  className="absolute inset-0 opacity-0 cursor-pointer w-12 h-12 z-10"
                />
                <button
                  type="button"
                  className="w-12 h-12 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 rounded-2xl transition flex items-center justify-center shadow-xs text-xl"
                  title={t.upload}
                >
                  📎
                </button>
              </div>

              {/* Voice button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`w-12 h-12 border rounded-2xl transition flex items-center justify-center shadow-xs text-xl ${
                  isRecording 
                    ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200/90'
                }`}
                title={t.clickRecord}
              >
                🎤
              </button>

              {/* Input text field */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 bg-white border border-slate-200/90 rounded-2xl px-5 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 shadow-xs"
              />

              <button
                onClick={handleSend}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-2xl transition shadow-md flex items-center gap-2 shrink-0"
              >
                <span>{t.send}</span>
                <span className="text-lg">➔</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Prompts & Info */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 p-6 bg-slate-50/60 space-y-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>💡</span> Smart Templates
            </h3>
            <div className="space-y-2.5">
              {t.quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(p.text)}
                  className="w-full p-3.5 bg-white hover:bg-emerald-50 text-left border border-slate-200 hover:border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-900 transition flex items-start gap-3 shadow-xs"
                >
                  <span className="text-lg text-emerald-600 shrink-0">🌿</span>
                  <span className="leading-snug">{p.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200/70 rounded-2xl space-y-2 shadow-xs">
            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-900 flex items-center gap-2">
              <span>🌾</span> NARC & MoALD Aligned
            </h4>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Provides multimodal sustainability recommendations, crop disease diagnosis, organic fertilizer ratios, and carbon credit marketplace guidance in English and Nepali.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiAssistant;
