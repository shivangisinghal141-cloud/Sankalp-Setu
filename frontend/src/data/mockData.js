export const initialIssues = [
  {
    id: "SNK-2026-0012",
    title: "जल आपूर्ति समस्या एवं पाइपलाइन रिसाव",
    titleEn: "Water Supply Disruption & Pipeline Leakage",
    category: "जल आपूर्ति",
    categoryKey: "water",
    location: "वार्ड 26, वैशाली, जयपुर",
    locationEn: "Ward 26, Vaishali Nagar, Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    date: "2026-09-02",
    status: "प्रगति पर",
    statusKey: "in_progress",
    priority: "उच्च",
    priorityKey: "high",
    citizenName: "रमेश कुमार शर्मा",
    citizenPhone: "98765*****",
    description: "पिछले 4 दिनों से पेयजल आपूर्ति बाधित है तथा मुख्य पाइपलाइन में भारी रिसाव हो रहा है जिससे सड़कों पर जल भराव हो गया है।",
    aiConfidence: 96,
    duplicateCount: 7,
    assignedDept: "जल स्वास्थ्य एवं अभियांत्रिकी विभाग (PHED)",
    deptId: "gov-water",
    matchedStakeholders: {
      government: { name: "राजस्थान जल बोर्ड (PHED)", match: 96, status: "कार्य प्रगति पर" },
      university: { name: "MNIT Jaipur (IIC Cell)", match: 89, status: "Smart Monitoring Pilot Proposed" },
      csr: { name: "TATA Trust Clean Water CSR", match: 82, status: "Funding Approved ₹12L" }
    },
    aiRoutingReasoning: [
      "स्थानिक निकटता: पीएचईडी जयपुर वृत्त कार्यालय से 2.3 किमी की दूरी पर है।",
      "तकनीकी क्षमता: पीएचईडी के पास भारी रिसाव मरम्मत का विशेषज्ञ दल उपलब्ध है।",
      "एआई पैटर्न: इस क्षेत्र में पिछले 3 महीनों में 7 समान शिकायतें दर्ज की गई हैं।",
      "संसाधन संरेखण: टाटा ट्रस्ट द्वारा समर्थित पेयजल सीएसआर निधि उपलब्ध है।",
      "विश्वविद्यालय सहयोग: एमएनआईटी जयपुर ने आईआईसी के तहत जल सेंसर निगरानी का समाधान पेश किया है।"
    ],
    timeline: [
      { step: "दर्ज", date: "2026-09-02 09:15 AM", completed: true, desc: "नागरिक द्वारा समस्या दर्ज की गई" },
      { step: "AI विश्लेषण", date: "2026-09-02 09:16 AM", completed: true, desc: "AI द्वारा श्रेणी जल आपूर्ति (96% सटीकता) निर्धारित की गई" },
      { step: "सत्यापन", date: "2026-09-02 10:30 AM", completed: true, desc: "नोडल अधिकारी द्वारा सत्यापन पूर्ण" },
      { step: "सही संस्था", date: "2026-09-02 11:45 AM", completed: true, desc: "राजस्थान PHED व CSR पार्टनर को स्मार्ट रूट किया गया" },
      { step: "समाधान", date: "प्रगति पर", completed: false, current: true, desc: "पाइपलाइन मरम्मत कार्य जारी है" },
      { step: "प्रभाव", date: "लंबित", completed: false, desc: "सत्यापन उपरांत प्रभाव मूल्यांकन किया जाएगा" }
    ]
  },
  {
    id: "SNK-2026-0015",
    title: "स्मार्ट कचरा प्रबंधन व अवैध डंपिंग",
    titleEn: "Waste Accumulation & Illegal Dumping",
    category: "कचरा प्रबंधन",
    categoryKey: "waste",
    location: "वार्ड 14, मानसरोवर, जयपुर",
    locationEn: "Ward 14, Mansarovar, Jaipur",
    lat: 26.8524,
    lng: 75.7673,
    date: "2026-09-03",
    status: "सत्यापित",
    statusKey: "verified",
    priority: "मध्यम",
    priorityKey: "medium",
    citizenName: "सुनीता देवी",
    citizenPhone: "97654*****",
    description: "मुख्य बाज़ार के निकट कचरा पात्र ओवरफ्लो हो रहे हैं और दुर्गंध से आमजन परेशान हैं।",
    aiConfidence: 92,
    duplicateCount: 8,
    assignedDept: "नगर निगम स्वास्थ्य शाखा",
    deptId: "gov-waste",
    matchedStakeholders: {
      government: { name: "जयपुर नगर निगम (दक्षिण)", match: 94, status: "सत्यापित व असाइन" },
      university: { name: "Jaipur National Univ Waste Lab", match: 91, status: "AI Waste Sorting Challenge Accepted" },
      csr: { name: "EcoGreen India CSR", match: 85, status: "Recycling Unit Proposal ₹8.5L" }
    },
    aiRoutingReasoning: [
      "डोमेन मैच: नगर निगम ठोस अपशिष्ट प्रबंधन विभाग।",
      "आरएंडडी संरेखण: जेएनयू की पर्यावरण विज्ञान लैब कचरा प्रसंस्करण प्रोजेक्ट पर कार्यरत है।",
      "पर्यावरण प्रभाव: उच्च जनसंख्या घनत्व वाले व्यावसायिक क्षेत्र।"
    ],
    timeline: [
      { step: "दर्ज", date: "2026-09-03 08:30 AM", completed: true, desc: "मोबाइल ऐप द्वारा फोटो सहित रिपोर्ट की गई" },
      { step: "AI विश्लेषण", date: "2026-09-03 08:31 AM", completed: true, desc: "कचरा प्रबंधन श्रेणी स्वीकृत" },
      { step: "सत्यापन", date: "2026-09-03 10:00 AM", completed: true, desc: "स्वच्छता निरीक्षक द्वारा सत्यापन किया गया" },
      { step: "सही संस्था", date: "2026-09-03 10:15 AM", completed: true, desc: "नगर निगम वाहन दल को अलर्ट भेजा गया" },
      { step: "समाधान", date: "प्रक्रियाधीन", completed: false, current: true, desc: "सफाई वाहन रवाना" },
      { step: "प्रभाव", date: "लंबित", completed: false, desc: "" }
    ]
  },
  {
    id: "SNK-2026-0009",
    title: "स्ट्रीट लाइट खराबी एवं सुरक्षा जोखिम",
    titleEn: "Faulty Streetlights & Safety Hazard",
    category: "स्ट्रीट लाइट",
    categoryKey: "lights",
    location: "वार्ड 12, सांगानेर, जयपुर",
    locationEn: "Ward 12, Sanganer, Jaipur",
    lat: 26.8124,
    lng: 75.8073,
    date: "2026-09-01",
    status: "समाधान",
    statusKey: "resolved",
    priority: "उच्च",
    priorityKey: "high",
    citizenName: "अमित वर्मा",
    citizenPhone: "94140*****",
    description: "बस स्टैंड के पास पिछले 10 दिनों से 15 एलईडी लाइटें बंद पड़ी हैं, जिससे रात में दुर्घटना व सुरक्षा का खतरा है।",
    aiConfidence: 98,
    duplicateCount: 15,
    assignedDept: "नगर निगम विद्युत शाखा",
    deptId: "gov-power",
    matchedStakeholders: {
      government: { name: "जयपुर विकास प्राधिकरण (विद्युत)", match: 98, status: "लाइटें बदली गईं" },
      university: { name: "Poornima College IIC", match: 88, status: "Solar Sensor Installed" },
      csr: { name: "Havells India CSR", match: 95, status: "Provided 20 Solar Lights" }
    },
    aiRoutingReasoning: [
      "उच्च सुरक्षा संरेखण: रात्रि सुरक्षा संवेदनशील क्षेत्र।",
      "हेवेल्स सीएसआर द्वारा सोलर लाइट योगदान।",
      "त्वरित निस्तारण: 48 घंटे के भीतर मरम्मत निष्पादित।"
    ],
    timeline: [
      { step: "दर्ज", date: "2026-09-01 07:00 PM", completed: true, desc: "कॉलसेंटर IVR द्वारा दर्ज" },
      { step: "AI विश्लेषण", date: "2026-09-01 07:01 PM", completed: true, desc: "उच्च प्राथमिकता सुरक्षा श्रेणी" },
      { step: "सत्यापन", date: "2026-09-02 09:00 AM", completed: true, desc: "जेडीए इंजीनियर द्वारा सत्यापित" },
      { step: "सही संस्था", date: "2026-09-02 09:30 AM", completed: true, desc: "विद्युत ठेकेदार को आदेशित" },
      { step: "समाधान", date: "2026-09-03 04:00 PM", completed: true, desc: "15 लाइटें सफलतापूर्वक बदली गईं" },
      { step: "प्रभाव", date: "2026-09-03 06:00 PM", completed: true, desc: "नागरिक द्वारा 5-स्टार फीडबैक प्राप्त" }
    ]
  },
  {
    id: "SNK-2026-0021",
    title: "सड़क गड्ढे एवं दुर्घटना स्थल",
    titleEn: "Pothole Repair & Road Hazards",
    category: "सड़क एवं आधारभूत संरचना",
    categoryKey: "roads",
    location: "सी-स्क्रीम, अशोक नगर, जयपुर",
    locationEn: "C-Scheme, Ashok Nagar, Jaipur",
    lat: 26.9050,
    lng: 75.8000,
    date: "2026-09-04",
    status: "दर्ज",
    statusKey: "registered",
    priority: "उच्च",
    priorityKey: "high",
    citizenName: "डॉ. वी. के. गुप्ता",
    citizenPhone: "98290*****",
    description: "बारिश के कारण मुख्य चौराहे पर गहरा गड्ढा हो गया है, जहाँ प्रतिदिन दोपहिया वाहन गिर रहे हैं।",
    aiConfidence: 95,
    duplicateCount: 3,
    assignedDept: "सार्वजनिक निर्माण विभाग (PWD)",
    deptId: "gov-roads",
    matchedStakeholders: {
      government: { name: "राजस्थान लोक निर्माण विभाग (PWD)", match: 97, status: "समीक्षाधीन" },
      university: { name: "LNM Institute of IT (IIC)", match: 86, status: "Pothole Detection Camera Model" },
      csr: { name: "UltraTech Cement CSR", match: 90, status: "Rapid Repair Material Ready" }
    },
    aiRoutingReasoning: [
      "सार्वजनिक सुरक्षा जोखिम: भारी यातायात चौराहा।",
      "पीडब्ल्यूडी और अल्ट्राटेक सीएसआर त्वरित सामग्री आपूर्ति के लिए कनेक्टेड।"
    ],
    timeline: [
      { step: "दर्ज", date: "2026-09-04 07:30 AM", completed: true, desc: "नागरिक द्वारा दर्ज" },
      { step: "AI विश्लेषण", date: "2026-09-04 07:31 AM", completed: true, desc: "AI द्वारा सड़क मरम्मत श्रेणी चिन्हित" },
      { step: "सत्यापन", date: "लंबित", completed: false, current: true, desc: "नोडल अधिकारी आवंटन जारी" },
      { step: "सही संस्था", date: "लंबित", completed: false, desc: "" },
      { step: "समाधान", date: "लंबित", completed: false, desc: "" },
      { step: "प्रभाव", date: "लंबित", completed: false, desc: "" }
    ]
  }
];

