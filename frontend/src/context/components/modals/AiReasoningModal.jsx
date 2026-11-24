import React from 'react';
import { X, Bot, CheckCircle2, Cpu, MapPin, Wrench, Wallet, History, Sparkles } from 'lucide-react';

export const AiReasoningModal = ({ issue, isOpen, onClose }) => {
  if (!isOpen || !issue) return null;

  const reasoningFactors = [
    {
      title: "1. डोमेन मिलान (Domain & Function Match)",
      icon: Cpu,
      score: `${issue.aiConfidence || 96}% Match`,
      color: "bg-blue-50 text-blue-800 border-blue-200",
      desc: `समस्या की श्रेणी '${issue.category}' का सीधा संबंध नोडल एजेंसी '${issue.assignedDept}' के आधिकारिक जनादेश से है।`
    },
    {
      title: "2. भौगोलिक निकटता (Geographic Proximity)",
      icon: MapPin,
      score: "2.3 KM Proximity",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      desc: `स्थान '${issue.location}' नोडल वृत्त कार्यालय एवं संबंधित फील्ड टीम बीट के 3 किलोमीटर के दायरे में स्थित है।`
    },
    {
      title: "3. आवश्यक तकनीकी क्षमता (Technical Capability Required)",
      icon: Wrench,
      score: "High Capability",
      color: "bg-purple-50 text-purple-800 border-purple-200",
      desc: "एआई ने टेक्स्ट एवं इमेज विश्लेषण से भारी लीकेज/उपकरण मरम्मत तकनीक की आवश्यकता को पहचाना, जो इसी विभाग के पास उपलब्ध है।"
    },
    {
      title: "4. उपलब्ध संसाधन एवं CSR निधि (Resources & Funding)",
      icon: Wallet,
      score: "Budget Allocated",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      desc: "संबंधित श्रेणी हेतु टाटा ट्रस्ट व स्थानीय निकाय के संयुक्त सीएसआर सोशल इम्पैक्ट फंड में संसाधन स्वीकृत हैं।"
    },
    {
      title: "5. समान पूर्व परियोजनाएँ (Similar Previous Projects & Success)",
      icon: History,
      score: "94% Historical Success",
      color: "bg-teal-50 text-teal-800 border-teal-200",
      desc: "इस वार्ड में पिछले वर्ष निष्पादित 7 समान जल समस्याओं में इसी विभाग एवं विश्वविद्यालय आईआईसी टीम का निस्तारण समय न्यूनतम (48 घंटे) रहा।"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between border-b-4 border-amber-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-amber-300 shadow">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>AI ने यह रूट क्यों चुना? (AI Routing Explainability)</span>
                <span className="text-[10px] bg-amber-400 text-gov-navy font-bold px-2 py-0.5 rounded">94.6% Conf</span>
              </h3>
              <p className="text-xs text-slate-300">शिकायत आईडी: {issue.id} • {issue.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-slate-500 block text-[10px]">चयनित प्राथमिक नोडल विभाग:</span>
              <span className="font-bold text-sm text-gov-navy">{issue.assignedDept}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">AI सार्थकता गुणांक:</span>
              <span className="font-extrabold text-emerald-700 text-base">{issue.aiConfidence}% Match</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              एआई निर्णय प्रक्रिया के 5 प्रमुख कारण (Reasoning Drivers):
            </h4>

            {reasoningFactors.map((factor, i) => {
              const Icon = factor.icon;
              return (
                <div key={i} className={`p-3 rounded-lg border ${factor.color} space-y-1`}>
                  <div className="flex justify-between items-center font-bold">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Icon className="w-4 h-4 text-gov-navy" />
                      <span>{factor.title}</span>
                    </div>
                    <span className="text-[10px] font-extrabold bg-white px-2 py-0.5 rounded border border-slate-300 shadow-sm">
                      {factor.score}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px] pl-6">
                    {factor.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Matched Stakeholders Breakdown Matrix */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-800 text-xs mb-2">अनुशंसित हितधारक मैपिंग (Recommended Stakeholders Matrix):</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-800 font-bold block">🏛️ सरकारी विभाग</span>
                <span className="text-xs font-bold text-emerald-950 block mt-0.5">{issue.matchedStakeholders?.government?.name || 'PHED Dept'}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Match: {issue.matchedStakeholders?.government?.match || 96}%</span>
              </div>

              <div className="bg-purple-50 p-2.5 rounded border border-purple-200 text-center">
                <span className="text-[10px] text-purple-800 font-bold block">🎓 विश्वविद्यालय / IIC</span>
                <span className="text-xs font-bold text-purple-950 block mt-0.5">{issue.matchedStakeholders?.university?.name || 'MNIT Jaipur'}</span>
                <span className="text-[10px] text-purple-700 font-semibold">Match: {issue.matchedStakeholders?.university?.match || 89}%</span>
              </div>

              <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-center">
                <span className="text-[10px] text-amber-800 font-bold block">🏢 उद्योग / CSR</span>
                <span className="text-xs font-bold text-amber-950 block mt-0.5">{issue.matchedStakeholders?.csr?.name || 'TATA CSR'}</span>
                <span className="text-[10px] text-amber-700 font-semibold">Match: {issue.matchedStakeholders?.csr?.match || 82}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded"
          >
            समझ में आया (Close Panel)
          </button>
        </div>

      </div>
    </div>
  );
};
