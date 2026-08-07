import re

file_path = '/Users/amritpaudel/Downloads/EcoTracer/ecotrace/client/src/pages/AiAssistant.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Update Voice Toggle
voice_toggle_old = """  // Actual Voice Input via Web Speech API
  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert(lang === 'en' ? "Your browser doesn't support speech recognition." : "तपाईंको ब्राउजरले आवाज पहिचान समर्थन गर्दैन।");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : 'ne-NP';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setInputText(prev => prev ? prev + ' ' + speechResult : speechResult);
      };
      recognition.onerror = (event) => {
        console.error("Speech error:", event.error);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);
      
      recognitionRef.current = recognition;
      recognition.start();
    }
  };"""

voice_toggle_new = """  // Actual Voice Input via Web Speech API with better error handling
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
  };"""

content = content.replace(voice_toggle_old, voice_toggle_new)

# 2. Update getAIResponse and remove isOffTopic
ai_response_regex = re.compile(r'  // Check off-topic queries\n  const isOffTopic =.*?return response;\n  };\n', re.DOTALL)

ai_response_new = """  // Process and generate simulated AI responses
  const getAIResponse = (userText, hasFile) => {
    let response = {
      text: '',
      confidence: 90,
      references: [],
      followups: []
    };

    const clean = userText.toLowerCase();

    // 1. File Analysis Response
    if (hasFile) {
      const fileName = attachedFile.name.toLowerCase();
      const fileExt = fileName.split('.').pop();

      if (['jpg', 'jpeg', 'png', 'mp4', 'mov'].includes(fileExt)) {
        response.text = lang === 'en'
          ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🔍 Visual Analysis Complete</h4>
             <p class="mb-2"><strong>Problem Analysis:</strong> Early stages of <em>Leaf Spot (Cercospora)</em> detected on the crop foliage. It thrives in high humidity and warm temperatures.</p>
             <p class="mb-2"><strong>Possible Causes:</strong> Poor field drainage, dense planting, and prolonged moisture on leaves.</p>
             <p class="mb-2"><strong>Recommended Solution:</strong> Apply organic copper oxychloride (2g/L of water) during early morning or late evening.</p>
             <p class="mb-2"><strong>Prevention Tips:</strong></p>
             <ul class="list-disc pl-5 space-y-1 mb-2">
               <li>Ensure proper spacing between plants to improve air circulation.</li>
               <li>Clear weeds and improve field drainage.</li>
             </ul>
             <p class="text-xs text-slate-500 italic">When to Seek Expert Help: If the spots spread to the stem within 48 hours, consult a local agronomist.</p>`
          : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🔍 तस्बिर विश्लेषण पूरा भयो</h4>
             <p class="mb-2"><strong>समस्या विश्लेषण:</strong> पातमा थोप्लो रोग (Cercospora) को प्रारम्भिक अवस्था देखिएको छ। यो उच्च आर्द्रतामा फैलिन्छ।</p>
             <p class="mb-2"><strong>सम्भावित कारणहरू:</strong> खेतमा पानी जम्नु, बाक्लो खेती, र पातमा लामो समयसम्म ओस रहनु।</p>
             <p class="mb-2"><strong>सुझाव गरिएको समाधान:</strong> बिहान वा बेलुकाको समयमा अर्गानिक कपर अक्सिक्लोराइड (२ ग्राम/लिटर पानीमा) छर्कनुहोस्।</p>
             <p class="mb-2"><strong>रोकथामका उपायहरू:</strong></p>
             <ul class="list-disc pl-5 space-y-1 mb-2">
               <li>हावा सञ्चार सुधार गर्न बिरुवाहरू बीच उचित दूरी कायम राख्नुहोस्।</li>
               <li>झारपात हटाउनुहोस् र पानी निकासको व्यवस्था मिलाउनुहोस्।</li>
             </ul>
             <p class="text-xs text-slate-500 italic">विज्ञको सल्लाह कहिले लिने: यदि थोप्लाहरू ४८ घण्टाभित्र डाँठमा फैलियो भने, स्थानीय कृषि प्राविधिकलाई सम्पर्क गर्नुहोस्।</p>`;
        response.confidence = 94;
        response.references = ['NARC Crop Pathology Handbook 2025', 'FAO Plant Protection Guidelines'];
        response.followups = lang === 'en' 
          ? ['What organic alternatives prevent leaf spot?', 'How long before harvesting can I apply it?']
          : ['पातको थोप्लो रोक्न अर्गानिक विकल्प के हुन्?', 'बाली काट्नु अघि कहिलेसम्म प्रयोग गर्न सकिन्छ?'];
      } else {
        response.text = lang === 'en'
          ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">📄 Document Summary: "${attachedFile.name}"</h4>
             <p class="mb-2"><strong>Problem Analysis:</strong> The soil lab report indicates a deficiency in Nitrogen (N), moderate Organic Matter (2.4%), and acidic pH (5.6).</p>
             <p class="mb-2"><strong>Possible Causes:</strong> Continuous farming without legume rotation and over-reliance on chemical fertilizers.</p>
             <p class="mb-2"><strong>Recommended Solution:</strong> Add agricultural lime (dolomite) at 400kg/ha to neutralize acidity. Follow up with vermicompost to boost nitrogen.</p>
             <p class="mb-2"><strong>Best Practices:</strong></p>
             <ul class="list-disc pl-5 space-y-1 mb-2">
               <li>Apply lime at least 3 weeks before planting.</li>
               <li>Rotate crops with legumes (like lentils or beans) next season.</li>
             </ul>`
          : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">📄 कागजात सारांश: "${attachedFile.name}"</h4>
             <p class="mb-2"><strong>समस्या विश्लेषण:</strong> माटो परीक्षण रिपोर्टले नाइट्रोजनको कमी, मध्यम प्राङ्गारिक पदार्थ (२.४%), र अम्लीय पीएच (५.६) देखाएको छ।</p>
             <p class="mb-2"><strong>सम्भावित कारणहरू:</strong> दलहन बाली चक्र बिना निरन्तर खेती गर्नु र रासायनिक मलमा अत्यधिक निर्भरता।</p>
             <p class="mb-2"><strong>सुझाव गरिएको समाधान:</strong> अम्लीयता सन्तुलन गर्न प्रति हेक्टर ४०० केजी कृषि चुन (डोलोमाइट) थप्नुहोस्। नाइट्रोजन बढाउन गड्यौला मल प्रयोग गर्नुहोस्।</p>
             <p class="mb-2"><strong>उत्तम अभ्यासहरू:</strong></p>
             <ul class="list-disc pl-5 space-y-1 mb-2">
               <li>बाली लगाउनुभन्दा कम्तिमा ३ हप्ता अघि चुन प्रयोग गर्नुहोस्।</li>
               <li>अर्को सिजनमा गेडागुडी (जस्तै दाल वा सिमी) सँग बाली चक्र अपनाउनुहोस्।</li>
             </ul>`;
        response.confidence = 92;
        response.references = ['Soil Science Department Nepal', 'Verra VCS Soil Methodology'];
        response.followups = lang === 'en'
          ? ['Where can I purchase agricultural lime?', 'Does high acidity impact yields?']
          : ['कृषि चुन कहाँ किन्न पाइन्छ?', 'के उच्च अम्लीयताले उत्पादनमा असर गर्छ?'];
      }
      return response;
    }

    // 3. Text queries (Expanded beyond just farming)
    if (clean.includes('weather') || clean.includes('alert') || clean.includes('मौसम') || clean.includes('चितवन')) {
      response.text = lang === 'en'
        ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">☁️ Regional Weather Update</h4>
           <p class="mb-2"><strong>Current Analysis:</strong> Heavy monsoonal showers expected on Tuesday (>12.4mm precipitation). Current soil moisture is healthy at 42%.</p>
           <p class="mb-2"><strong>Recommended Actions:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li><strong>Delay spraying:</strong> Halt pesticide or fertilizer application to prevent chemical runoff.</li>
             <li><strong>Livestock safety:</strong> Move poultry and cattle to elevated shelters.</li>
             <li><strong>Drainage:</strong> Clear field trenches today to prevent waterlogging.</li>
           </ul>
           <p class="text-xs text-slate-500 italic">Note: Real-time satellite alerts are active for your registered farm location.</p>`
        : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">☁️ क्षेत्रीय मौसम अद्यावधिक</h4>
           <p class="mb-2"><strong>वर्तमान अवस्था:</strong> मंगलबार भारी मनसुनी वर्षाको सम्भावना छ (>१२.४ मिमी वर्षा)। हाल माटोको आर्द्रता ४२% छ।</p>
           <p class="mb-2"><strong>सिफारिस गरिएका कार्यहरू:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li><strong>छर्किने काम रोक्नुहोस्:</strong> मल वा विषादी बगेर खेर नजाओस् भनेर प्रयोग नगर्नुहोस्।</li>
             <li><strong>पशु सुरक्षा:</strong> कुखुरा र गाईवस्तुलाई अग्लो र सुरक्षित आश्रयमा सार्नुहोस्।</li>
             <li><strong>पानी निकास:</strong> खेतमा पानी जम्न नदिन आजै कुलो सफा गर्नुहोस्।</li>
           </ul>
           <p class="text-xs text-slate-500 italic">नोट: तपाईंको दर्ता गरिएको फार्म स्थानको लागि वास्तविक-समय स्याटेलाइट अलर्ट सक्रिय छ।</p>`;
      response.confidence = 96;
      response.references = ['Nepal Meteorological Forecasting Division'];
      response.followups = lang === 'en' ? ['How to protect vegetables from flood?', 'Check 7-day forecast'] : ['बाढीबाट तरकारी कसरी जोगाउने?', '७ दिने मौसम पूर्वानुमान हेर्नुहोस्'];
      
    } else if (clean.includes('fertilizer') || clean.includes('rice') || clean.includes('मल') || clean.includes('धान')) {
      response.text = lang === 'en'
        ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🌱 Fertilizer Strategy for Rice</h4>
           <p class="mb-2"><strong>Problem Analysis:</strong> Farmers often face poor nitrogen retention in soil, leading to weak rice stalks and lower yields.</p>
           <p class="mb-2"><strong>Recommended Solution:</strong> Use a combination of vermicompost (6 tonnes/ha) and biochar (2 tonnes/ha). This mixture significantly increases moisture and nutrient retention.</p>
           <p class="mb-2"><strong>Best Practices:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>Apply base compost before final plowing.</li>
             <li>If using urea, apply it in 3 split doses (at planting, tillering, and panicle initiation) rather than all at once.</li>
           </ul>`
        : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🌱 धानको लागि मल व्यवस्थापन</h4>
           <p class="mb-2"><strong>समस्या विश्लेषण:</strong> माटोमा नाइट्रोजन टिक्न नसक्दा धानको बोट कमजोर हुने र उत्पादन घट्ने समस्या हुन्छ।</p>
           <p class="mb-2"><strong>सुझाव गरिएको समाधान:</strong> गड्यौला मल (६ टन/हेक्टर) र बायोचार (२ टन/हेक्टर) को मिश्रण प्रयोग गर्नुहोस्। यसले माटोमा चिस्यान र पोषक तत्व अड्याउन मद्दत गर्छ।</p>
           <p class="mb-2"><strong>उत्तम अभ्यासहरू:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>अन्तिम जोताइ अघि आधार मल हाल्नुहोस्।</li>
             <li>युरिया प्रयोग गर्दा एकै पटक नभई ३ पटक (रोप्दा, गाँज हाल्दा र बाला पसाउँदा) बाँडेर हाल्नुहोस्।</li>
           </ul>`;
      response.confidence = 91;
      response.references = ['NARC Cereal Crop Soil Management'];
      response.followups = lang === 'en' ? ['How do I prepare biochar?', 'Where is the nearest compost cooperative?'] : ['बायोचार कसरी तयार गर्ने?', 'नजिकैको कम्पोस्ट सहकारी कहाँ छ?'];
      
    } else if (clean.includes('carbon') || clean.includes('sustainability') || clean.includes('क्रेडिट')) {
      response.text = lang === 'en'
        ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🏅 Carbon Credits & Sustainability</h4>
           <p class="mb-2"><strong>Current Status:</strong> Your Krishi Saarathi Sustainability Score is 92. You are eligible to mint up to 48 Carbon Credits.</p>
           <p class="mb-2"><strong>Market Overview:</strong> The current global average is $24.50 per credit on verified platforms.</p>
           <p class="mb-2"><strong>How to Maximize Rewards:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>Implement zero-tillage farming to trap more CO2 in the soil.</li>
             <li>Transition diesel pumps to solar water pumps (reduces emissions footprint).</li>
             <li>Use cover crops like clover during off-seasons.</li>
           </ul>`
        : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🏅 कार्बन क्रेडिट र दिगोपन</h4>
           <p class="mb-2"><strong>वर्तमान अवस्था:</strong> तपाईंको कृषि सारथी दिगोपन स्कोर ९२ छ। तपाईं ४८ कार्बन क्रेडिटहरू सम्म दाबी गर्न योग्य हुनुहुन्छ।</p>
           <p class="mb-2"><strong>बजार अवलोकन:</strong> प्रमाणित प्लेटफर्महरूमा हाल प्रति क्रेडिट औसत $२४.५० छ।</p>
           <p class="mb-2"><strong>पुरस्कार कसरी अधिकतम गर्ने:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>माटोमा बढी कार्बन जम्मा गर्न शून्य-जोताइ (Zero-tillage) खेती लागू गर्नुहोस्।</li>
             <li>डिजेल पम्पको सट्टा सौर्य सिँचाइ पम्प प्रयोग गर्नुहोस्।</li>
             <li>अफ-सिजनमा माटो ढाक्ने बाली (Cover crops) लगाउनुहोस्।</li>
           </ul>`;
      response.confidence = 97;
      response.references = ['Gold Standard Soil Carbon', 'Verra VCS Methodology'];
      response.followups = lang === 'en' ? ['How do I list credits on the marketplace?', 'What is zero-tillage?'] : ['बजारमा क्रेडिट कसरी बेच्ने?', 'शून्य-जोताइ भनेको के हो?'];
      
    } else if (clean.includes('cow') || clean.includes('livestock') || clean.includes('goat') || clean.includes('गाई') || clean.includes('बाख्रा')) {
      response.text = lang === 'en'
        ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🐄 Livestock Health & Management</h4>
           <p class="mb-2"><strong>Problem Analysis:</strong> Common issues in livestock like cows, buffaloes, and goats include tick-borne diseases, mastitis, and poor milk yield due to dietary deficiencies.</p>
           <p class="mb-2"><strong>Recommended Solution:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>Ensure a balanced diet of green fodder (Napier/Berseem), dry roughage, and mineral mixture (50g/day for cows).</li>
             <li>Clean the udder with a mild potassium permanganate solution before and after milking to prevent mastitis.</li>
           </ul>
           <p class="text-xs text-slate-500 italic">When to Seek Expert Help: If body temperature exceeds 103°F or if milk shows blood/clots, contact a veterinary doctor immediately.</p>`
        : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">🐄 पशु स्वास्थ्य र व्यवस्थापन</h4>
           <p class="mb-2"><strong>समस्या विश्लेषण:</strong> गाई, भैंसी र बाख्राहरूमा प्रायः किर्नाबाट लाग्ने रोग, थुनेलो, र पौष्टिक आहारको कमीले दूध उत्पादन घट्ने समस्या हुन्छ।</p>
           <p class="mb-2"><strong>सुझाव गरिएको समाधान:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>हरियो घाँस (नेपियर/बर्सिम), सुख्खा पराल र खनिज मिश्रण (गाईको लागि ५० ग्राम/दिन) को सन्तुलित आहार सुनिश्चित गर्नुहोस्।</li>
             <li>थुनेलो रोक्न दूध दुहुनु अघि र पछि पोटासियम परमानेग्नेटको झोलले थुन सफा गर्नुहोस्।</li>
           </ul>
           <p class="text-xs text-slate-500 italic">विज्ञको सल्लाह कहिले लिने: यदि शरीरको तापक्रम १०३°F भन्दा बढी छ वा दूधमा रगत/ढिक्का देखियो भने तुरुन्तै पशु चिकित्सकलाई सम्पर्क गर्नुहोस्।</p>`;
      response.confidence = 92;
      response.references = ['Department of Livestock Services Nepal'];
      response.followups = lang === 'en' ? ['How to identify mastitis?', 'Best fodder grass for goats'] : ['थुनेलो रोग कसरी चिन्ने?', 'बाख्राको लागि राम्रो घाँस कुन हो?'];
      
    } else {
      // General informative fallback for any other question (expanded domain)
      response.text = lang === 'en'
        ? `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">💡 General Advisory Information</h4>
           <p class="mb-2"><strong>Information:</strong> You've asked a broad question. Krishi Saarathi is designed to assist with agriculture, livestock, rural logistics, supply chain, and sustainability.</p>
           <p class="mb-2"><strong>Best Practices for Good Queries:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>Specify the crop, animal, or specific issue you are facing.</li>
             <li>Upload a clear photo of the diseased leaf, pest, or soil report for AI visual analysis.</li>
             <li>Provide your location (e.g., Chitwan, Mustang) for accurate weather and market pricing.</li>
           </ul>
           <p class="mb-2">If your query is about government schemes, carbon credits, or how to use the marketplace, feel free to ask directly!</p>`
        : `<h4 class="font-bold text-emerald-700 flex items-center gap-2 mb-3">💡 सामान्य सल्लाह र जानकारी</h4>
           <p class="mb-2"><strong>जानकारी:</strong> तपाईंले सामान्य प्रश्न सोध्नुभएको छ। कृषि सारथी कृषि, पशुपालन, ग्रामीण रसद, आपूर्ति श्रृंखला, र दिगोपनमा मद्दत गर्न डिजाइन गरिएको हो।</p>
           <p class="mb-2"><strong>राम्रो प्रश्न सोध्ने तरिकाहरू:</strong></p>
           <ul class="list-disc pl-5 space-y-1 mb-2">
             <li>तपाईंले सामना गरिरहनुभएको बाली, जनावर, वा विशिष्ट समस्या खुलाउनुहोस्।</li>
             <li>AI मार्फत दृश्य विश्लेषणको लागि रोगी पात, कीरा, वा माटो रिपोर्टको स्पष्ट फोटो अपलोड गर्नुहोस्।</li>
             <li>सटीक मौसम र बजार मूल्यको लागि आफ्नो स्थान (जस्तै चितवन, मुस्ताङ) उल्लेख गर्नुहोस्।</li>
           </ul>
           <p class="mb-2">यदि तपाईंको प्रश्न सरकारी योजनाहरू, कार्बन क्रेडिटहरू, वा बजार कसरी प्रयोग गर्ने भन्ने बारे हो भने, सिधै सोध्न नहिचकिचाउनुहोस्!</p>`;
      response.confidence = 85;
      response.references = ['Krishi Saarathi General Knowledge Base'];
      response.followups = lang === 'en' ? ['Show me government subsidies', 'How do I upload an image?'] : ['सरकारी अनुदान बारे बताउनुहोस्', 'फोटो कसरी अपलोड गर्ने?'];
    }

    return response;
  };\n"""

content = re.sub(ai_response_regex, ai_response_new, content)

# 3. Update message rendering to use dangerouslySetInnerHTML for AI messages
render_old = """                  {msg.text}"""
render_new = """                  {msg.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} className="ai-formatted-content" />
                  ) : (
                    msg.text
                  )}"""

content = content.replace(render_old, render_new)

with open(file_path, 'w') as f:
    f.write(content)

print("Updated AiAssistant.jsx successfully.")