export const initialUniversityProjects = [
  {
    id: "UNIV-PRJ-101",
    title: "Smart Water Leakage & Quality Monitoring Sensor",
    titleHi: "स्मार्ट जल रिसाव एवं गुणवत्ता निगरानी सेंसर",
    category: "जल प्रबंधन",
    university: "MNIT Jaipur (IIC Cell)",
    problemRef: "SNK-2026-0012",
    location: "वार्ड 26, वैशाली, जयपुर",
    progress: 60,
    status: "प्रोटोटाइप परीक्षण",
    leadStudent: "आयुष शर्मा (M.Tech IoT)",
    mentor: "डॉ. ए. के. चौधरी",
    fundingStatus: "CSR द्वारा ₹3.5 लाख स्वीकृत",
    description: "पाइपलाइन के प्रेशर ड्रॉप तथा लीकेज का रियल-टाइम अलर्ट देने हेतु लो-कॉस्ट आईओटी सेंसर डिवेलपमेंट।"
  },
  {
    id: "UNIV-PRJ-102",
    title: "AI Based Dry & Wet Waste Automatic Classifier",
    titleHi: "AI आधारित सूखा व गीला कचरा ऑटोमैटिक वर्गीकरण",
    category: "कचरा प्रबंधन",
    university: "Jaipur National University (IIC)",
    problemRef: "SNK-2026-0015",
    location: "वार्ड 14, मानसरोवर, जयपुर",
    progress: 25,
    status: "अनुसंधान एवं विकास",
    leadStudent: "नेहा अग्रवाल (B.Tech AI)",
    mentor: "प्रो. आर. एस. राठौड़",
    fundingStatus: "प्रस्तावित ₹2.0 लाख",
    description: "स्मार्ट डस्टबिन में कंप्यूटर विजन द्वारा कचरा पृथक्कीकरण प्रणाली।"
  },
  {
    id: "UNIV-PRJ-103",
    title: "Solar Smart Light Mesh with Security Motion Detector",
    titleHi: "सोलर स्मार्ट लाइट मेश व सुरक्षा मोशन डिटेक्टर",
    category: "स्ट्रीट लाइट",
    university: "Poornima Institute of Engineering",
    problemRef: "SNK-2026-0009",
    location: "सांगानेर, जयपुर",
    progress: 90,
    status: "सफलतापूर्वक स्थापित",
    leadStudent: "विक्रम मीणा",
    mentor: "डॉ. एस. के. सिंह",
    fundingStatus: "Havells CSR द्वारा ₹4.0 लाख पोषित",
    description: "स्वचालित सौर ऊर्जा संचालित स्मार्ट स्ट्रीट लाइट ग्रिड।"
  }
];

