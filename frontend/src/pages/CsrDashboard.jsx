import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { CsrFundModal } from '../components/modals/CsrFundModal';
import { SankalpConnect } from '../components/common/SankalpConnect';
import { 
  Briefcase, 
  HeartHandshake, 
  ShieldCheck,
} from 'lucide-react';

export const CsrDashboard = () => {
  const { csrOpportunities, t } = useEcosystem();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const activeProjects = [
    {
      title: "ग्रामीण जल शोधन एवं हैंडपंप संवर्धन",
      partner: "TATA CSR & PHED",
      contribution: "₹24,00,000",
      progress: 85,
      impact: "25 गाँवों में स्वच्छ पानी"
    },
    {
      title: "जयपुर शहरी प्लास्टिक वेस्ट रीसाइक्लिंग प्लांट",
      partner: "Havells CSR Foundation",
      contribution: "₹18,50,000",
      progress: 60,
      impact: "5 टन रीसाइक्लिंग"
    }
  ];

  return (
    <div className="bg-amber-950/5 min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <div className="bg-white rounded-xl border border-amber-200 p-6 gov-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-600">
          <div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-7 h-7 text-amber-700" />
              <h1 className="text-2xl font-bold text-slate-900">{t('csrTitle')}</h1>
            </div>
            <p className="text-xs text-amber-900 font-medium mt-1">
              {t('csrSub')}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-300 text-amber-950 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>MCA CSR 80G Compliant</span>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-amber-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('totalOpps')}</span>
            <span className="text-3xl font-black text-amber-700">86</span>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('activeFunding')}</span>
            <span className="text-3xl font-black text-blue-700">12</span>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('impactProjects')}</span>
            <span className="text-3xl font-black text-emerald-600">24</span>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('resourceContrib')}</span>
            <span className="text-3xl font-black text-gov-navy">₹4.8 Cr</span>
          </div>
        </div>

        <SankalpConnect compact />

        {/* Collaboration Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-600" />
              <span>{t('coopsTitle')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {csrOpportunities.map(opp => (
              <div key={opp.id} className="bg-white rounded-xl border border-amber-200 p-5 gov-shadow hover:border-amber-500 transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {opp.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      {opp.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{opp.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{opp.description}</p>

                  <div className="mt-3 p-2.5 bg-amber-50/50 rounded border border-amber-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">आवश्यक:</span>
                      <span className="font-bold text-slate-900">{opp.targetResource}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOpportunity(opp)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded shadow transition-colors flex items-center justify-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t('coFundBtn')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Active CSR Projects */}
        <div className="bg-white rounded-xl border border-amber-200 p-6 gov-shadow space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-amber-200 pb-2">
            {t('myCsrProjectsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((prj, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-gov-navy">{prj.title}</h4>
                    <span className="text-[11px] text-amber-800 font-semibold">{prj.partner}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {prj.contribution}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${prj.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <CsrFundModal 
        opportunity={selectedOpportunity}
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
};
