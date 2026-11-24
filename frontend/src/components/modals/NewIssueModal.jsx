import React, { useEffect, useRef, useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { X, Mic, MapPin, CheckCircle2, Sparkles, Send, Volume2 } from 'lucide-react';

const FLOW_STEPS = [
  { id: 'register', label: 'समस्या दर्ज करें' },
  { id: 'q1', label: 'प्रश्न 1' },
  { id: 'q2', label: 'प्रश्न 2' },
  { id: 'q3', label: 'प्रश्न 3' },
  { id: 'q4', label: 'प्रश्न 4' },
  { id: 'q5', label: 'प्रश्न 5' },
  { id: 'ai', label: 'AI प्रारंभिक मूल्यांकन' },
  { id: 'review', label: 'समीक्षा करें' },
  { id: 'submit', label: 'समस्या जमा करें' }
];

const LANGS = [
  { id: 'hi', short: 'हिंदी', label: 'हिंदी' },
  { id: 'en', short: 'English', label: 'English' },
  { id: 'khr', short: 'खोरठा', label: 'स्थानीय / खोरठा' }
];

const QUESTIONS = {
  q1: {
    field: 'affectedPeople',
    hi: 'इस समस्या से लगभग कितने लोग प्रभावित हैं?',
    en: 'Approximately how many people are affected by this problem?',
    khr: 'ई समस्या से लगभग कतना लोग प्रभावित हे?',
    options: [
      { hi: 'केवल मैं / मेरा परिवार', en: 'Only me / my family', khr: 'खाली हम / हमर परिवार' },
      { hi: '2–10 लोग', en: '2–10 people', khr: '2–10 लोग' },
      { hi: '10–50 लोग', en: '10–50 people', khr: '10–50 लोग' },
      { hi: '50–100 लोग', en: '50–100 people', khr: '50–100 लोग' },
      { hi: '100 से अधिक', en: 'More than 100', khr: '100 से ज्यादा' },
      { hi: 'पता नहीं', en: 'Do not know', khr: 'पता नइखे' }
    ]
  },
  q2: {
    field: 'immediateDanger',
    hi: 'क्या इस समस्या के कारण कोई तत्काल खतरा या नुकसान हुआ है?',
    en: 'Has this problem caused any immediate danger or damage?',
    khr: 'ई समस्या से कोनो तुरत खतरा वा नुकसान भेल हे?',
    options: [
      { hi: 'हाँ, गंभीर खतरा', en: 'Yes, serious danger', khr: 'हाँ, गंभीर खतरा' },
      { hi: 'हाँ, नुकसान हुआ है', en: 'Yes, damage has occurred', khr: 'हाँ, नुकसान भेल हे' },
      { hi: 'नहीं', en: 'No', khr: 'नइखे' },
      { hi: 'पता नहीं', en: 'Do not know', khr: 'पता नइखे' }
    ]
  },
  q3: {
    field: 'duration',
    hi: 'यह समस्या कितने समय से बनी हुई है?',
    en: 'For how long has this problem existed?',
    khr: 'ई समस्या कतना दिन से चल रहल हे?',
    options: [
      { hi: 'आज से', en: 'Since today', khr: 'आज से' },
      { hi: '2–3 दिन', en: '2–3 days', khr: '2–3 दिन' },
      { hi: '4–7 दिन', en: '4–7 days', khr: '4–7 दिन' },
      { hi: '1–4 सप्ताह', en: '1–4 weeks', khr: '1–4 हफ्ता' },
      { hi: '1 महीने से अधिक', en: 'More than 1 month', khr: '1 महीना से ज्यादा' },
      { hi: 'पता नहीं', en: 'Do not know', khr: 'पता नइखे' }
    ]
  },
  q4: {
    field: 'impactLevel',
    hi: 'इस समस्या के कारण आपको या प्रभावित लोगों को कितना नुकसान/असुविधा हुई है?',
    en: 'How much harm or inconvenience has this problem caused you or the affected people?',
    khr: 'ई समस्या से रउआ या प्रभावित लोगन के कतना नुकसान/परेशानी भेल हे?',
    options: [
      { hi: 'बहुत कम', en: 'Very low', khr: 'बहुत कम' },
      { hi: 'कम', en: 'Low', khr: 'कम' },
      { hi: 'मध्यम', en: 'Medium', khr: 'मध्यम' },
      { hi: 'अधिक', en: 'High', khr: 'ज्यादा' },
      { hi: 'बहुत अधिक', en: 'Very high', khr: 'बहुत ज्यादा' },
      { hi: 'पता नहीं', en: 'Do not know', khr: 'पता नइखे' }
    ]
  },
  q5: {
    field: 'evidenceChoice',
    hi: 'क्या आपके पास इस समस्या से संबंधित फोटो या वीडियो है?',
    en: 'Do you have a photo or video related to this problem?',
    khr: 'रउआ लगे ई समस्या के फोटो वा वीडियो हे?',
    options: [
      { hi: '📷 फोटो जोड़ें', en: 'Add photo', khr: '📷 फोटो जोड़ा', action: 'photo' },
      { hi: '🎥 वीडियो जोड़ें', en: 'Add video', khr: '🎥 वीडियो जोड़ा', action: 'video' },
      { hi: '📷🎥 फोटो और वीडियो दोनों', en: 'Add both photo and video', khr: '📷🎥 दुनू जोड़ा', action: 'both' },
      { hi: '⏭️ उपलब्ध नहीं है', en: 'Not available', khr: '⏭️ उपलब्ध नइखे', action: 'none' },
      { hi: 'पता नहीं', en: 'Do not know', khr: 'पता नइखे', action: 'unknown' }
    ]
  }
};

const FOLLOWUP = {
  hi: 'किस प्रकार का खतरा या नुकसान हुआ है?',
  en: 'What kind of danger or damage occurred?',
  khr: 'कइसन खतरा वा नुकसान भेल हे?'
};

const emptyAnswers = {
  affectedPeople: '',
  immediateDanger: '',
  damageDescription: '',
  duration: '',
  impactLevel: '',
  photoEvidence: null,
  videoEvidence: null,
  evidenceChoice: '',
  language: 'hi',
  voiceAnswer: {}
};

const speakText = (text, lang) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
};

