import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialIssues, initialUniversityProjects, initialCsrOpportunities, ecosystemStats as initialStats } from '../data/mockData';
import { sankalpApi } from '../api/client';

const EcosystemContext = createContext();

export const translations = {
  hi: {
    // Header & Brand
    brandName: "संकल्प",
    tagline: "जन समस्या से समाधान तक",
    subTagline: "ज्ञान • सहयोग • नवाचार • प्रभाव",
    govtTitle: "भारत सरकार • राष्ट्रीय जन सेवा समाधान पोर्टल",
    callCenter: "टोल-फ्री IVR: 1800-185-2026",
    selectRole: "रोल चुनें (Select Role)",
    switchRole: "हितधारक रोल बदलें (Switch View)",

    // Landing Page
    heroTitle: "हर समस्या महत्वपूर्ण है, हर आवाज़ की ताकत है",
    heroSubtitle: "आइए मिलकर भारत को बेहतर बनाएं",
    trackTitle: "लाइव शिकायत ट्रैकिंग (Live Complaint Status Tracking)",
    trackPlaceholder: "अपनी शिकायत आईडी दर्ज करें (उदा. SNK-2026-0012)",
    trackBtn: "ट्रैक करें (Track Status)",
    accessTitle: "संकल्प तक पहुँचने के आसान विकल्प",
    accessSub: "हर नागरिक के पास आवाज़ उठाने का सशक्त माध्यम उपलब्ध है",
    access1Title: "1. मोबाइल ऐप / वेबसाइट",
    access1Badge: "स्मार्टफोन उपयोगकर्ता",
    access1List1: "🎤 समस्या बोलें / लिखें",
    access1List2: "📷 फोटो जोड़ें",
    access1List3: "📍 स्थान साझा करें",
    access1Btn: "→ शिकायत स्थिति ट्रैक करें",
    access2Title: "2. कॉल / IVR हेल्पलाइन",
    access2Badge: "कीपैड फोन उपयोगकर्ता",
    access2Btn: "📞 तुरंत कॉल करें (1800-185-2026)",
    access3Title: "3. CSC / पंचायत सहायता",
    access3Badge: "जिनके पास फोन नहीं है",
    access3Btn: "→ पंचायत ऑपरेटर पोर्टल",
    welcomeTitle: "Welcome to SANKALP — हितधारक प्रवेश पोर्टल",
    roleCitizen: "👤 नागरिक (शिकायत ट्रैकिंग)",
    roleGov: "🏛️ सरकारी अधिकारी",
    roleUniv: "🎓 विश्वविद्यालय / IIC",
    roleCsr: "🏢 उद्योग / CSR साझेदार",
    roleAdmin: "🛡️ प्रशासन / कमांड सेंटर (🔒 सुरक्षित लॉग इन)",

    // Citizen Dashboard
    citGreeting: "नमस्ते, आपका स्वागत है 👋",
    citSub: "नागरिक पोर्टल • अपनी शिकायत संख्या दर्ज कर लाइव स्थिति एवं अपडेट ट्रैक करें",
    myReports: "कुल ट्रैक की गई शिकायतें",
    inProgress: "प्रगति पर",
    resolved: "समाधान हो चुकी",
    pending: "लंबित",
    recentReports: "हाल की ट्रैक की गई शिकायतें",
    filterAll: "सभी",
    step1: "दर्ज",
    step2: "AI विश्लेषण",
    step3: "सत्यापन",
    step4: "सही संस्था",
    step5: "समाधान",
    step6: "प्रभाव",
    assignedDeptLabel: "नोडल विभाग:",
    priorityLabel: "प्राथमिकता",

    // Gov Dashboard
    govTitle: "सरकारी डैशबोर्ड",
    govSub: "आपके विभाग से संबंधित समस्याओं की निगरानी",
    govSla: "विभागीय एसएलए निस्तारण दर: 94.2%",
    totalIssues: "कुल समस्याएँ",
    highPriority: "उच्च प्राथमिकता",
    completed: "समाधान पूर्ण",
    liveMapTitle: "लाइव जन समस्या मानचित्र (Regional Problem Map)",
    mainCatTitle: "मुख्य श्रेणियाँ (Category Distribution)",
    highPriorityQueueTitle: "उच्च प्राथमिकता समस्याएँ (Action Queue)",
    actionBtn: "कार्रवाई स्वीकृत करें",
    viewAiReasoning: "AI रूट तर्क देखें",

    // Sidebar Items
    navOverview: "अवलोकन (Overview)",
    navMyIssues: "मेरी समस्याएँ (My Issues)",
    navHighPriority: "उच्च प्राथमिकता (High Priority)",
    navMap: "मानचित्र (Live Map)",
    navAi: "AI विश्लेषण (AI Hub)",
    navRouting: "स्मार्ट रूटिंग (Smart Routing)",
    navCollab: "सहयोग (Inter-Dept Collab)",
    navReports: "रिपोर्ट (MIS Reports)",
    navImpact: "प्रभाव (Impact Score)",
    navStakeholders: "हितधारक (Stakeholders Matrix)",
    navEscalation: "एस्केलेशन (Escalation Engine)",
    navSettings: "सेटिंग्स (Settings)",

    // University Dashboard
    univTitle: "विश्वविद्यालय / IIC डैशबोर्ड",
    univSub: "वास्तविक सामाजिक समस्याओं को नवाचार परियोजनाओं में बदलें",
    newChallenges: "नए चैलेंज",
    activeProjects: "सक्रिय परियोजनाएँ",
    proposedSolutions: "प्रस्तावित समाधान",
    completedProjects: "पूर्ण परियोजनाएँ",
    challengesTitle: "नागरिकों से आई नई चुनौतियाँ (Civic R&D Challenges)",
    myProjectsTitle: "मेरे प्रोजेक्ट (Active Innovation Projects)",
    proposeBtn: "समाधान प्रस्तावित करें",

    // CSR Dashboard
    csrTitle: "उद्योग / CSR डैशबोर्ड",
    csrSub: "सामाजिक समस्याओं के समाधान में सहयोग करें",
    totalOpps: "कुल अवसर",
    activeFunding: "सक्रिय फंडिंग",
    impactProjects: "प्रभाव परियोजनाएँ",
    resourceContrib: "संसाधन योगदान",
    coopsTitle: "सहयोग के अवसर (CSR Collaboration Opportunities)",
    myCsrProjectsTitle: "मेरी सक्रिय परियोजनाएँ (My Active CSR Deployments)",
    coFundBtn: "सहयोग करें (Co-Fund & Support)",

    // Admin Command Center
    adminTitle: "प्रशासन / कमांड सेंटर",
    adminSub: "पूरे SANKALP ecosystem की निगरानी",
    aiAnalyzed: "AI विश्लेषित",
    verified: "सत्यापित",
    smartRoutingTitle: "3. SMART ROUTING ENGINE (एआई स्मार्ट रूटिंग)",
    whyAiChoseBtn: "AI ने यह रूट क्यों चुना? (Why AI Chose This Route)",

    // Admin Auth
    adminAuthTitle: "प्रशासनिक कमांड सेंटर लॉग इन (Admin Authentication Required)",
    adminAuthSub: "यह क्षेत्र केवल अधिकृत प्रशासनिक नोडल अधिकारियों के लिए आरक्षित है",
    usernameLabel: "अधिकारी आईडी / उपयोगकर्ता नाम",
    passwordLabel: "सुरक्षा पासवर्ड",
    loginBtn: "कमांड सेंटर में प्रवेश करें",
    logoutBtn: "लॉग आउट (Logout)",

    // Modals
    modalNewIssueTitle: "शिकायत स्थिति ट्रैकिंग",
    cancelBtn: "रद्द करें",
    closeBtn: "बंद करें",
  },
  en: {
    // Header & Brand
    brandName: "SANKALP",
    tagline: "From Public Problem to Solution",
    subTagline: "Knowledge • Collaboration • Innovation • Impact",
    govtTitle: "Govt of India • National Public Civic Solution Portal",
    callCenter: "Toll-Free IVR: 1800-185-2026",
    selectRole: "Select Role",
    switchRole: "Switch View",

    // Landing Page
    heroTitle: "Every Problem Matters, Every Voice Has Power",
    heroSubtitle: "Let's come together to build a better India",
    trackTitle: "Live Complaint Status Tracking",
    trackPlaceholder: "Enter your complaint ID (e.g. SNK-2026-0012)",
    trackBtn: "Track Status",
    accessTitle: "Easy Ways to Access SANKALP",
    accessSub: "Empowering every citizen with accessible reporting channels",
    access1Title: "1. Mobile App / Website",
    access1Badge: "Smartphone Users",
    access1List1: "🎤 Speak or Type Problem",
    access1List2: "📷 Attach Photo",
    access1List3: "📍 Share Geo-Location",
    access1Btn: "→ Track Complaint Status",
    access2Title: "2. Call / IVR Helpline",
    access2Badge: "Feature Phone Users",
    access2Btn: "📞 Call Now (1800-185-2026)",
    access3Title: "3. CSC / Panchayat Assistance",
    access3Badge: "For Citizens Without Phone",
    access3Btn: "→ Panchayat Portal",
    welcomeTitle: "Welcome to SANKALP — Stakeholder Login Portal",
    roleCitizen: "👤 Citizen (Tracking)",
    roleGov: "🏛️ Government Official",
    roleUniv: "🎓 University / IIC",
    roleCsr: "🏢 Industry / CSR Partner",
    roleAdmin: "🛡️ Admin Command Center (🔒 Secure Login)",

    // Citizen Dashboard
    citGreeting: "Welcome, Hello 👋",
    citSub: "Citizen Portal • Enter your complaint ID to track real-time resolution status",
    myReports: "Total Tracked Complaints",
    inProgress: "In Progress",
    resolved: "Resolved",
    pending: "Pending",
    recentReports: "Recent Tracked Complaints",
    filterAll: "All",
    step1: "Registered",
    step2: "AI Analysis",
    step3: "Verification",
    step4: "Smart Routing",
    step5: "Resolved",
    step6: "Impact",
    assignedDeptLabel: "Nodal Dept:",
    priorityLabel: "Priority",

    // Gov Dashboard
    govTitle: "Government Dashboard",
    govSub: "Monitor civic issues assigned to your department",
    govSla: "Departmental SLA Resolution Rate: 94.2%",
    totalIssues: "Total Issues",
    highPriority: "High Priority",
    completed: "Resolved Complete",
    liveMapTitle: "Live Regional Problem Map",
    mainCatTitle: "Main Categories",
    highPriorityQueueTitle: "High Priority Action Queue",
    actionBtn: "Approve Dispatch Action",
    viewAiReasoning: "View AI Routing Logic",

    // Sidebar Items
    navOverview: "Overview",
    navMyIssues: "My Issues",
    navHighPriority: "High Priority",
    navMap: "Live Map",
    navAi: "AI Intelligence Hub",
    navRouting: "Smart Routing Engine",
    navCollab: "Inter-Dept Collab",
    navReports: "MIS Reports",
    navImpact: "Impact Score",
    navStakeholders: "Stakeholders Matrix",
    navEscalation: "Escalation Engine",
    navSettings: "Settings",

    // University Dashboard
    univTitle: "University / IIC Dashboard",
    univSub: "Turn Real Social Problems into R&D Innovation Projects",
    newChallenges: "New Challenges",
    activeProjects: "Active Projects",
    proposedSolutions: "Proposed Solutions",
    completedProjects: "Completed Projects",
    challengesTitle: "Civic R&D Challenges from Citizens",
    myProjectsTitle: "My Active Innovation Projects",
    proposeBtn: "Propose Solution",

    // CSR Dashboard
    csrTitle: "Industry / CSR Dashboard",
    csrSub: "Co-Fund & Support Real-World Social Solutions",
    totalOpps: "Total Opportunities",
    activeFunding: "Active Grants",
    impactProjects: "Impact Projects",
    resourceContrib: "Resource Contribution",
    coopsTitle: "CSR Collaboration Opportunities",
    myCsrProjectsTitle: "My Active CSR Deployments",
    coFundBtn: "Co-Fund & Support",

    // Admin Command Center
    adminTitle: "Administration / Command Center",
    adminSub: "Monitoring the Entire SANKALP Ecosystem",
    aiAnalyzed: "AI Analyzed",
    verified: "Verified",
    smartRoutingTitle: "3. SMART ROUTING ENGINE",
    whyAiChoseBtn: "Why AI Chose This Route?",

    // Admin Auth
    adminAuthTitle: "Admin Command Center Authentication",
    adminAuthSub: "This restricted area is for authorized government command officers only",
    usernameLabel: "Officer ID / Username",
    passwordLabel: "Security Password",
    loginBtn: "Login to Command Center",
    logoutBtn: "Logout",

    // Modals
    modalNewIssueTitle: "Complaint Status Tracking",
    cancelBtn: "Cancel",
    closeBtn: "Close",
  },
  khr: {
    // Header & Brand
    brandName: "संकल्प (सँकलप)",
    tagline: "लोक समस्या से समाधान तक",
    subTagline: "ज्ञान • सहयोग • नवाचार • प्रभाव",
    govtTitle: "भारत सरकार • राष्ट्रीय जन सेवा समाधान जोहार पोर्टल",
    callCenter: "टोल-फ्री IVR: 1800-185-2026",
    selectRole: "रोल बाछा (Select Role)",
    switchRole: "हितधारक रोल बदला",

    // Landing Page
    heroTitle: "सभ समस्या काम के हे, सभे बोली में ताकत हे",
    heroSubtitle: "आवा सभे मिली के भारत के बेस बनावा",
    trackTitle: "लाइव समस्या ट्रैकिंग देखा",
    trackPlaceholder: "आपनि समस्या संख्या दर्ज करा (उदा. SNK-2026-0012)",
    trackBtn: "देखें (Track)",
    accessTitle: "संकल्प तक पहुँचे के सहज विकल्प",
    accessSub: "सभे नागरिक ले आवाज़ उठाये के माध्यम उपलब्ध हे",
    access1Title: "1. मोबाइल ऐप / वेबसाइट",
    access1Badge: "स्मार्टफोन चलावे वाला",
    access1List1: "🎤 समस्या बोला वा लिखा",
    access1List2: "📷 फोटो जोड़ा",
    access1List3: "📍 जगह बतावा (Location)",
    access1Btn: "→ समस्या स्थिति देखा",
    access2Title: "2. फोन कॉल / IVR",
    access2Badge: "कीपैड फोन चलावे वाला",
    access2Btn: "📞 तुरते कॉल करा (1800-185-2026)",
    access3Title: "3. CSC / पंचायत मदद",
    access3Badge: "जैकरा पास फोन नईखे",
    access3Btn: "→ पंचायत ऑपरेटर दुआर",
    welcomeTitle: "संकल्प में जोहार — हितधारक प्रवेश पोर्टल",
    roleCitizen: "👤 नागरिक (ट्रैकिंग)",
    roleGov: "🏛️ सरकारी अधिकारी",
    roleUniv: "🎓 विश्वविद्यालय व IIC",
    roleCsr: "🏢 उद्योग व CSR जोहार",
    roleAdmin: "🛡️ प्रशासन व कमांड सेंटर (🔒 गुप्त लॉग इन)",

    // Citizen Dashboard
    citGreeting: "जोहार, राउर स्वागत हे 👋",
    citSub: "नागरिक दुआर • आपन समस्या संख्या दर्ज कर स्थिति देखा",
    myReports: "कुल ट्रैक भेल समस्या",
    inProgress: "काम चालू हे",
    resolved: "समाधान भेल",
    pending: "बांकी हे",
    recentReports: "हाल के ट्रैक समस्या सभ",
    filterAll: "सभे",
    step1: "दर्ज भेल",
    step2: "AI जाँच",
    step3: "जाँच पड़ताल",
    step4: "सही विभाग",
    step5: "समाधान भेल",
    step6: "प्रभाव देखा",
    assignedDeptLabel: "नोडल विभाग:",
    priorityLabel: "प्राथमिकता",

    // Gov Dashboard
    govTitle: "सरकारी डैशबोर्ड (विभाग)",
    govSub: "आपन विभाग के समस्या सभ के निगरानी करा",
    govSla: "विभागीय निस्तारण दर: 94.2%",
    totalIssues: "कुल समस्या सभ",
    highPriority: "उच्च प्राथमिकता (अहम्)",
    completed: "समाधान पूरा भेल",
    liveMapTitle: "लाइव क्षेत्रीय समस्या नक्शा",
    mainCatTitle: "मुख्य श्रेणी सभ",
    highPriorityQueueTitle: "अहम् समस्या कार्रवाई सूची",
    actionBtn: "कार्रवाई मंजूर करा",
    viewAiReasoning: "AI रूट कारण देखा",

    // Sidebar Items
    navOverview: "अवलोकन",
    navMyIssues: "मोर समस्या सभ",
    navHighPriority: "उच्च प्राथमिकता (अहम्)",
    navMap: "लाइव नक्शा",
    navAi: "AI विश्लेषण",
    navRouting: "स्मार्ट रूटिंग इंजन",
    navCollab: "विभाग सहयोग",
    navReports: "रिपोर्ट देखा",
    navImpact: "प्रभाव स्कोर",
    navStakeholders: "हितधारक सूची",
    navEscalation: "एस्केलेशन इंजन",
    navSettings: "सेटिंग्स",

    // University Dashboard
    univTitle: "विश्वविद्यालय व IIC डैशबोर्ड",
    univSub: "सच्चा लोक समस्या के नवाचार प्रोजेक्ट में बदला",
    newChallenges: "नवा चुनौतियाँ",
    activeProjects: "चालू प्रोजेक्ट",
    proposedSolutions: "प्रस्तावित समाधान",
    completedProjects: "पूरा भेल प्रोजेक्ट",
    challengesTitle: "जनता से आल नवा चुनौतियाँ",
    myProjectsTitle: "मोर चालू नवाचार प्रोजेक्ट",
    proposeBtn: "समाधान पेश करा",

    // CSR Dashboard
    csrTitle: "उद्योग व CSR डैशबोर्ड",
    csrSub: "सामाजिक समस्या के समाधान में मदद करा",
    totalOpps: "कुल अवसर",
    activeFunding: "चालू फंडिंग",
    impactProjects: "प्रभाव प्रोजेक्ट",
    resourceContrib: "संसाधन मदद",
    coopsTitle: "CSR सहयोग के अवसर",
    myCsrProjectsTitle: "मोर चालू CSR प्रोजेक्ट",
    coFundBtn: "मदद करा (Co-Fund)",

    // Admin Command Center
    adminTitle: "प्रशासन व कमांड सेंटर",
    adminSub: "पूरा SANKALP ecosystem के निगरानी",
    aiAnalyzed: "AI विश्लेषित",
    verified: "जाँच भेल",
    smartRoutingTitle: "3. SMART ROUTING ENGINE (AI स्मार्ट रूटिंग)",
    whyAiChoseBtn: "AI ई रूट काहे चुनलक?",

    // Admin Auth
    adminAuthTitle: "कमांड सेंटर गुप्त लॉग इन",
    adminAuthSub: "ई जगह केवल अधिकृत प्रशासनिक अधिकारी ले आरक्षित हे",
    usernameLabel: "अधिकारी आईडी",
    passwordLabel: "पासवर्ड",
    loginBtn: "कमांड सेंटर में प्रवेश करा",
    logoutBtn: "लॉग आउट",

    // Modals
    modalNewIssueTitle: "समस्या स्थिति ट्रैकिंग",
    cancelBtn: "रद्द करा",
    closeBtn: "बंद करा",
  }
};