export const initialCsrOpportunities = [
  {
    id: "CSR-OPP-201",
    title: "ग्रामीण व शहरी जल प्रबंधन संवर्धन पहल",
    titleEn: "Rural & Urban Water Resource Enhancement Initiative",
    category: "जल प्रबंधन",
    targetResource: "₹12,00,000",
    raisedResource: "₹9,80,00,000",
    status: "सहयोग आवश्यक",
    statusKey: "needed",
    location: "जयपुर एवं आसपास के क्षेत्र",
    partner: "TATA Trusts & PHED Rajasthan",
    impactGoal: "50,000 नागरिकों को स्वच्छ पेयजल आपूर्ति सुनिश्चित करना",
    description: "नागरिक शिकायतों के त्वरित निस्तारण हेतु आधुनिक जल रिसाव मरम्मत उपकरण एवं स्मार्ट जल फिल्टर इकाइयाँ स्थापित करना।"
  },
  {
    id: "CSR-OPP-202",
    title: "प्लास्टिक वेस्ट रीसाइक्लिंग व स्मार्ट डस्टबिन यूनिट",
    titleEn: "Plastic Waste Recycling & Smart Dustbin Deployment",
    category: "कचरा प्रबंधन",
    targetResource: "₹8,50,000",
    raisedResource: "₹8,50,000",
    status: "समाधान उपलब्ध",
    statusKey: "fulfilled",
    location: "जयपुर नगर निगम क्षेत्र",
    partner: "EcoGreen India Foundation",
    impactGoal: "10 मीट्रिक टन प्लास्टिक कचरे का पुनर्चक्रण",
    description: "विश्वविद्यालयों द्वारा विकसित एआई वर्गीकरण मशीनों की विनिर्माण एवं स्थापना लागत।"
  },
  {
    id: "CSR-OPP-203",
    title: "सोलर स्ट्रीट लाइट व नागरिक सुरक्षा पहल",
    titleEn: "Solar Street Light Installation for Citizen Safety",
    category: "स्ट्रीट लाइट",
    targetResource: "₹15,00,000",
    raisedResource: "₹11,20,000",
    status: "समर्थन आवश्यक",
    statusKey: "needed",
    location: "सांगानेर व बाहरी वार्ड",
    partner: "Havells CSR Foundation",
    impactGoal: "100 कम रोशनी वाले चौराहों को जगमगाना",
    description: "अंधेरे क्षेत्रों में सोलर स्मार्ट लाइट स्थापित कर महिला व नागरिक सुरक्षा सुदृढ़ करना।"
  }
];

export const ecosystemStats = {
  totalIssues: 12842,
  highPriority: 1286,
  inProgress: 3276,
  resolved: 5132,
  aiAnalyzed: 12842,
  verified: 9245,
  aiConfidence: "94.6%",
  duplicatesDetected: 182,
  activeUniversityProjects: 18,
  proposedSolutions: 37,
  completedProjects: 27,
  csrOpportunities: 86,
  activeFunding: 12,
  impactProjects: 24,
  totalCsrContribution: "₹4.8 Cr"
};
