import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { ProblemMap } from '../components/common/ProblemMap';
import { AiReasoningModal } from '../components/modals/AiReasoningModal';
import { SankalpConnect } from '../components/common/SankalpConnect';
import { 
  ShieldCheck, 
  Bot, 
  GitFork, 
  Layers, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Settings, 
  ArrowRight,
  Sparkles,
  Lock,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    issues, 
    selectedIssueForRouting, 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout, 
    t 
  } = useEcosystem();

  const [activeTab, setActiveTab] = useState('routing');
  const [showAiModal, setShowAiModal] = useState(false);
  const [username, setUsername] = useState('admin@sankalp.gov.in');
  const [password, setPassword] = useState('sankalp2026');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const success = await adminLogin(username, password);
    if (!success) {
      setLoginError('अमान्य अधिकारी आईडी या सुरक्षा पासवर्ड। (Invalid Credentials)');
    }
  };

  const sidebarNav = [
    { id: 'overview', label: t('navOverview'), icon: BarChart3 },
    { id: 'ai', label: t('navAi'), icon: Bot },
    { id: 'issues', label: t('navMyIssues'), icon: Layers },
    { id: 'routing', label: t('navRouting'), icon: GitFork },
    { id: 'stakeholders', label: t('navStakeholders'), icon: Users },
    { id: 'collab', label: t('navCollab'), icon: Building2 },
    { id: 'escalation', label: t('navEscalation'), icon: AlertTriangle },
    { id: 'impact', label: t('navImpact'), icon: TrendingUp },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  const currentRoutingIssue = selectedIssueForRouting || issues[0];

  // ====================================================
  // AUTHENTICATION GUARD (If not logged in, show secure login)
  // ====================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-screen font-sans flex items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="bg-gov-navy px-6 py-5 text-center border-b border-slate-800 relative">
            <div className="w-14 h-14 bg-amber-500 text-gov-navy rounded-xl flex items-center justify-center font-extrabold text-2xl mx-auto mb-2 shadow-lg border-2 border-amber-300">
              🛡️
            </div>
            <h2 className="text-lg font-black text-white">{t('adminAuthTitle')}</h2>
            <p className="text-xs text-amber-300 mt-1 font-medium">{t('adminAuthSub')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Demo credentials hint box */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-amber-500/40 text-[11px] space-y-1 text-slate-300">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>परीक्षण हेतु क्रेडेंशियल्स (Demo Login Credentials):</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Officer ID:</span>
                <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono font-bold">admin@sankalp.gov.in</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono font-bold">sankalp2026</code>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-950/80 border border-red-500 text-red-200 p-2.5 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('usernameLabel')} *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@sankalp.gov.in"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('passwordLabel')} *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-gov-navy font-extrabold text-sm py-3 rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Key className="w-4 h-4" />
              <span>{t('loginBtn')}</span>
            </button>

            <div className="pt-2 text-center text-[10px] text-slate-400">
              राष्ट्रीय सूचना विज्ञान केंद्र (NIC) • 256-Bit SSL एन्क्रिप्टेड क्रेडेंशियल
            </div>
          </form>

        </div>
      </div>
    );
  }

  // ====================================================
  // AUTHENTICATED COMMAND CENTER DASHBOARD VIEW
  // ====================================================
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row">
        
        {/* Dark Navy Command Center Sidebar */}
        <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-gov-navy flex items-center justify-center font-bold text-base shadow">
                🛡️
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">{t('adminTitle')}</h2>
                <span className="text-[10px] text-amber-400 font-semibold">Verified Admin Access</span>
              </div>
            </div>

            <button 
              onClick={adminLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
              title="लॉग आउट करें"
            >
              <LogOut className="w-4 h-4" />
            </button>
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
                      ? 'bg-amber-500 text-gov-navy font-extrabold shadow' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Command Center Workspace */}
        <main className="flex-1 p-4 lg:p-8 space-y-6">
          
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-500">
            <div>
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <h1 className="text-2xl font-black text-white">{t('adminTitle')}</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t('adminSub')}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-slate-800 border border-slate-700 text-amber-300 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Engine: Active</span>
              </div>
              <button
                onClick={adminLogout}
                className="bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-200 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logoutBtn')}</span>
              </button>
            </div>
          </div>

          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow">
              <span className="text-xs text-slate-400 font-bold block">{t('totalIssues')}</span>
              <span className="text-3xl font-black text-white">12,842</span>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow">
              <span className="text-xs text-slate-400 font-bold block">{t('aiAnalyzed')}</span>
              <span className="text-3xl font-black text-cyan-400">12,842</span>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow">
              <span className="text-xs text-slate-400 font-bold block">{t('verified')}</span>
              <span className="text-3xl font-black text-amber-400">9,245</span>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow">
              <span className="text-xs text-slate-400 font-bold block">{t('completed')}</span>
              <span className="text-3xl font-black text-emerald-400">5,132</span>
            </div>
          </div>

          <SankalpConnect />

          {/* Smart Routing Engine */}
          <div className="bg-slate-900 rounded-xl border-2 border-indigo-500 p-6 shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <GitFork className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">
                    {t('smartRoutingTitle')}
                  </h2>
                </div>
              </div>

              <span className="text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 px-3 py-1.5 rounded">
                SIH Core Highlight
              </span>
            </div>

            <div className="overflow-x-auto py-2">
              <div className="min-w-[750px] flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-center">
                <div className="px-3 py-2 bg-blue-950 text-blue-300 border border-blue-800 rounded font-bold">CITIZEN PROBLEM</div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <div className="px-3 py-2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded font-bold">AI ANALYSIS</div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <div className="px-3 py-2 bg-amber-950 text-amber-300 border border-amber-800 rounded font-bold">VALIDATION</div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <div className="px-4 py-2 bg-indigo-600 text-white rounded font-extrabold shadow-lg animate-pulse">SMART ROUTING</div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <div className="px-3 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded font-bold">GOV | UNIV | CSR</div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <div className="px-3 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold">IMPACT</div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    "{currentRoutingIssue.title}"
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-amber-400 font-bold bg-amber-950 px-3 py-1 rounded border border-amber-800">
                    AI Confidence: {currentRoutingIssue.aiConfidence}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-emerald-500/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> 🏛️ Gov Dept Match: {currentRoutingIssue.matchedStakeholders?.government?.match || 96}%
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {currentRoutingIssue.matchedStakeholders?.government?.name || 'PHED'}
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-purple-500/40 space-y-2">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" /> 🎓 University Match: {currentRoutingIssue.matchedStakeholders?.university?.match || 89}%
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {currentRoutingIssue.matchedStakeholders?.university?.name || 'MNIT Jaipur'}
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-amber-500/40 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> 🏢 CSR Partner Match: {currentRoutingIssue.matchedStakeholders?.csr?.match || 82}%
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {currentRoutingIssue.matchedStakeholders?.csr?.name || 'TATA CSR'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowAiModal(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-gov-navy font-extrabold text-xs px-5 py-2.5 rounded shadow flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <Bot className="w-4 h-4" />
                  <span>{t('whyAiChoseBtn')}</span>
                </button>
              </div>

            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. LIVE PROBLEM MAP</h2>
            <ProblemMap height="h-[400px]" />
          </div>

        </main>
      </div>

      <AiReasoningModal 
        issue={currentRoutingIssue}
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};
