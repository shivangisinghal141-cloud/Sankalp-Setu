import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { ChallengeActionModal } from '../components/modals/ChallengeActionModal';
import { SankalpConnect } from '../components/common/SankalpConnect';
import { 
  GraduationCap, 
  Lightbulb, 
  Award, 
  Sparkles,
} from 'lucide-react';

export const UniversityDashboard = () => {
  const { universityProjects, t } = useEcosystem();
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const challenges = [
    {
      id: "CHAL-2026-01",
      title: "जल प्रबंधन व पाइपलाइन लीकेज स्मार्ट निगरानी",
      category: "जल प्रबंधन",
      location: "📍 वार्ड 26, वैशाली, जयपुर",
      priority: "🔴 उच्च",
      reports: "12 नागरिक रिपोर्ट",
      description: "पेयजल की बर्बादी रोकने हेतु कम लागत वाले आईओटी प्रेशर एवं फ्लो सेंसर ग्रिड का विकास।"
    },
    {
      id: "CHAL-2026-02",
      title: "एआई आधारित कचरा वर्गीकरण व डंपिंग अलर्ट",
      category: "कचरा प्रबंधन",
      location: "📍 वार्ड 14, मानसरोवर, जयपुर",
      priority: "🟠 मध्यम",
      reports: "8 नागरिक रिपोर्ट",
      description: "स्मार्ट डस्टबिन में कैमरा विज़न सेंसर द्वारा सूखा व गीला कचरा ऑटोमैटिक पृथक्कीकरण।"
    },
    {
      id: "CHAL-2026-03",
      title: "सोलर मेश स्ट्रीट लाइट व सुरक्षा सेंसर",
      category: "स्ट्रीट लाइट",
      location: "📍 वार्ड 12, सांगानेर, जयपुर",
      priority: "🔴 उच्च",
      reports: "15 नागरिक रिपोर्ट",
      description: "स्वचालित सौर संचालित एलईडी ग्रिड जो मोशन डिटेक्शन एवं सुरक्षा अलर्ट सपोर्ट करता है।"
    }
  ];

  return (
    <div className="bg-purple-950/5 min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <div className="bg-white rounded-xl border border-purple-200 p-6 gov-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-purple-600">
          <div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-7 h-7 text-purple-700" />
              <h1 className="text-2xl font-bold text-slate-900">{t('univTitle')}</h1>
            </div>
            <p className="text-xs text-purple-900 font-medium mt-1">
              {t('univSub')}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 text-purple-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span>IIC Ranking: 5-Star National Innovation Hub</span>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-purple-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('newChallenges')}</span>
            <span className="text-3xl font-black text-purple-700">42</span>
          </div>

          <div className="bg-white rounded-xl border border-purple-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('activeProjects')}</span>
            <span className="text-3xl font-black text-blue-700">18</span>
          </div>

          <div className="bg-white rounded-xl border border-purple-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('proposedSolutions')}</span>
            <span className="text-3xl font-black text-amber-600">37</span>
          </div>

          <div className="bg-white rounded-xl border border-purple-200 p-5 gov-shadow">
            <span className="text-xs text-slate-500 font-bold block">{t('completedProjects')}</span>
            <span className="text-3xl font-black text-emerald-600">27</span>
          </div>
        </div>

        <SankalpConnect compact />

        {/* Challenges Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>{t('challengesTitle')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map(chal => (
              <div key={chal.id} className="bg-white rounded-xl border border-purple-200 p-5 gov-shadow hover:border-purple-500 transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {chal.category}
                    </span>
                    <span className="text-[10px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {chal.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{chal.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{chal.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                    <span>{chal.location}</span>
                    <span className="font-bold text-slate-700">{chal.reports}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChallenge(chal)}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2 rounded shadow transition-colors flex items-center justify-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('proposeBtn')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects Section */}
        <div className="bg-white rounded-xl border border-purple-200 p-6 gov-shadow space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-purple-200 pb-2">
            {t('myProjectsTitle')}
          </h2>

          <div className="space-y-4">
            {universityProjects.map(prj => (
              <div key={prj.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded mr-2">
                      {prj.university}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{prj.title}</span>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded border border-purple-200">
                    {prj.progress}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-300">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${prj.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>लीड छात्र: <strong>{prj.leadStudent}</strong></span>
                  <span>स्थिति: <strong>{prj.status}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ChallengeActionModal 
        challenge={selectedChallenge}
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
      />
    </div>
  );
};
