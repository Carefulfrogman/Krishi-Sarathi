import React, { useState, useRef, useEffect } from 'react';
import { aiService, mockData } from '../services/api';
import Icon from '../components/Icons';

// Localized strings in English and Nepali
const localizations = {
  en: {
    title: 'AI Krishi Assistant',
    subtitle: 'Multilingual smart helper for crops, soil, pests, and government schemes.',
    placeholder: 'Ask about diseases, weather, soil reports, carbon credits...',
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
      { text: 'Identify Paddy Leaf Disease', icon: 'sprout' },
      { text: 'Best Fertilizer for Basmati Rice', icon: 'activity' },
      { text: 'Subsidies for Solar Irrigation in Nepal', icon: 'shield' },
      { text: 'Explain Carbon Credit trading steps', icon: 'award' }
    ]
  },
  ne: {
    title: 'एआई कृषि सहायक',
    subtitle: 'बाली, माटो, कीरा, र सरकारी योजनाहरूको लागि बहुभाषिक स्मार्ट सहायक।',
    placeholder: 'रोग, मौसम, माटो रिपोर्ट, कार्बन क्रेडिट बारे सोध्नुहोस्...',
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
      { text: 'धानको पातको रोग पहिचान गर्नुहोस्', icon: 'sprout' },
      { text: 'बासमती धानका लागि उत्तम मल', icon: 'activity' },
      { text: 'नेपालमा सौर्य सिँचाइ अनुदान', icon: 'shield' },
      { text: 'कार्बन क्रेडिट व्यापार कसरी गर्ने?', icon: 'award' }
    ]
  }
};

