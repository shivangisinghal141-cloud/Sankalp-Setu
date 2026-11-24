import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { ProblemMap } from '../components/common/ProblemMap';
import { AiReasoningModal } from '../components/modals/AiReasoningModal';
import { SankalpConnect } from '../components/common/SankalpConnect';
import { 
  Building2, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Map, 
  Bot, 
  GitFork, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Shield,
  Send,
  Info
} from 'lucide-react';

export const GovernmentDashboard = () => {
  const { issues, advanceIssueAction, t } = useEcosystem();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssueForModal, setSelectedIssueForModal] = useState(null);

  const sidebarNav = [
    { id: 'overview', label: t('navOverview'), icon: BarChart3 },
    { id: 'my_issues', label: t('navMyIssues'), icon: Building2 },
    { id: 'high_priority', label: t('navHighPriority'), icon: AlertTriangle },
    { id: 'map', label: t('navMap'), icon: Map },
    { id: 'ai', label: t('navAi'), icon: Bot },
    { id: 'routing', label: t('navRouting'), icon: GitFork },
    { id: 'collab', label: t('navCollab'), icon: Users },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
    { id: 'impact', label: t('navImpact'), icon: TrendingUp },
  ];

  const categoryBreakdown = [
    { label: "पानी आपूर्ति (Water Supply)", value: 4120, pct: "32%", color: "bg-blue-600" },
    { label: "सड़क व आधारभूत संरचना (Roads & Infra)", value: 3450, pct: "27%", color: "bg-amber-600" },
    { label: "कचरा प्रबंधन (Solid Waste)", value: 2410, pct: "19%", color: "bg-emerald-600" },
    { label: "स्ट्रीट लाइट (Street Lights)", value: 1620, pct: "12%", color: "bg-yellow-500" },
    { label: "स्वास्थ्य व स्वच्छता (Health & Sanitation)", value: 850, pct: "7%", color: "bg-purple-600" },
    { label: "अन्य (Others)", value: 392, pct: "3%", color: "bg-slate-500" },
  ];

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row">
        
        {/* Government Sidebar */}
        <aside className="w-full lg:w-64 bg-gov-navy text-slate-200 border-r border-slate-700 shrink-0">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-white text-sm">{t('govTitle')}</h2>
              <span className="text-[10px] text-emerald-400 font-semibold">राजस्थान नगर निकाय नोडल नोड</span>
            </div>
          </div>

          <nav className="p-2 space-y-1 text-xs">
            {sidebarNav.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded font-semibold text-left transition-colors ${
                    activeTab === item.id 
                      ? 'bg-emerald-700 text-white shadow font-bold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 space-y-6">
          
          {/* Header Title */}
          <div className="bg-white rounded-xl border border-slate-300 p-6 gov-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <h1 className="text-2xl font-bold text-gov-navy">{t('govTitle')}</h1>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {t('govSub')}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>{t('govSla')}</span>
            </div>
          </div>

          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow border-l-4 border-l-gov-navy">
              <span className="text-xs text-slate-500 font-bold block">{t('totalIssues')}</span>
              <span className="text-3xl font-black text-gov-navy">12,842</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow border-l-4 border-l-red-600">
              <span className="text-xs text-slate-500 font-bold block">{t('highPriority')}</span>
              <span className="text-3xl font-black text-red-600">1,286</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow border-l-4 border-l-amber-500">
              <span className="text-xs text-slate-500 font-bold block">{t('inProgress')}</span>
              <span className="text-3xl font-black text-amber-600">3,276</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow border-l-4 border-l-emerald-600">
              <span className="text-xs text-slate-500 font-bold block">{t('completed')}</span>
              <span className="text-3xl font-black text-emerald-600">5,132</span>
            </div>
          </div>

          <SankalpConnect compact />

          <div>
            <h3 className="text-base font-bold text-gov-navy mb-2">{t('liveMapTitle')}</h3>
            <ProblemMap height="h-[420px]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow space-y-4">
              <h3 className="font-bold text-gov-navy text-sm uppercase tracking-wider border-b border-slate-200 pb-2">
                {t('mainCatTitle')}
              </h3>

              <div className="space-y-3">
                {categoryBreakdown.map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.label}</span>
                      <span className="font-bold">{cat.value.toLocaleString()} ({cat.pct})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div className={`${cat.color} h-2 rounded-full`} style={{ width: cat.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-300 p-5 gov-shadow space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-bold text-gov-navy text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{t('highPriorityQueueTitle')}</span>
                </h3>
              </div>

              <div className="space-y-3">
                {issues.map(issue => (
                  <div key={issue.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-2 text-xs">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                          {issue.id}
                        </span>
                        <h4 className="font-bold text-sm text-gov-navy mt-1">{issue.title}</h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-300">
                        🔴 AI Conf: {issue.aiConfidence}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                      <div>📍 {issue.location}</div>
                      <div>🏷️ {issue.category}</div>
                      <div>🏛️ {issue.assignedDept}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-amber-800">
                        {issue.status}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedIssueForModal(issue)}
                          className="bg-white hover:bg-slate-100 text-gov-navy border border-slate-300 font-bold px-3 py-1.5 rounded flex items-center gap-1 text-[11px]"
                        >
                          <Info className="w-3.5 h-3.5 text-amber-500" />
                          <span>{t('viewAiReasoning')}</span>
                        </button>
                        <button
                          onClick={async () => {
                            await advanceIssueAction(issue.id, 'in_progress', 'विभागीय फील्ड दल द्वारा कार्रवाई प्रारंभ');
                            alert(`विभाग द्वारा शिकायत ${issue.id} पर कार्रवाई स्वीकृत की गई।`);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-[11px] shadow flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{t('actionBtn')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>

      <AiReasoningModal 
        issue={selectedIssueForModal} 
        isOpen={!!selectedIssueForModal} 
        onClose={() => setSelectedIssueForModal(null)} 
      />
    </div>
  );
};
