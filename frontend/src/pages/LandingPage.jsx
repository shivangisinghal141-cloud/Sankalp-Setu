import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcosystem } from '../context/EcosystemContext';
import { SankalpConnect } from '../components/common/SankalpConnect';
import { 
  Smartphone, 
  PhoneCall, 
  Building, 
  MapPin, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Check
} from 'lucide-react';

export const LandingPage = () => {
  const { setCurrentRole, issues, searchIssue, t } = useEcosystem();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('SNK-2026-0012');
  const [trackedIssue, setTrackedIssue] = useState(issues[0]);
  const [searchError, setSearchError] = useState(false);

  const handleRoleClick = (roleId, routePath) => {
    setCurrentRole(roleId);
    navigate(routePath);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchError(false);
    const result = searchIssue(searchId);
    if (result) {
      setTrackedIssue(result);
    } else {
      setSearchError(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-gov-navy via-slate-900 to-gov-navy text-white relative py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('govtTitle')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight font-serif">
            "{t('heroTitle')}"
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-medium">
            {t('heroSubtitle')} — {t('tagline')}
          </p>

          {/* ==================================================== */}
          {/* PRIMARY COMPLAINT TRACKING ENGINE */}
          {/* ==================================================== */}
          <div className="max-w-3xl mx-auto pt-2 bg-slate-900/90 p-5 rounded-2xl border-2 border-amber-400 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{t('trackTitle')}</span>
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
                🔌 API Webhook Connected
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={t('trackPlaceholder')}
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg text-slate-900 font-mono font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-gov-navy font-black text-sm px-7 py-3 rounded-lg shadow-xl shrink-0 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{t('trackBtn')}</span>
              </button>
            </form>

            {/* Quick Sample IDs */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <span className="text-slate-400">नमूना आईडी (Try Sample IDs):</span>
              {issues.slice(0, 4).map(iss => (
                <button
                  key={iss.id}
                  type="button"
                  onClick={() => {
                    setSearchId(iss.id);
                    setTrackedIssue(iss);
                    setSearchError(false);
                  }}
                  className={`px-2.5 py-0.5 rounded font-mono font-bold transition-colors ${
                    trackedIssue?.id === iss.id ? 'bg-amber-400 text-gov-navy' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {iss.id}
                </button>
              ))}
            </div>

            {/* Search Error Alert */}
            {searchError && (
              <div className="mt-3 bg-red-900/90 text-red-100 p-3 rounded-lg text-xs font-semibold border border-red-500">
                ❌ यह शिकायत आईडी नहीं मिली। कृपया SNK-2026-0012 या अपनी पंजीकृत आईडी जांचें।
              </div>
            )}

            {/* Tracked Result Drawer */}
            {trackedIssue && !searchError && (
              <div className="mt-4 bg-slate-950 p-5 rounded-xl border border-slate-700 text-left text-xs space-y-3 animate-in fade-in">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      ID: {trackedIssue.id}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">{trackedIssue.title}</h3>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded bg-amber-500 text-gov-navy">
                    {trackedIssue.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div>📍 <strong>स्थान:</strong> {trackedIssue.location}</div>
                  <div>🏷️ <strong>श्रेणी:</strong> {trackedIssue.category}</div>
                  <div>🏛️ <strong>नोडल विभाग:</strong> {trackedIssue.assignedDept}</div>
                </div>

                {/* 6-Stage Timeline Stepper */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    6-Stage Live Timeline Stepper:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 text-center">
                    {[t('step1'), t('step2'), t('step3'), t('step4'), t('step5'), t('step6')].map((st, i) => {
                      const item = trackedIssue.timeline[i] || {};
                      return (
                        <div key={i} className={`p-2 rounded border text-[10px] ${
                          item.completed ? 'bg-emerald-950 border-emerald-700 text-emerald-300 font-bold' : item.current ? 'bg-amber-950 border-amber-600 text-amber-300 font-black animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          <div>{st}</div>
                          <div className="text-[8px] text-slate-400">{item.date || ''}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ==================================================== */}

        </div>
      </section>

      {/* External Registration API Note Banner */}
      <section className="bg-amber-100 border-y border-amber-300 py-3 px-4 text-center text-xs font-semibold text-amber-950">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span><strong>बाहरी पंजीकरण कनेक्ट विवरण:</strong> शिकायत पंजीकरण आपकी मौजूदा फ्रंटएंड ऐप से `/api/v1/complaints/webhook` द्वारा लाइव कनेक्ट होगी।</span>
          </div>
          <span className="bg-amber-200 text-amber-900 px-2.5 py-1 rounded font-bold border border-amber-400">
            API Live Ready
          </span>
        </div>
      </section>

      {/* Access Channels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gov-navy uppercase tracking-wider">
            {t('accessTitle')}
          </h2>
          <p className="text-slate-600 text-xs mt-1">
            {t('accessSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl border border-slate-300 p-6 gov-shadow hover:border-gov-navy transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold mb-4 shadow">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('access1Title')}</h3>
              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                {t('access1Badge')}
              </span>

              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li>• {t('access1List1')}</li>
                <li>• {t('access1List2')}</li>
                <li>• {t('access1List3')}</li>
              </ul>
            </div>

            <button
              onClick={() => handleRoleClick('citizen', '/citizen/dashboard')}
              className="mt-6 w-full bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded shadow flex items-center justify-center gap-2 transition-colors"
            >
              <span>{t('access1Btn')}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 p-6 gov-shadow hover:border-emerald-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center font-bold mb-4 shadow">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('access2Title')}</h3>
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                {t('access2Badge')}
              </span>

              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="font-bold text-emerald-800 text-sm">📞 1800-185-2026 (Toll Free)</li>
                <li>• अपनी पसंदीदा भाषा चुनें</li>
                <li>• SMS द्वारा स्थिति प्राप्त करें</li>
              </ul>
            </div>

            <a
              href="tel:18001852026"
              className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded shadow flex items-center justify-center gap-2 transition-colors"
            >
              <span>{t('access2Btn')}</span>
            </a>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 p-6 gov-shadow hover:border-purple-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center font-bold mb-4 shadow">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('access3Title')}</h3>
              <span className="text-xs text-purple-800 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-200">
                {t('access3Badge')}
              </span>

              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li>• नजदीकी CSC / पंचायत केंद्र जाएँ</li>
                <li>• ग्राम ऑपरेटर स्थिति ट्रैक करेगा</li>
              </ul>
            </div>

            <button
              onClick={() => handleRoleClick('citizen', '/citizen/dashboard')}
              className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2.5 rounded shadow flex items-center justify-center gap-2 transition-colors"
            >
              <span>{t('access3Btn')}</span>
            </button>
          </div>

        </div>
      </section>

      {/* SANKALP Connect Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SankalpConnect />
      </section>

      {/* Role Selection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded border border-amber-300 uppercase tracking-widest">
            Stakeholder Access Portal
          </span>
          <h2 className="text-2xl font-bold text-gov-navy mt-2">
            {t('welcomeTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div 
            onClick={() => handleRoleClick('citizen', '/citizen/dashboard')}
            className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow hover:border-blue-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3 shadow">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700">{t('roleCitizen')}</h4>
              <p className="text-[11px] text-slate-500 mt-1">ट्रैक शिकायत स्थिति</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>प्रवेश करें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => handleRoleClick('government', '/government/dashboard')}
            className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow hover:border-emerald-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 shadow">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">{t('roleGov')}</h4>
              <p className="text-[11px] text-slate-500 mt-1">विभाग शिकायत निगरानी</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>प्रवेश करें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => handleRoleClick('university', '/university/dashboard')}
            className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow hover:border-purple-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3 shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-700">{t('roleUniv')}</h4>
              <p className="text-[11px] text-slate-500 mt-1">IIC R&D प्रोजेक्ट समाधान</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>प्रवेश करें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => handleRoleClick('csr', '/csr/dashboard')}
            className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow hover:border-amber-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 shadow">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700">{t('roleCsr')}</h4>
              <p className="text-[11px] text-slate-500 mt-1">CSR फंडिंग व समर्थन</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>प्रवेश करें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => handleRoleClick('admin', '/admin/dashboard')}
            className="bg-slate-900 text-white rounded-xl border border-slate-700 p-5 shadow-xl hover:border-amber-400 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between relative"
          >
            <div className="absolute top-3 right-3 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold mb-3 border border-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-300">{t('roleAdmin')}</h4>
              <p className="text-[11px] text-slate-300 mt-1">सुरक्षित प्रशासनिक लॉग इन</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>लॉग इन करें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