const matchOption = (transcript, options, lang) => {
  const t = (transcript || '').toLowerCase();
  const scored = options.map((opt) => {
    const hay = `${opt.hi} ${opt.en} ${opt.khr}`.toLowerCase();
    const hit = hay.split(/[\s,/–-]+/).filter((w) => w.length > 1 && t.includes(w)).length;
    return { opt, hit };
  });
  scored.sort((a, b) => b.hit - a.hit);
  return scored[0]?.hit > 0 ? scored[0].opt[lang] || scored[0].opt.hi : transcript;
};

const computeConfidence = (answers, hasPhoto, hasVideo) => {
  let score = 82;
  if (answers.affectedPeople.includes('100')) score += 5;
  else if (answers.affectedPeople.includes('50')) score += 4;
  else if (answers.affectedPeople.includes('10')) score += 3;
  if (answers.immediateDanger.startsWith('हाँ') || answers.immediateDanger.toLowerCase().startsWith('yes')) score += 4;
  if (answers.impactLevel.includes('बहुत अधिक') || answers.impactLevel.toLowerCase().includes('very high')) score += 3;
  if (hasPhoto) score += 3;
  if (hasVideo) score += 2;
  if (answers.damageDescription) score += 1;
  return Math.min(96, Math.max(78, score));
};

const evidenceLabel = (photo, video, choice = '') => {
  if (photo && video) return 'फोटो और वीडियो उपलब्ध';
  if (photo) return 'फोटो उपलब्ध';
  if (video) return 'वीडियो उपलब्ध';
  if (choice.includes('पता नहीं')) return 'पता नहीं';
  return 'उपलब्ध नहीं है';
};

