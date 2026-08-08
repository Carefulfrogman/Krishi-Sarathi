import React, { useState } from 'react';
import Icon from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const SustainabilityRewards = ({ farms = [], selectedFarmId, onSelectFarm }) => {
  const { language } = useLanguage();
  const isNe = language === 'ne';

  // Helper to convert numbers to Devanagari numerals when in Nepali mode
  const fmtNum = (numStr) => {
    if (!isNe) return String(numStr);
    const map = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };
    return String(numStr).replace(/[0-9]/g, (w) => map[w] || w);
  };

  const textDict = {
    en: {
      badge: '🏅 Krishi Saarathi Sustainability Rewards',
      title: 'Sustainability Rewards',
      subtitle: 'Verified eco-scores, agricultural level progression, government benefits, and redeemable points.',
      selectFarm: 'Selected Farm',
      
      // Top Metrics
      levelLabel: 'Current Sustainability Level',
      scoreLabel: 'Sustainability Score',
      scoreSubtext: 'Grade A+ Verified (Climate-Smart)',
      tasksLabel: 'Tasks Completed',
      tasksSubtext: '80% Implementation Rate',
      pointsLabel: 'Eco-Rewards & Points',
      pointsSubtext: '+25% Price Premium Active',
      
      // Government Benefits & Eligibility Summary
      govHeader: 'Government & NGO Incentive Benefits',
      eligibleTag: 'Eligible for Government Incentive Recommendation',
      inProgressTag: 'Incentive Pathway in Progress',
      govDescriptionEligible: 'Your farm has maintained an 85+ sustainability score for 3 consecutive years. You qualify for concessional low-interest loans, official fertilizer subsidies, and tax rebates.',
      govDescriptionInProgress: 'Farms maintaining an 85+ score for 3 consecutive years unlock official eligibility for Krishi Saarathi government/NGO incentive review (subsidies, concessional loans, and bonuses).',
      govNotice: 'Krishi Saarathi recommends qualifying farms for official government and NGO incentive review. Final benefits are subject to agency approval.',
      eligibilitySummary: 'Eligibility Summary',
      streakStatus: '3-Year Score Streak',
      satisfied: 'Satisfied (3/3 Years)',
      remainingYears: 'Year(s) Remaining',
      
      // Benefits Chips
      b1: '💰 Concessional Low-Interest Loans',
      b2: '🌿 Official Fertilizer Subsidies',
      b3: '📋 Tax Rebates',

      // Yearly Progress
      yearlyHeader: 'Yearly Sustainability Progress',
      yearlySubtext: '3-Year Consecutive Performance Record',
      maintained85: '85+ Maintained',
      below85: 'Below 85',
      passed: 'Qualified',
      improvementNeeded: 'Improvement Needed',
      
      // Tasks Completed
      tasksHeader: 'Tasks Completed & Action Log',
      tasksSubtext: 'Climate-smart practices verified on your active fields',
      task1Title: 'Solar Drip Micro-Irrigation Installed',
      task1Desc: 'Reduced water consumption by 40% on main Basmati plot.',
      task1Pts: '+20 PTS',
      task2Title: 'Vermicompost & Biochar Application',
      task2Desc: 'Soil organic carbon increased to 2.4%. Zero chemical residue.',
      task2Pts: '+15 PTS',
      task3Title: 'Zero-Tillage Seeding Implemented',
      task3Desc: 'Avoided topsoil erosion and preserved soil moisture.',
      task3Pts: '+15 PTS',
      task4Title: 'Cover Crop Diversity & Bio-Pesticides',
      task4Desc: 'Intercropping with legumes for natural nitrogen fixation.',
      task4Pts: 'In Progress',
      completedTag: 'Completed',
      inProgressTag: 'In Progress',

      // Level Progression
      progressionHeader: 'Level Progression Track',
      progressionSubtext: 'Agricultural accreditation levels based on verified environmental performance',
      activeLevel: 'Active Level',
      
      // Level Names & Perks
      l1Name: 'Green Starter',
      l1Eco: '+5% Price Boost',
      l1Desc: 'Basic Eco Bonus + sustainability tips & soil guidance',
      
      l2Name: 'Eco Farmer',
      l2Eco: '+10% Price Boost',
      l2Desc: 'Higher Eco Bonus + Eco Farmer verified badge',
      
      l3Name: 'Green Champion',
      l3Eco: '+15% Price Boost',
      l3Desc: 'Increased Eco Bonus + priority marketplace visibility',
      
      l4Name: 'Sustainability Leader',
      l4Eco: '+20% Price Premium',
      l4Desc: 'Premium Eco Bonus + Sustainability Champion certification',
      
      l5Name: 'Climate Steward',
      l5Eco: '+25% Price Premium',
      l5Desc: 'Highest Eco Bonus + government incentive recommendation',

      locked: 'Locked',
      unlocked: 'Unlocked',
      current: 'Current',
      nextReward: 'Next Reward',

      // Points & Redeem Vouchers
      vouchersHeader: 'Eco-Rewards & Redeemable Vouchers',
      vouchersSubtext: 'Redeem accumulated eco-points for organic inputs and equipment subsidies',
      ptsBalance: 'PTS Balance',
      redeemBtn: 'Redeem Voucher',
      redeemedAlert: 'Successfully redeemed voucher!',
      insufficientPts: 'Insufficient Eco-Points available.',
      v1Title: 'Bio-Fertilizer Voucher',
      v1Desc: '$50 Voucher for organic vermicompost and solar biochar input.',
      v1Cost: '400 PTS',
      v2Title: 'Solar Drip Irrigation Subsidy',
      v2Desc: '20% discount kit for solar micro-irrigation pump installations.',
      v2Cost: '800 PTS',
      v3Title: 'Zero-Carbon Pioneer Badge',
      v3Desc: 'Gold Verified Badge displayed on all marketplace product listings.',
      v3Cost: '1,000 PTS'
    },
    ne: {
      badge: '🏅 दिगोपन पुरस्कार प्रणाली',
      title: 'दिगोपन पुरस्कार प्रणाली',
      subtitle: 'प्रमाणित इको-स्कोर, कृषि स्तर वृद्धि, सरकारी अनुदान लाभहरू र पुरस्कार अंकहरू।',
      selectFarm: 'चयन गरिएको फार्म',
      
      // Top Metrics
      levelLabel: 'वर्तमान दिगोपन स्तर',
      scoreLabel: 'दिगोपन प्राप्ताङ्क',
      scoreSubtext: 'ग्रेड A+ प्रमाणित (जलवायु-अनुकूल)',
      tasksLabel: 'सम्पन्न कार्यहरू',
      tasksSubtext: '८०% कार्यान्वयन दर',
      pointsLabel: 'इको-पुरस्कार र अंकहरू',
      pointsSubtext: '+२५% मूल्य बोनस सक्रिय',
      
      // Government Benefits & Eligibility Summary
      govHeader: 'सरकारी तथा गैर-सरकारी अनुदान लाभहरू',
      eligibleTag: 'सरकारी अनुदान सिफारिसको लागि योग्य',
      inProgressTag: 'अनुदान प्रक्रिया प्रगतिमा',
      govDescriptionEligible: 'तपाईंको फार्मले लगातार ३ वर्षसम्म ८५+ दिगोपन स्कोर कायम राखेको छ। तपाईं सहुलियतपूर्ण कृषि कर्जा, मल अनुदान र कर छुटको लागि योग्य हुनुहुन्छ।',
      govDescriptionInProgress: 'लगातार ३ वर्षसम्म ८५+ स्कोर कायम राख्ने फार्महरूले कृषि सारथी सरकारी/गैर-सरकारी अनुदान समीक्षाको लागि आधिकारिक योग्यता प्राप्त गर्दछन्।',
      govNotice: 'कृषि सारथीले योग्य फार्महरूलाई आधिकारिक सरकारी र गैर-सरकारी समीक्षाको लागि सिफारिस गर्दछ। लाभहरू अन्तिम स्वीकृतिमा निर्भर हुन्छन्।',
      eligibilitySummary: 'योग्यता सारांश',
      streakStatus: '३-वर्षे स्कोर निरन्तरता',
      satisfied: 'सफल (३/३ वर्ष)',
      remainingYears: 'वर्ष बाँकी',

      // Benefits Chips
      b1: '💰 सहुलियत कृषि कर्जा',
      b2: '🌿 आधिकारिक मल अनुदान',
      b3: '📋 कर छुट लाभ',
      
      // Yearly Progress
      yearlyHeader: 'वार्षिक दिगोपन प्रगति',
      yearlySubtext: '३-वर्षे लगातार कार्यसम्पादन विवरण',
      maintained85: '८५+ कायम',
      below85: '८५ भन्दा कम',
      passed: 'योग्य',
      improvementNeeded: 'सुधार आवश्यक',
      
      // Tasks Completed
      tasksHeader: 'सम्पन्न कार्यहरू र कार्य विवरण',
      tasksSubtext: 'तपाईंको क्षेत्रमा प्रमाणित जलवायु-अनुकूल अभ्यासहरू',
      task1Title: 'सौर्य थोपा सिँचाइ जडान गरियो',
      task1Desc: 'मुख्य धान खेतमा ४०% जल खपत घटाइयो।',
      task1Pts: '+२० अंक',
      task2Title: 'जैविक मल र बायोचार प्रयोग',
      task2Desc: 'माटोको जैविक कार्बन २.४% पुग्यो। शून्य रासायनिक अवशेष।',
      task2Pts: '+१५ अंक',
      task3Title: 'शून्य-जोताई बीउ रोपण',
      task3Desc: 'माटोको माथिल्लो तहको भूक्षय रोकियो र आर्द्रता सुरक्षित गरियो।',
      task3Pts: '+१५ अंक',
      task4Title: 'छापो बाली र जैविक कीटनाशक',
      task4Desc: 'प्राकृतिक नाइट्रोजन स्थिरीकरणको लागि दालबालीसँग अन्तरबाली।',
      task4Pts: 'प्रगतिमा',
      completedTag: 'सम्पन्न',
      inProgressTag: 'प्रगतिमा',

      // Level Progression
      progressionHeader: 'स्तर वृद्धि मार्गचित्र',
      progressionSubtext: 'प्रमाणित वातावरणीय कार्यसम्पादनमा आधारित कृषि मान्यता स्तरहरू',
      activeLevel: 'सक्रिय स्तर',
      
      // Level Names & Perks
      l1Name: 'ग्रीन स्टार्टर',
      l1Eco: '+५% मूल्य बोनस',
      l1Desc: 'आधारभूत इको बोनस + दिगोपन सुझाव र माटो सल्लाह',
      
      l2Name: 'इको कृषक',
      l2Eco: '+१०% मूल्य बोनस',
      l2Desc: 'उच्च इको बोनस + इको कृषक प्रमाणित ब्याज',
      
      l3Name: 'ग्रीन च्याम्पियन',
      l3Eco: '+१५% मूल्य बोनस',
      l3Desc: 'थप इको बोनस + बजारमा पहिलो प्राथमिकता',
      
      l4Name: 'दिगोपन नेता',
      l4Eco: '+२०% प्रिमियम बोनस',
      l4Desc: 'प्रिमियम इको बोनस + दिगोपन च्याम्पियन प्रमाणीकरण',
      
      l5Name: 'क्लाइमेट स्टेवार्ड',
      l5Eco: '+२५% प्रिमियम बोनस',
      l5Desc: 'सर्वोच्च इको बोनस + सरकारी अनुदान सिफारिस',

      locked: 'बाँकी',
      unlocked: 'खुलेको',
      current: 'वर्तमान',
      nextReward: 'अघिल्लो पुरस्कार',

      // Points & Redeem Vouchers
      vouchersHeader: 'इको-पुरस्कार र कुपनहरू',
      vouchersSubtext: 'जैविक सामग्री र उपकरण अनुदानका लागि आफ्ना इको-अंकहरू साट्नुहोस्',
      ptsBalance: 'कुल अंक मौज्दात',
      redeemBtn: 'कुपन साट्नुहोस्',
      redeemedAlert: 'सफलतापूर्वक कुपन साटियो!',
      insufficientPts: 'पर्याप्त इको-अंकहरू छैनन्।',
      v1Title: 'जैविक मल कुपन',
      v1Desc: 'जैविक मल र सौर्य बायोचारका लागि $५० को कुपन।',
      v1Cost: '४०० अंक',
      v2Title: 'सौर्य थोपा सिँचाइ अनुदान',
      v2Desc: 'सौर्य पम्प जडानका लागि २०% छुट कुपन।',
      v2Cost: '८०० अंक',
      v3Title: 'शून्य-कार्बन अग्रणी ब्याज',
      v3Desc: 'सबै बजार उत्पादन सूचीमा देखाइने गोल्ड प्रमाणित ब्याज।',
      v3Cost: '१,००० अंक'
    }
  };

  const t = textDict[language] || textDict.en;

  const defaultFarms = [
    {
      id: 'f-101',
      name: isNe ? 'कोशी कृषि फार्म' : 'Koshi Krishi Farm',
      location: isNe ? 'सुनसरी, नेपाल' : 'Sunsari, Nepal',
      sustainability_score: 92,
      history_3year: [
        { year: isNe ? 'वर्ष १ (२०२४)' : 'Year 1 (2024)', score: 87 },
        { year: isNe ? 'वर्ष २ (२०२५)' : 'Year 2 (2025)', score: 90 },
        { year: isNe ? 'वर्ष ३ (२०२६)' : 'Year 3 (2026)', score: 92 }
      ]
    },
    {
      id: 'f-102',
      name: isNe ? 'मार्फा फलफूल फार्म' : 'Mustang Marpha Orchards',
      location: isNe ? 'मुस्ताङ, नेपाल' : 'Mustang, Nepal',
      sustainability_score: 88,
      history_3year: [
        { year: isNe ? 'वर्ष १ (२०२४)' : 'Year 1 (2024)', score: 81 },
        { year: isNe ? 'वर्ष २ (२०२५)' : 'Year 2 (2025)', score: 86 },
        { year: isNe ? 'वर्ष ३ (२०२६)' : 'Year 3 (2026)', score: 88 }
      ]
    },
    {
      id: 'f-103',
      name: isNe ? 'चितवन गाई तथा कुखुरा फार्म' : 'Chitwan Dairy & Poultry',
      location: isNe ? 'चितवन, नेपाल' : 'Chitwan, Nepal',
      sustainability_score: 85,
      history_3year: [
        { year: isNe ? 'वर्ष १ (२०२४)' : 'Year 1 (2024)', score: 76 },
        { year: isNe ? 'वर्ष २ (२०२५)' : 'Year 2 (2025)', score: 80 },
        { year: isNe ? 'वर्ष ३ (२०२६)' : 'Year 3 (2026)', score: 85 }
      ]
    },
    {
      id: 'f-104',
      name: isNe ? 'काभ्रे एकीकृत फार्म' : 'Kavre Integrated Farm',
      location: isNe ? 'काभ्रे, नेपाल' : 'Kavre, Nepal',
      sustainability_score: 72,
      history_3year: [
        { year: isNe ? 'वर्ष १ (२०२४)' : 'Year 1 (2024)', score: 65 },
        { year: isNe ? 'वर्ष २ (२०२५)' : 'Year 2 (2025)', score: 68 },
        { year: isNe ? 'वर्ष ३ (२०२६)' : 'Year 3 (2026)', score: 72 }
      ]
    }
  ];

  const activeFarmsList = farms && farms.length > 0 ? farms : defaultFarms;
  const [activeFarmId, setActiveFarmId] = useState(selectedFarmId || activeFarmsList[0].id);
  const [userPoints, setUserPoints] = useState(1250);

  const currentFarm = activeFarmsList.find((f) => f.id === activeFarmId) || activeFarmsList[0];
  const score = currentFarm.sustainability_score || 85;

  const history = currentFarm.history_3year || [
    { year: isNe ? 'वर्ष १ (२०२४)' : 'Year 1 (2024)', score: Math.max(60, score - 5) },
    { year: isNe ? 'वर्ष २ (२०२५)' : 'Year 2 (2025)', score: Math.max(60, score - 2) },
    { year: isNe ? 'वर्ष ३ (२०२६)' : 'Year 3 (2026)', score: score }
  ];

  let consecutive85Plus = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].score >= 85) {
      consecutive85Plus++;
    } else {
      break;
    }
  }

  const isEligibleForGovIncentive = consecutive85Plus >= 3;

  const levelsConfig = [
    { level: 1, name: t.l1Name, badge: '🌱 Level 1', minScore: 60, requires3Years: false, ecoBonus: t.l1Eco, rewardSummary: t.l1Desc },
    { level: 2, name: t.l2Name, badge: '🌿 Level 2', minScore: 70, requires3Years: false, ecoBonus: t.l2Eco, rewardSummary: t.l2Desc },
    { level: 3, name: t.l3Name, badge: '⭐ Level 3', minScore: 80, requires3Years: false, ecoBonus: t.l3Eco, rewardSummary: t.l3Desc },
    { level: 4, name: t.l4Name, badge: '🎖️ Level 4', minScore: 85, requires3Years: true, ecoBonus: t.l4Eco, rewardSummary: t.l4Desc },
    { level: 5, name: t.l5Name, badge: '👑 Level 5', minScore: 90, requires3Years: true, ecoBonus: t.l5Eco, rewardSummary: t.l5Desc }
  ];

  let currentLevelObj = levelsConfig[0];
  if (score >= 90 && consecutive85Plus >= 3) {
    currentLevelObj = levelsConfig[4];
  } else if (score >= 85 && consecutive85Plus >= 3) {
    currentLevelObj = levelsConfig[3];
  } else if (score >= 80) {
    currentLevelObj = levelsConfig[2];
  } else if (score >= 70) {
    currentLevelObj = levelsConfig[1];
  } else if (score >= 60) {
    currentLevelObj = levelsConfig[0];
  } else {
    currentLevelObj = { level: 0, name: 'Level 0', badge: '🌱 Level 0', ecoBonus: '0%', minScore: 0 };
  }

  const handleFarmChange = (id) => {
    setActiveFarmId(id);
    if (onSelectFarm) onSelectFarm(id);
  };

  const handleRedeem = (cost, voucherTitle) => {
    if (userPoints >= cost) {
      setUserPoints(userPoints - cost);
      alert(`${t.redeemedAlert} (${voucherTitle})`);
    } else {
      alert(t.insufficientPts);
    }
  };

  return (
    <div id="sustainability-rewards" className="bg-white rounded-3xl border border-[#E5E8E3] shadow-md p-6 sm:p-10 space-y-10 text-[#17251D]">
      
      {/* ── 1. Page Header & Dynamic Farm Selector ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E8E3] pb-6">
        <div>
          <span className="px-3.5 py-1 bg-[#174F32]/10 text-[#063822] border border-[#174F32]/20 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#063822] tracking-tight mt-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#7B8428] font-medium mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* Farm Switcher */}
        <div className="bg-[#F8F7F1] p-3 rounded-2xl border border-[#B4B394]/40 flex items-center gap-3 shrink-0">
          <div className="text-left pl-1">
            <span className="text-[10px] text-[#7B8428] uppercase font-bold block">{t.selectFarm}</span>
            <span className="text-xs font-black text-[#063822]">{currentFarm.name}</span>
          </div>
          {activeFarmsList.length > 1 && (
            <select
              value={activeFarmId}
              onChange={(e) => handleFarmChange(e.target.value)}
              className="bg-white text-xs font-bold text-[#17251D] border border-[#B4B394] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#174F32] cursor-pointer shadow-xs"
            >
              {activeFarmsList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({fmtNum(f.sustainability_score)} pts)
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── 2. Top Key Metrics Cards (Clear Hierarchy & Prominent Numbers) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Current Level */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#063822] to-[#174F32] text-white shadow-sm flex flex-col justify-between border border-[#7B8428]/30 relative overflow-hidden">
          <div className="text-[10px] text-[#B4B394] font-bold uppercase tracking-wider">{t.levelLabel}</div>
          <div className="my-3">
            <div className="text-2xl font-black text-[#D99A17]">{currentLevelObj.name}</div>
            <div className="text-xs text-white/80 font-semibold mt-1">
              Level {fmtNum(currentLevelObj.level)} / {fmtNum(5)}
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-[#B4B394] font-bold">
            {currentLevelObj.ecoBonus}
          </div>
        </div>

        {/* Card 2: Sustainability Score */}
        <div className="p-6 rounded-2xl bg-[#F8F7F1] border border-[#B4B394]/30 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] text-[#7B8428] font-bold uppercase tracking-wider">{t.scoreLabel}</div>
          <div className="my-3 flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-[#063822]">{fmtNum(score)}</span>
            <span className="text-xs font-bold text-[#7B8428]">/ {fmtNum(100)}</span>
          </div>
          <div className="pt-2 border-t border-[#E5E8E3] text-[10px] text-[#174F32] font-extrabold">
            {t.scoreSubtext}
          </div>
        </div>

        {/* Card 3: Tasks Completed */}
        <div className="p-6 rounded-2xl bg-[#F8F7F1] border border-[#B4B394]/30 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] text-[#7B8428] font-bold uppercase tracking-wider">{t.tasksLabel}</div>
          <div className="my-3 flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-[#063822]">{fmtNum(8)}</span>
            <span className="text-xs font-bold text-[#7B8428]">/ {fmtNum(10)}</span>
          </div>
          <div className="pt-2 border-t border-[#E5E8E3] text-[10px] text-[#7B8428] font-extrabold">
            {t.tasksSubtext}
          </div>
        </div>

        {/* Card 4: Eco-Rewards & Points */}
        <div className="p-6 rounded-2xl bg-[#F8F7F1] border border-[#B4B394]/30 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] text-[#7B8428] font-bold uppercase tracking-wider">{t.pointsLabel}</div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#D99A17]">{fmtNum(userPoints.toLocaleString())} PTS</div>
          </div>
          <div className="pt-2 border-t border-[#E5E8E3] text-[10px] text-[#174F32] font-extrabold">
            {t.pointsSubtext}
          </div>
        </div>
      </div>

      {/* ── 3. Government Benefits & Eligibility Summary Box ── */}
      <div className="rounded-3xl border-2 border-[#D99A17] shadow-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#D99A17] via-[#063822] to-[#D99A17]" />

        <div className="p-6 sm:p-8 bg-[#F8F7F1] space-y-5">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Official Nepal Government Emblem */}
              <div className="shrink-0 w-20 h-20 rounded-2xl bg-white border border-[#E5E8E3] shadow-sm flex items-center justify-center p-1">
                <img
                  src="/nepal-gov-emblem.png"
                  alt="Government of Nepal Emblem"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display='none'; }}
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#063822] text-[#F8F7F1] text-[10px] font-black uppercase tracking-wider rounded-full">
                  🏛️ {t.govHeader}
                </span>
                <h3 className={`text-xl sm:text-2xl font-black mt-2 ${
                  isEligibleForGovIncentive ? 'text-[#063822]' : 'text-[#174F32]'
                }`}>
                  {isEligibleForGovIncentive ? t.eligibleTag : t.inProgressTag}
                </h3>
              </div>
            </div>

            {/* Streak Badge */}
            <div className={`px-5 py-3 rounded-2xl border-2 text-center shrink-0 ${
              isEligibleForGovIncentive
                ? 'bg-[#063822] border-[#D99A17]'
                : 'bg-white border-[#B4B394]/60'
            }`}>
              <div className={`text-[10px] font-black uppercase tracking-wider ${
                isEligibleForGovIncentive ? 'text-[#D99A17]' : 'text-[#7B8428]'
              }`}>
                {t.streakStatus}
              </div>
              <div className={`text-sm font-black mt-1 ${
                isEligibleForGovIncentive ? 'text-white' : 'text-[#063822]'
              }`}>
                {isEligibleForGovIncentive
                  ? `✅ ${t.satisfied}`
                  : `${fmtNum(consecutive85Plus)} / ${fmtNum(3)} ${t.remainingYears}`}
              </div>
            </div>
          </div>

          <div className="border-t border-[#B4B394]/30" />

          {/* Main description */}
          <p className="text-sm text-[#17251D] leading-relaxed font-medium">
            {isEligibleForGovIncentive ? t.govDescriptionEligible : t.govDescriptionInProgress}
          </p>

          {/* Benefits chips (when eligible) */}
          {isEligibleForGovIncentive && (
            <div className="flex flex-wrap gap-2">
              {[t.b1, t.b2, t.b3].map((benefit, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#174F32]/30 text-[#063822] text-xs font-bold rounded-xl shadow-xs">
                  {benefit}
                </span>
              ))}
            </div>
          )}

          {/* Notice footer */}
          <div className="flex items-start gap-2 p-3 bg-white rounded-xl border border-[#B4B394]/40">
            <span className="text-base shrink-0">ℹ️</span>
            <p className="text-[11px] text-[#17251D]/70 italic font-normal leading-relaxed">
              {t.govNotice}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Yearly Sustainability Progress (Compact 3-Year Timeline) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#063822] tracking-tight flex items-center gap-2">
            <span>📅</span> {t.yearlyHeader}
          </h2>
          <span className="text-xs text-[#7B8428] font-extrabold">{t.yearlySubtext}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {history.map((h, idx) => {
            const passed = h.score >= 85;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  passed
                    ? 'bg-[#F8F7F1] border-[#174F32]/40 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#063822]">{h.year}</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      passed
                        ? 'bg-[#174F32]/10 text-[#174F32] border border-[#174F32]/20'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {passed ? `✓ ${t.maintained85}` : t.below85}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-3xl font-black text-[#17251D]">{fmtNum(h.score)}</span>
                  <span className="text-xs font-extrabold text-[#7B8428]">
                    {passed ? t.passed : t.improvementNeeded}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${passed ? 'bg-[#174F32]' : 'bg-[#D99A17]'}`}
                    style={{ width: `${Math.min(100, h.score)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Tasks Completed & Action Log ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#063822] tracking-tight flex items-center gap-2">
            <span>✅</span> {t.tasksHeader}
          </h2>
          <span className="text-xs text-[#7B8428] font-medium">{t.tasksSubtext}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#B4B394]/30 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#174F32] text-white flex items-center justify-center text-xs font-black">✓</span>
                <h4 className="text-xs font-black text-[#063822]">{t.task1Title}</h4>
              </div>
              <p className="text-[11px] text-[#17251D]/80 font-medium pl-7">{t.task1Desc}</p>
            </div>
            <span className="text-xs font-black text-[#174F32] bg-white px-2.5 py-1 rounded-lg border border-[#174F32]/20 shrink-0">
              {t.task1Pts}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#B4B394]/30 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#174F32] text-white flex items-center justify-center text-xs font-black">✓</span>
                <h4 className="text-xs font-black text-[#063822]">{t.task2Title}</h4>
              </div>
              <p className="text-[11px] text-[#17251D]/80 font-medium pl-7">{t.task2Desc}</p>
            </div>
            <span className="text-xs font-black text-[#174F32] bg-white px-2.5 py-1 rounded-lg border border-[#174F32]/20 shrink-0">
              {t.task2Pts}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#B4B394]/30 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#174F32] text-white flex items-center justify-center text-xs font-black">✓</span>
                <h4 className="text-xs font-black text-[#063822]">{t.task3Title}</h4>
              </div>
              <p className="text-[11px] text-[#17251D]/80 font-medium pl-7">{t.task3Desc}</p>
            </div>
            <span className="text-xs font-black text-[#174F32] bg-white px-2.5 py-1 rounded-lg border border-[#174F32]/20 shrink-0">
              {t.task3Pts}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-dashed border-[#D99A17] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D99A17] text-white flex items-center justify-center text-xs font-black">⏳</span>
                <h4 className="text-xs font-black text-[#063822]">{t.task4Title}</h4>
              </div>
              <p className="text-[11px] text-[#17251D]/80 font-medium pl-7">{t.task4Desc}</p>
            </div>
            <span className="text-xs font-black text-[#D99A17] bg-[#F8F7F1] px-2.5 py-1 rounded-lg border border-[#D99A17]/30 shrink-0">
              {t.task4Pts}
            </span>
          </div>
        </div>
      </div>

      {/* ── 6. Level Progression Track (Visual Tiers) ── */}
      <div className="space-y-4 pt-4 border-t border-[#E5E8E3]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#063822] tracking-tight">
              {t.progressionHeader}
            </h2>
            <p className="text-xs text-[#7B8428] font-medium">{t.progressionSubtext}</p>
          </div>
          <span className="text-xs font-black text-[#063822] bg-[#F8F7F1] px-3.5 py-1.5 rounded-xl border border-[#B4B394]/40">
            {t.activeLevel}: {currentLevelObj.name}
          </span>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {levelsConfig.map((lvl) => {
            const isCurrent = currentLevelObj.level === lvl.level;
            const isUnlocked =
              lvl.level < currentLevelObj.level ||
              (isCurrent && (lvl.level < 4 || isEligibleForGovIncentive));

            return (
              <div
                key={lvl.level}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-white border-2 border-[#174F32] shadow-md ring-2 ring-[#174F32]/10'
                    : isUnlocked
                    ? 'bg-[#F8F7F1] border-[#174F32]/30 opacity-90'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#7B8428]">
                      Level {fmtNum(lvl.level)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        isCurrent
                          ? 'bg-[#174F32] text-white'
                          : isUnlocked
                          ? 'bg-[#174F32]/15 text-[#174F32]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCurrent ? t.current : isUnlocked ? t.unlocked : t.locked}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#063822]">{lvl.name}</h4>
                  <div className="text-[11px] font-extrabold text-[#D99A17]">{lvl.ecoBonus}</div>
                  <p className="text-[11px] text-[#17251D]/80 leading-relaxed font-medium">
                    {lvl.rewardSummary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E5E8E3] text-[9px] text-[#7B8428] font-bold">
                  Req: {fmtNum(lvl.minScore)}+ {lvl.requires3Years ? '(3 Yrs)' : 'Score'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 7. Eco-Rewards & Points Ledger (Redeem Vouchers) ── */}
      <div className="space-y-4 pt-4 border-t border-[#E5E8E3]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#063822] tracking-tight flex items-center gap-2">
              <span>🎁</span> {t.vouchersHeader}
            </h2>
            <p className="text-xs text-[#7B8428] font-medium">{t.vouchersSubtext}</p>
          </div>
          <div className="px-3.5 py-1.5 bg-[#174F32] text-white rounded-xl font-black text-xs">
            {t.ptsBalance}: {fmtNum(userPoints.toLocaleString())} PTS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Voucher 1 */}
          <div className="p-5 bg-[#F8F7F1] rounded-2xl border border-[#B4B394]/30 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#174F32]/15 text-[#174F32] flex items-center justify-center font-black">
                <Icon name="sprout" size={20} />
              </div>
              <h3 className="text-sm font-black text-[#063822]">{t.v1Title}</h3>
              <p className="text-xs text-[#17251D]/80 leading-relaxed font-medium">{t.v1Desc}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E8E3]">
              <span className="text-xs font-black text-[#174F32]">{t.v1Cost}</span>
              <button
                onClick={() => handleRedeem(400, t.v1Title)}
                className="px-3.5 py-2 bg-[#174F32] hover:bg-[#063822] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                {t.redeemBtn}
              </button>
            </div>
          </div>

          {/* Voucher 2 */}
          <div className="p-5 bg-[#F8F7F1] rounded-2xl border border-[#B4B394]/30 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#7B8428]/15 text-[#7B8428] flex items-center justify-center font-black">
                <Icon name="droplet" size={20} />
              </div>
              <h3 className="text-sm font-black text-[#063822]">{t.v2Title}</h3>
              <p className="text-xs text-[#17251D]/80 leading-relaxed font-medium">{t.v2Desc}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E8E3]">
              <span className="text-xs font-black text-[#7B8428]">{t.v2Cost}</span>
              <button
                onClick={() => handleRedeem(800, t.v2Title)}
                className="px-3.5 py-2 bg-[#174F32] hover:bg-[#063822] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                {t.redeemBtn}
              </button>
            </div>
          </div>

          {/* Voucher 3 */}
          <div className="p-5 bg-[#F8F7F1] rounded-2xl border border-[#B4B394]/30 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#D99A17]/20 text-[#D99A17] flex items-center justify-center font-black">
                <Icon name="award" size={20} />
              </div>
              <h3 className="text-sm font-black text-[#063822]">{t.v3Title}</h3>
              <p className="text-xs text-[#17251D]/80 leading-relaxed font-medium">{t.v3Desc}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E8E3]">
              <span className="text-xs font-black text-[#D99A17]">{t.v3Cost}</span>
              <button
                onClick={() => handleRedeem(1000, t.v3Title)}
                className="px-3.5 py-2 bg-[#D99A17] hover:bg-[#b07d12] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                {t.redeemBtn}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SustainabilityRewards;