export const EcosystemProvider = ({ children }) => {
  const [issues, setIssues] = useState(initialIssues);
  const [universityProjects, setUniversityProjects] = useState(initialUniversityProjects);
  const [csrOpportunities, setCsrOpportunities] = useState(initialCsrOpportunities);
  const [ecosystemStats, setEcosystemStats] = useState(initialStats);
  const [currentRole, setCurrentRole] = useState('landing');
  const [language, setLanguage] = useState('hi'); // 'hi' | 'en' | 'khr'
  const [selectedIssueForRouting, setSelectedIssueForRouting] = useState(initialIssues[0]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "नई जल आपूर्ति शिकायत SNK-2026-0021 दर्ज हुई", time: "अभी", type: "new" },
    { id: 2, text: "AI स्मार्ट रूटिंग ने राजस्थान PHED को 96% मैच किया", time: "2 मिनट पहले", type: "ai" },
    { id: 3, text: "Havells CSR द्वारा ₹4.0 लाख का योगदान प्राप्त हुआ", time: "10 मिनट पहले", type: "csr" }
  ]);

  useEffect(() => {
    let active = true;
    async function hydrateFromBackend() {
      try {
        const [apiIssues, apiProjects, apiCsr, apiNotifs, apiStats] = await Promise.all([
          sankalpApi.getIssues(),
          sankalpApi.getUniversityProjects(),
          sankalpApi.getCsrOpportunities(),
          sankalpApi.getNotifications(),
          sankalpApi.getStats(),
        ]);
        if (!active) return;
        if (Array.isArray(apiIssues) && apiIssues.length > 0) {
          setIssues(apiIssues);
          setSelectedIssueForRouting(apiIssues[0]);
        }
        if (Array.isArray(apiProjects) && apiProjects.length > 0) {
          setUniversityProjects(apiProjects);
        }
        if (Array.isArray(apiCsr) && apiCsr.length > 0) {
          setCsrOpportunities(apiCsr);
        }
        if (Array.isArray(apiNotifs) && apiNotifs.length > 0) {
          setNotifications(apiNotifs);
        }
        if (apiStats) {
          setEcosystemStats(apiStats);
        }
      } catch {
        // Fallback silently to seeded mockData when backend is offline
      }
    }
    hydrateFromBackend();
    return () => {
      active = false;
    };
  }, []);

  const t = (key) => {
    return translations[language]?.[key] || translations.hi[key] || key;
  };

  // Admin authentication check (backend JWT first, local fallback)
  const adminLogin = async (username, password) => {
    try {
      const res = await sankalpApi.adminLogin(username, password);
      if (res?.authenticated) {
        setAdminToken(res.accessToken);
        setIsAdminAuthenticated(true);
        return true;
      }
    } catch {
      if ((username === 'admin@sankalp.gov.in' || username === 'ADMIN2026' || username === 'admin') &&
          (password === 'sankalp2026' || password === 'admin123' || password === 'admin')) {
        setIsAdminAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const adminLogout = () => {
    setAdminToken(null);
    setIsAdminAuthenticated(false);
  };

  // Search/Track issue function
  const searchIssue = (idOrKeyword) => {
    if (!idOrKeyword) return null;
    const cleanId = idOrKeyword.trim().toLowerCase();
    return issues.find(i => 
      i.id.toLowerCase() === cleanId || 
      i.title.toLowerCase().includes(cleanId) ||
      i.location.toLowerCase().includes(cleanId)
    );
  };

  const deptByCategory = {
    'जल आपूर्ति': 'जल स्वास्थ्य एवं अभियांत्रिकी विभाग (PHED)',
    'सड़क एवं आधारभूत संरचना': 'लोक निर्माण विभाग (PWD)',
    'कचरा प्रबंधन': 'नगर निगम स्वास्थ्य शाखा',
    'स्ट्रीट लाइट': 'नगर निगम विद्युत शाखा',
    'स्वास्थ्य': 'स्वास्थ्य विभाग',
    'बिजली': 'राजस्थान विद्युत वितरण निगम',
  };

  const addNewIssue = async (formData) => {
    try {
      const created = await sankalpApi.submitComplaintWebhook(formData);
      setIssues(prev => [created, ...prev]);
      setSelectedIssueForRouting(created);
      const apiNotifs = await sankalpApi.getNotifications().catch(() => null);
      if (Array.isArray(apiNotifs)) {
        setNotifications(apiNotifs);
      } else {
        setNotifications(prev => [
          { id: Date.now(), text: `नई शिकायत ${created.id} दर्ज हुई`, time: 'अभी', type: 'new' },
          ...prev
        ]);
      }
      return created;
    } catch {
      const seq = String(Math.max(21, issues.length + 21)).padStart(4, '0');
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const confidence = formData.aiConfidence ?? 91;

      const issue = {
        id: `SNK-2026-${seq}`,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        priority: formData.priority || 'मध्यम',
        description: formData.description,
        citizenName: formData.citizenName || 'नागरिक',
        citizenPhone: formData.citizenPhone || '',
        date: dateStr,
        status: 'दर्ज',
        statusKey: 'filed',
        aiConfidence: confidence,
        assignedDept: deptByCategory[formData.category] || 'नगर निगम',
        affectedPeople: formData.affectedPeople || '',
        immediateDanger: formData.immediateDanger || '',
        damageDescription: formData.damageDescription || '',
        duration: formData.duration || '',
        impactLevel: formData.impactLevel || '',
        photoEvidence: formData.photoEvidence ?? null,
        videoEvidence: formData.videoEvidence ?? null,
        evidenceChoice: formData.evidenceChoice || '',
        language: formData.language || language,
        voiceAnswer: formData.voiceAnswer || {},
        timeline: [
          { step: 'दर्ज', date: `${dateStr} ${timeStr}`, completed: true, desc: 'नागरिक द्वारा समस्या दर्ज की गई' },
          { step: 'AI विश्लेषण', date: `${dateStr} ${timeStr}`, completed: true, desc: `AI प्रारंभिक मूल्यांकन (${confidence}%)` },
          { step: 'सत्यापन', date: 'लंबित', completed: false, current: true, desc: 'विभागीय सत्यापन लंबित' },
          { step: 'सही संस्था', date: 'लंबित', completed: false, desc: 'स्मार्ट रूटिंग लंबित' },
          { step: 'समाधान', date: 'लंबित', completed: false, desc: 'समाधान कार्य लंबित' },
          { step: 'प्रभाव', date: 'लंबित', completed: false, desc: 'प्रभाव मूल्यांकन लंबित' }
        ]
      };

      setIssues(prev => [issue, ...prev]);
      setNotifications(prev => [
        { id: Date.now(), text: `नई शिकायत ${issue.id} दर्ज हुई`, time: 'अभी', type: 'new' },
        ...prev
      ]);
      return issue;
    }
  };

  const proposeUniversitySolution = async (challengeId, projectTitle, studentTeam = 'IIC Student Innovation Team', methodology = '') => {
    try {
      const created = await sankalpApi.submitUniversityProposal({
        challengeId,
        projectTitle,
        studentTeam,
        methodology,
      });
      setUniversityProjects(prev => [created, ...prev]);
      return created;
    } catch {
      const fallback = {
        id: `UNIV-PRJ-${Date.now().toString().slice(-4)}`,
        title: projectTitle,
        category: 'नवाचार',
        university: 'MNIT Jaipur (IIC Cell)',
        problemRef: challengeId,
        location: 'जयपुर',
        progress: 15,
        status: 'प्रस्ताव स्वीकृत',
        leadStudent: studentTeam,
        mentor: 'प्रो. नोडल मेंटर',
        fundingStatus: 'प्रस्तावित ₹2.0 लाख',
        description: methodology || 'प्रोटोटाइप विकास जारी।',
      };
      setUniversityProjects(prev => [fallback, ...prev]);
      return fallback;
    }
  };

  const pledgeCsrFund = async (opportunityId, partnerName, amountInr) => {
    try {
      const res = await sankalpApi.submitCsrPledge({
        opportunityId,
        partnerName,
        amountInr: Number(amountInr),
      });
      if (res?.opportunity) {
        setCsrOpportunities(prev => prev.map(o => (o.id === opportunityId ? res.opportunity : o)));
      }
      return res;
    } catch {
      return null;
    }
  };

  const advanceIssueAction = async (issueId, stage = 'in_progress', remarks = 'विभाग द्वारा कार्रवाई स्वीकृत की गई।') => {
    try {
      const updated = await sankalpApi.advanceIssueAction(issueId, { stage, remarks });
      setIssues(prev => prev.map(i => (i.id === issueId ? updated : i)));
      return updated;
    } catch {
      return null;
    }
  };

  return (
    <EcosystemContext.Provider value={{
      issues,
      universityProjects,
      csrOpportunities,
      ecosystemStats,
      currentRole,
      setCurrentRole,
      language,
      setLanguage,
      t,
      selectedIssueForRouting,
      setSelectedIssueForRouting,
      notifications,
      isAdminAuthenticated,
      adminToken,
      adminLogin,
      adminLogout,
      searchIssue,
      addNewIssue,
      proposeUniversitySolution,
      pledgeCsrFund,
      advanceIssueAction
    }}>
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => useContext(EcosystemContext);