export const AiAssistant = () => {
  const [lang, setLang] = useState('en');
  const t = localizations[lang];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: lang === 'en' 
        ? 'Hello! I am your AI Krishi Assistant. You can upload images, videos, documents, or ask me questions about your fields.' 
        : 'नमस्ते! म तपाईंको एआई कृषि सहायक हुँ। तपाईं तस्बिर, भिडियो, कागजात अपलोड गर्न सक्नुहुन्छ वा मलाई खेती सम्बन्धी प्रश्नहरू सोध्न सक्नुहुन्छ।',
      confidence: 100,
      references: ['Krishi Saarathi Agriculture Core V2', 'NARC Research Guidelines'],
      followups: lang === 'en' 
        ? ['How do I improve my soil carbon score?', 'What are the current climate alerts in Chitwan?'] 
        : ['माटोको कार्बन कसरी बढाउने?', 'चितवनमा अहिलेको मौसम कस्तो छ?']
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Actual Voice Input via Web Speech API with better error handling
  const handleVoiceToggle = async () => {
    if (isRecording) {
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      try {
        // Request microphone permission explicitly first for reliability
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert(lang === 'en' ? "Your browser doesn't support speech recognition." : "तपाईंको ब्राउजरले आवाज पहिचान समर्थन गर्दैन।");
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'en' ? 'en-US' : 'ne-NP';
        recognition.interimResults = true; // Use interim results for smoother experience
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
          // Only update final text for stability, or append if previous text exists
          if (finalTranscript) {
             setInputText(prev => prev.trim() + ' ' + finalTranscript.trim());
             finalTranscript = ''; // reset after appending
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

  const handleSend = async () => {
    if (!inputText.trim() && !attachedFile) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : null
    };

    setMessages((prev) => [...prev, userMsg]);
    
    // Build query for Gemini
    let queryText = inputText;
    if (attachedFile) {
        queryText = `[User attached file: ${attachedFile.name}] ${queryText}`;
    }

    setInputText('');
    setAttachedFile(null);
    setIsTyping(true);

    try {
      // Gather context from mockData
      const context = {
        farm: mockData.farms[0],
        weather: mockData.weather,
        sustainability: mockData.sustainability,
        carbonCredits: {
            available: mockData.carbonCredits.credits_available,
            price: mockData.carbonCredits.price_per_credit
        }
      };

      const response = await aiService.askAiAssistant(queryText, lang === 'en' ? 'English' : 'Nepali', context);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.text,
          confidence: response.confidence || 98,
          references: response.references || ["Generated by Krishi Saarathi AI (Gemini 2.5 Flash)"],
          followups: response.followups || []
        }
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMsg = lang === 'en' 
        ? `<h4 class="font-bold text-red-700 flex items-center gap-2 mb-3">⚠️ Service Unavailable</h4>
           <p>I'm sorry, I am currently unable to connect to the AI server. Please check your internet connection or try again later.</p>`
        : `<h4 class="font-bold text-red-700 flex items-center gap-2 mb-3">⚠️ सेवा उपलब्ध छैन</h4>
           <p>माफ गर्नुहोस्, म अहिले एआई सर्भरमा जडान गर्न असमर्थ छु। कृपया आफ्नो इन्टरनेट जाँच गर्नुहोस् वा पछि प्रयास गर्नुहोस्।</p>`;
           
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
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
          ? 'Chat cleared. Ask me anything about farming!' 
          : 'च्याट खाली गरियो। खेती सम्बन्धी केही पनि सोध्नुहोस्!',
        confidence: 100,
        references: [],
        followups: []
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 flex flex-col h-[85vh]">
      {/* Header & Language Toggle */}
      <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-700 to-emerald-600"></div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🤖</span> {t.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Toggle buttons */}
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ne')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              lang === 'ne' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            नेपाली (Nepali)
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition ml-2"
            title={t.clearChat}
          >
            <Icon name="trash" size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Chat History Box */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* File preview inside message if user sent a file */}
                  {msg.file && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-slate-900/10 rounded-lg text-xs font-bold">
                      <span>📄</span> {msg.file.name}
                    </div>
                  )}
                  {msg.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} className="ai-formatted-content" />
                  ) : (
                    msg.text
                  )}

                  {/* Confidence rating for AI replies */}
                  {msg.sender === 'ai' && msg.confidence && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>{t.confidence}</span>
                      <span className="text-emerald-600 font-black">{msg.confidence}%</span>
                    </div>
                  )}
                </div>

                {/* References and Suggested Follow-ups for AI messages */}
                {msg.sender === 'ai' && (msg.references?.length > 0 || msg.followups?.length > 0) && (
                  <div className="mt-2 pl-3 border-l-2 border-slate-200 space-y-2 max-w-xl">
                    {msg.references?.length > 0 && (
                      <div className="text-[10px] text-slate-400 font-medium">
                        <span className="font-extrabold uppercase">{t.references}: </span>
                        {msg.references.join(', ')}
                      </div>
                    )}

                    {msg.followups?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.followups.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickPrompt(q)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 text-[10px] font-bold rounded-lg border border-slate-200 transition"
                          >
                            {q}
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
              <div className="flex items-center gap-1.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none w-20">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Interactive controls */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
            
            {/* File attachment preview */}
            {attachedFile && (
              <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span>📄</span> {attachedFile.name}
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="text-emerald-700 hover:text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Waveform Recording Animation */}
            {isRecording && (
              <div className="flex items-center justify-between p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  {t.recording}
                </span>
                {/* Waveform graphic */}
                <div className="flex items-center gap-0.5 h-6">
                  <span className="w-0.5 bg-red-500 rounded-full animate-pulse h-3"></span>
                  <span className="w-0.5 bg-red-500 rounded-full animate-pulse h-5 [animation-delay:0.1s]"></span>
                  <span className="w-0.5 bg-red-500 rounded-full animate-pulse h-2 [animation-delay:0.2s]"></span>
                  <span className="w-0.5 bg-red-500 rounded-full animate-pulse h-6 [animation-delay:0.3s]"></span>
                  <span className="w-0.5 bg-red-500 rounded-full animate-pulse h-4 [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* File Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
                />
                <button
                  type="button"
                  className="w-10 h-10 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-xl transition flex items-center justify-center shadow-xs"
                  title={t.upload}
                >
                  📎
                </button>
              </div>

              {/* Voice button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`w-10 h-10 border rounded-xl transition flex items-center justify-center shadow-xs ${
                  isRecording 
                    ? 'bg-red-500 border-red-500 text-white' 
                    : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                }`}
                title={t.clickRecord}
              >
                🎤
              </button>

              {/* Input text */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />

              <button
                onClick={handleSend}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition shadow-md"
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Prompts & Info */}
        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-100 p-6 bg-slate-50/50 space-y-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Quick Templates</h3>
            <div className="space-y-2">
              {t.quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(p.text)}
                  className="w-full p-3 bg-white hover:bg-emerald-50 text-left border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 transition flex items-start gap-2.5"
                >
                  <span className="text-base text-emerald-600">💡</span>
                  <span>{p.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-100/50 rounded-2xl">
            <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
              <span>🌾</span> MOALD & NARC Guidelines
            </h4>
            <p className="text-[10px] text-emerald-700 font-medium leading-relaxed mt-1">
              Suggestions align with Agricultural Research Council (NARC) and Government subsidy guidelines. Use GPS metadata uploads for automated credit scores.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiAssistant;