export const NewIssueModal = ({ isOpen, onClose }) => {
  const { addNewIssue, language: appLanguage } = useEcosystem();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const pendingVideoRef = useRef(false);

  const [step, setStep] = useState('register');
  const [qLang, setQLang] = useState(appLanguage || 'hi');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [listeningField, setListeningField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'जल आपूर्ति',
    location: 'जयपुर नगर निगम क्षेत्र',
    priority: 'उच्च',
    description: '',
    citizenName: '',
    citizenPhone: ''
  });
  const [answers, setAnswers] = useState({ ...emptyAnswers, language: appLanguage || 'hi' });
  const [textFallback, setTextFallback] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(91);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  useEffect(() => {
    if (isOpen) setQLang(appLanguage || 'hi');
  }, [isOpen, appLanguage]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
      recognitionRef.current?.stop?.();
    };
  }, []);

  const stepIndex = FLOW_STEPS.findIndex((s) => s.id === step);
  const currentQ = QUESTIONS[step];
  const qText = currentQ ? currentQ[qLang] || currentQ.hi : '';
  const showDangerFollowUp = Boolean(
    answers.immediateDanger && (answers.immediateDanger.startsWith('हाँ') || answers.immediateDanger.toLowerCase().startsWith('yes'))
  );

  const resetAll = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop?.();
    setStep('register');
    setVoiceText('');
    setIsRecording(false);
    setListeningField(null);
    setTextFallback('');
    setAiAnalyzing(false);
    setSubmittedIssue(null);
    setAnswers({ ...emptyAnswers, language: appLanguage || 'hi' });
    setFormData({
      title: '',
      category: 'जल आपूर्ति',
      location: 'जयपुर नगर निगम क्षेत्र',
      priority: 'उच्च',
      description: '',
      citizenName: '',
      citizenPhone: ''
    });
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const startVoice = (onResult, fieldKey) => {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setListeningField(fieldKey);
    if (!SR) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setListeningField(null);
        onResult('पता नहीं');
      }, 900);
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = qLang === 'en' ? 'en-IN' : 'hi-IN';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
      setIsRecording(false);
      setListeningField(null);
    };
    rec.onerror = () => {
      setIsRecording(false);
      setListeningField(null);
    };
    rec.onend = () => {
      setIsRecording(false);
      setListeningField(null);
    };
    setIsRecording(true);
    rec.start();
  };

  const handleRegisterVoice = () => {
    startVoice((transcript) => {
      setVoiceText(transcript);
      setFormData((prev) => ({
        ...prev,
        description: transcript,
        title: prev.title || transcript.slice(0, 48)
      }));
    }, 'register');
  };

  const goNextFromRegister = (e) => {
    e.preventDefault();
    setStep('q1');
    setTextFallback('');
  };

  const selectOption = (questionId, option) => {
    const q = QUESTIONS[questionId];
    const value = option[qLang] || option.hi;
    setAnswers((prev) => ({
      ...prev,
      [q.field]: option.hi,
      language: qLang
    }));
    setTextFallback(value);
  };

  const applyVoiceToQuestion = (questionId, transcript) => {
    const q = QUESTIONS[questionId];
    const matched = q.options ? matchOption(transcript, q.options, 'hi') : transcript;
    setAnswers((prev) => ({
      ...prev,
      [q.field]: matched,
      language: qLang,
      voiceAnswer: { ...prev.voiceAnswer, [questionId]: transcript }
    }));
    setTextFallback(matched);
  };

  const canContinueQuestion = () => {
    if (step === 'q1') return Boolean(answers.affectedPeople || textFallback.trim());
    if (step === 'q2') {
      const danger = answers.immediateDanger || textFallback.trim();
      if (!danger) return false;
      if (showDangerFollowUp && !answers.damageDescription.trim()) return false;
      return true;
    }
    if (step === 'q3') return Boolean(answers.duration || textFallback.trim());
    if (step === 'q4') return Boolean(answers.impactLevel || textFallback.trim());
    if (step === 'q5') return Boolean(answers.evidenceChoice || textFallback.trim());
    return true;
  };

  const persistTextFallback = () => {
    if (!currentQ || !textFallback.trim() || !currentQ.field) return;
    setAnswers((prev) => ({ ...prev, [currentQ.field]: prev[currentQ.field] || textFallback.trim(), language: qLang }));
  };

  const nextAfterQuestion = () => {
    persistTextFallback();
    const order = ['q1', 'q2', 'q3', 'q4', 'q5', 'ai'];
    const i = order.indexOf(step);
    if (step === 'q5') {
      const conf = computeConfidence(
        {
          ...answers,
          affectedPeople: answers.affectedPeople || textFallback,
          duration: answers.duration,
          impactLevel: answers.impactLevel
        },
        Boolean(answers.photoEvidence),
        Boolean(answers.videoEvidence)
      );
      setAiConfidence(conf);
      setStep('ai');
      return;
    }
    setTextFallback('');
    setStep(order[i + 1]);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnswers((prev) => ({
      ...prev,
      photoEvidence: { name: file.name, type: file.type, url: URL.createObjectURL(file) },
      evidenceChoice: prev.evidenceChoice || '📷 फोटो जोड़ें'
    }));
    if (pendingVideoRef.current) {
      pendingVideoRef.current = false;
      setTimeout(() => videoInputRef.current?.click(), 250);
    }
  };

  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnswers((prev) => ({
      ...prev,
      videoEvidence: { name: file.name, type: file.type, url: URL.createObjectURL(file) },
      evidenceChoice: prev.evidenceChoice || '🎥 वीडियो जोड़ें'
    }));
  };

  const handleEvidenceOption = (option) => {
    pendingVideoRef.current = option.action === 'both';
    setAnswers((prev) => ({
      ...prev,
      evidenceChoice: option.hi,
      language: qLang,
      ...(option.action === 'none' || option.action === 'unknown'
        ? { photoEvidence: null, videoEvidence: null }
        : {})
    }));
    setTextFallback(option[qLang] || option.hi);
    if (option.action === 'photo' || option.action === 'both') photoInputRef.current?.click();
    if (option.action === 'video') videoInputRef.current?.click();
  };

  const submitComplaint = () => {
    setAiAnalyzing(true);
    setTimeout(async () => {
      const issue = await addNewIssue({
        ...formData,
        ...answers,
        language: qLang,
        aiConfidence
      });
      setAiAnalyzing(false);
      setSubmittedIssue(issue);
      setStep('submit');
    }, 900);
  };

  const progressRail = (
    <ol className="space-y-0 text-[11px] font-bold text-slate-600 shrink-0 w-40 hidden sm:block">
      {FLOW_STEPS.map((s, idx) => {
        const active = s.id === step || (submittedIssue && s.id === 'submit');
        const done = idx < stepIndex || Boolean(submittedIssue);
        return (
          <li key={s.id} className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-amber-500' : done ? 'bg-emerald-600' : 'bg-slate-300'}`} />
              <span className={active ? 'text-gov-navy' : done ? 'text-emerald-800' : 'text-slate-500'}>{s.label}</span>
            </div>
            {idx < FLOW_STEPS.length - 1 && <span className="ml-[3px] my-0.5 text-slate-300 leading-none">↓</span>}
          </li>
        );
      })}
    </ol>
  );

  const langBar = (
    <div className="flex flex-wrap gap-1.5">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => {
            setQLang(l.id);
            setAnswers((prev) => ({ ...prev, language: l.id }));
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
            qLang === l.id ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-300'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  const questionChrome = currentQ && (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-extrabold text-gov-navy">कुछ जानकारी साझा करें</h3>
        <p className="text-xs text-slate-600 mt-1">
          इन प्रश्नों के उत्तर आपकी समस्या की गंभीरता और प्राथमिकता समझने में हमारी सहायता करेंगे।
        </p>
      </div>
      {langBar}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => speakText(qText, qLang)}
          className="px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-300 text-gov-navy font-bold text-sm flex items-center gap-2"
        >
          <Volume2 className="w-5 h-5" />
          प्रश्न सुनें
        </button>
        <button
          type="button"
          onClick={() =>
            startVoice((tr) => {
              if (step === 'q5') {
                const matched = matchOption(tr, QUESTIONS.q5.options, 'hi');
                const opt = QUESTIONS.q5.options.find((o) => o.hi === matched) || QUESTIONS.q5.options[4];
                handleEvidenceOption(opt);
                setAnswers((prev) => ({ ...prev, voiceAnswer: { ...prev.voiceAnswer, q5: tr } }));
              } else {
                applyVoiceToQuestion(step, tr);
              }
            }, step)
          }
          className={`px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 ${
            isRecording && listeningField === step ? 'bg-red-600 text-white animate-pulse' : 'bg-gov-navy text-white'
          }`}
        >
          <Mic className="w-5 h-5" />
          {isRecording && listeningField === step ? 'सुन रहे हैं...' : 'आवाज़ से उत्तर दें'}
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-3xl w-full overflow-hidden">
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between border-b-4 border-amber-500">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold">नई जन समस्या दर्ज करें (Report Issue)</h3>
            </div>
            <p className="text-xs text-slate-300">आपकी समस्या AI द्वारा विश्लेषित होकर तुरंत सही विभाग को प्रेषित होगी</p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="sm:hidden px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-gov-navy">
          {FLOW_STEPS[Math.min(stepIndex, FLOW_STEPS.length - 1)]?.label} · चरण {Math.min(stepIndex + 1, FLOW_STEPS.length)} / {FLOW_STEPS.length}
        </div>

        <div className="flex gap-4 p-4 sm:p-6">
          {progressRail}

          <div className="flex-1 min-w-0">
            {step === 'register' && !submittedIssue && (
              <form onSubmit={goNextFromRegister} className="space-y-4 text-xs">
                <div className="bg-amber-50 rounded-lg p-3.5 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-900 block text-xs">🎤 समस्या बोलकर दर्ज करें (Voice Input)</span>
                    <span className="text-[11px] text-amber-800">बोलने के लिए माइक बटन दबाएं, AI स्वतः टाइप करेगा</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegisterVoice}
                    className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                      isRecording && listeningField === 'register'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-600 text-gov-navy'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecording && listeningField === 'register' ? 'रिकॉर्ड जारी...' : 'बोलें'}</span>
                  </button>
                </div>

                {voiceText && (
                  <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded border border-emerald-200 font-medium">
                    🗣️ एआई स्पीच रिकॉग्निशन: "{voiceText}"
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">समस्या का नाम / शीर्षक *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. नाले की सफाई / सड़क मरम्मत"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-gov-navy focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category) *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-gov-navy focus:outline-none text-xs bg-white"
                    >
                      <option value="जल आपूर्ति">जल आपूर्ति (Water)</option>
                      <option value="सड़क एवं आधारभूत संरचना">सड़क एवं बुनियादी ढांचा (Roads)</option>
                      <option value="कचरा प्रबंधन">कचरा प्रबंधन (Waste)</option>
                      <option value="स्ट्रीट लाइट">स्ट्रीट लाइट (Lights)</option>
                      <option value="स्वास्थ्य">स्वास्थ्य (Health)</option>
                      <option value="बिजली">बिजली (Power)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">प्राथमिकता स्तर</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-gov-navy focus:outline-none text-xs bg-white"
                    >
                      <option value="उच्च">🔴 उच्च (Emergency / High)</option>
                      <option value="मध्यम">🟠 मध्यम (Normal)</option>
                      <option value="निम्न">🟢 निम्न (Low Priority)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">स्थान / वार्ड / लैंडमार्क *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="उदा. वार्ड 26, वैशाली नगर, जयपुर"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 pl-8 border border-slate-300 rounded focus:ring-2 focus:ring-gov-navy focus:outline-none text-xs"
                    />
                    <MapPin className="w-4 h-4 text-red-600 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">समस्या का पूरा विवरण</label>
                  <textarea
                    rows={3}
                    placeholder="कृपया समस्या का विस्तृत विवरण लिखें..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-gov-navy focus:outline-none text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2 border-t border-slate-200">
                  <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded">
                    रद्द करें
                  </button>
                  <button type="submit" className="px-6 py-2 bg-gov-navy hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1.5 shadow">
                    आगे बढ़ें — प्रश्न 1
                  </button>
                </div>
              </form>
            )}

            {['q1', 'q2', 'q3', 'q4', 'q5'].includes(step) && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4">
                {questionChrome}
                <p className="text-base sm:text-lg font-extrabold text-gov-navy leading-snug">{qText}</p>
                {qLang !== 'hi' && <p className="text-sm text-slate-600">{currentQ.hi}</p>}
                {qLang !== 'en' && <p className="text-sm text-slate-600">{currentQ.en}</p>}

                {step === 'q5' && (
                  <>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.options.map((opt) => {
                    const selected = answers[currentQ.field] === opt.hi;
                    return (
                      <button
                        key={opt.hi}
                        type="button"
                        onClick={() => (step === 'q5' ? handleEvidenceOption(opt) : selectOption(step, opt))}
                        className={`min-h-[52px] px-4 py-3 rounded-xl border-2 text-left font-bold text-sm transition-colors ${
                          selected
                            ? 'bg-gov-navy text-white border-gov-navy'
                            : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400'
                        }`}
                      >
                        <span className="block">{opt[qLang] || opt.hi}</span>
                        {qLang !== 'hi' && <span className="block text-[11px] font-medium opacity-80">{opt.hi}</span>}
                        {qLang !== 'en' && <span className="block text-[11px] font-medium opacity-80">{opt.en}</span>}
                      </button>
                    );
                  })}
                </div>

                {step === 'q5' && (answers.photoEvidence || answers.videoEvidence) && (
                  <p className="text-xs font-semibold text-emerald-800">
                    {evidenceLabel(answers.photoEvidence, answers.videoEvidence, answers.evidenceChoice)}
                    {answers.photoEvidence?.name ? ` · ${answers.photoEvidence.name}` : ''}
                    {answers.videoEvidence?.name ? ` · ${answers.videoEvidence.name}` : ''}
                  </p>
                )}

                {step !== 'q5' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">या अपना उत्तर लिखें</label>
                  <input
                    type="text"
                    value={textFallback}
                    onChange={(e) => {
                      setTextFallback(e.target.value);
                      setAnswers((prev) => ({ ...prev, [currentQ.field]: e.target.value, language: qLang }));
                    }}
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm"
                    placeholder="टेक्स्ट से उत्तर..."
                  />
                </div>
                )}

                {step === 'q2' && showDangerFollowUp && (
                  <div className="bg-white border border-amber-200 rounded-xl p-3 space-y-2">
                    <label className="block font-bold text-sm text-gov-navy">{FOLLOWUP[qLang]}</label>
                    <textarea
                      rows={2}
                      value={answers.damageDescription}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, damageDescription: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="विवरण लिखें..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        startVoice((tr) => {
                          setAnswers((prev) => ({
                            ...prev,
                            damageDescription: tr,
                            voiceAnswer: { ...prev.voiceAnswer, damage: tr }
                          }));
                        }, 'damage')
                      }
                      className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        isRecording && listeningField === 'damage' ? 'bg-red-600 text-white' : 'bg-amber-500 text-gov-navy'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      आवाज़ से बताएँ
                    </button>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(step === 'q1' ? 'register' : `q${Number(step.slice(1)) - 1}`)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg"
                  >
                    पीछे
                  </button>
                  <button
                    type="button"
                    disabled={!canContinueQuestion()}
                    onClick={nextAfterQuestion}
                    className="px-5 py-2.5 bg-gov-navy text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    आगे बढ़ें
                  </button>
                </div>
              </div>
            )}

            {step === 'ai' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4">
                <h3 className="text-lg font-extrabold text-gov-navy">AI प्रारंभिक मूल्यांकन</h3>
                <div className="bg-white rounded-lg border border-slate-200 divide-y text-sm">
                  {[
                    ['समस्या का प्रकार', formData.category],
                    ['स्थान', formData.location],
                    ['प्रभावित लोग', answers.affectedPeople || '—'],
                    ['तत्काल खतरा / नुकसान', answers.immediateDanger || '—'],
                    ['समस्या की अवधि', answers.duration || '—'],
                    ['प्रभाव का स्तर', answers.impactLevel || '—'],
                    ['प्रमाण उपलब्धता', evidenceLabel(answers.photoEvidence, answers.videoEvidence, answers.evidenceChoice)]
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 px-3 py-2.5">
                      <span className="text-slate-500 font-semibold">{k}</span>
                      <span className="font-bold text-slate-800 text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center bg-gov-navy text-white rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">AI Verification Confidence</div>
                  <div className="text-4xl font-black mt-1">{aiConfidence}%</div>
                </div>
                <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  यह AI द्वारा किया गया प्रारंभिक आकलन है। अंतिम सत्यापन संबंधित विभाग द्वारा किया जाएगा।
                </p>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep('q5')} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg">
                    पीछे
                  </button>
                  <button type="button" onClick={() => setStep('review')} className="px-5 py-2.5 bg-gov-navy text-white font-bold rounded-lg">
                    समीक्षा करें
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && !submittedIssue && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4">
                <h3 className="text-lg font-extrabold text-gov-navy">समीक्षा करें</h3>
                <p className="text-xs text-slate-600">जमा करने से पहले अपनी जानकारी जाँचें।</p>
                <div className="bg-white rounded-lg border border-slate-200 text-sm divide-y">
                  {[
                    ['शीर्षक', formData.title],
                    ['श्रेणी', formData.category],
                    ['स्थान', formData.location],
                    ['प्रभावित लोग', answers.affectedPeople],
                    ['तत्काल खतरा', answers.immediateDanger],
                    ['खतरा / नुकसान विवरण', answers.damageDescription || '—'],
                    ['अवधि', answers.duration],
                    ['प्रभाव', answers.impactLevel],
                    ['प्रमाण', evidenceLabel(answers.photoEvidence, answers.videoEvidence, answers.evidenceChoice)]
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 px-3 py-2">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-bold text-right">{v || '—'}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep('ai')} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg">
                    पीछे
                  </button>
                  <button
                    type="button"
                    disabled={aiAnalyzing}
                    onClick={submitComplaint}
                    className="px-5 py-2.5 bg-gov-navy text-white font-bold rounded-lg flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    {aiAnalyzing ? 'AI विश्लेषण जारी...' : 'समस्या जमा करें'}
                  </button>
                </div>
              </div>
            )}

            {submittedIssue && (
              <div className="p-4 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gov-navy">समस्या सफलतापूर्वक दर्ज हो गई है!</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    आपकी शिकायत आईडी:{' '}
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">{submittedIssue.id}</span>
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left text-xs space-y-2">
                  <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AI स्मार्ट रूटिंग परिणाम (Live AI Routing):</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">श्रेणी:</span>
                    <span className="font-semibold text-slate-800">{submittedIssue.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">आवंटित विभाग:</span>
                    <span className="font-semibold text-emerald-700">{submittedIssue.assignedDept}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Verification Confidence:</span>
                    <span className="font-bold text-blue-700">{submittedIssue.aiConfidence}%</span>
                  </div>
                </div>
                <button onClick={handleClose} className="w-full bg-gov-navy hover:bg-slate-800 text-white font-bold py-2.5 rounded shadow text-xs">
                  डैशबोर्ड पर वापस जाएं
                </button>
              </div>
            )}
          </div>
      