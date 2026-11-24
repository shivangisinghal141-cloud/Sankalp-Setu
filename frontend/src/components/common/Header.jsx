import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEcosystem } from '../../context/EcosystemContext';
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  UserCheck, 
  Phone, 
  Globe, 
  Bell, 
  ChevronDown,
  Layers,
  Menu,
  X
} from 'lucide-react';

export const Header = () => {
  const { currentRole, setCurrentRole, language, setLanguage, t, notifications } = useEcosystem();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'citizen', name: t('roleCitizen'), path: '/citizen/dashboard', icon: UserCheck, color: 'text-blue-700 bg-blue-50' },
    { id: 'government', name: t('roleGov'), path: '/government/dashboard', icon: Building2, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'university', name: t('roleUniv'), path: '/university/dashboard', icon: GraduationCap, color: 'text-purple-700 bg-purple-50' },
    { id: 'csr', name: t('roleCsr'), path: '/csr/dashboard', icon: Briefcase, color: 'text-amber-700 bg-amber-50' },
    { id: 'admin', name: t('roleAdmin'), path: '/admin/dashboard', icon: ShieldCheck, color: 'text-slate-800 bg-slate-100' },
  ];

  const languages = [
    { id: 'hi', label: '🇮🇳 हिंदी (Hindi)', short: 'हिंदी' },
    { id: 'en', label: '🇬🇧 English', short: 'English' },
    { id: 'khr', label: '🌾 खोरठा (Khortha)', short: 'खोरठा' },
  ];

  const handleRoleSelect = (role) => {
    setCurrentRole(role.id);
    setShowRoleMenu(false);
    navigate(role.path);
  };

  const getActiveRoleLabel = () => {
    const matched = roles.find(r => location.pathname.includes(r.id));
    if (matched) return matched.name;
    return 'रोल चुनें (Select Role)';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm font-sans">
      <div className="gov-tricolor-bar"></div>
      <div className="bg-gov-navy text-white px-4 py-1 text-xs flex justify-between items-center font-medium">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {t('govtTitle')}
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-amber-300 font-semibold">{t('subTagline')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="tel:18001852026" className="flex items-center gap-1 hover:text-amber-300 transition-colors">
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>टोल-फ्री: 1800-185-2026</span>
          </a>
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-600 text-slate-200 text-xs font-bold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{languages.find(l => l.id === language)?.short || 'हिंदी'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 z-50 py-1 text-xs">
                <div className="px-3 py-1 font-bold text-slate-500 bg-slate-50 border-b border-slate-100 text-[10px] uppercase">
                  भाषा चुनें / Select Language
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between font-semibold ${
                      language === lang.id ? 'bg-amber-50 text-gov-navy font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.id && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 bg-gov-navy text-white rounded-lg flex items-center justify-center font-bold text-xl shadow border-2 border-amber-400">
            सं
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight text-gov-navy font-serif">{t('brandName')}</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300">SANKALP</span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold">{t('tagline')}</p>
          </div>
        </Link>
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-gov-navy rounded-lg hover:bg-slate-100 relative transition-colors"
              title="सूचनाएं"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-800">लाइव अपडेट्स (Live Feeds)</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">सक्रिय</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100 transition-colors">
                      <p className="font-medium text-slate-800">{n.text}</p>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-gov-navy px-3 py-2 rounded-lg border border-slate-300 font-medium text-sm transition-all"
            >
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>{getActiveRoleLabel()}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 divide-y divide-slate-100">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  हितधारक रोल बदलें (Switch Role View)
                </div>
                <div className="py-1">
                  {roles.map(role => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className="w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
                      >
                        <div className={`p-1.5 rounded ${role.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{role.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 bg-slate-50">
                  <Link 
                    to="/" 
                    onClick={() => setShowRoleMenu(false)}
                    className="block text-center text-xs text-gov-navy font-bold hover:underline py-1"
                  >
                    मुख्य पृष्ठ (Landing Page)
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex lg:hidden items-center space-x-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:text-gov-navy hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 border-t border-slate-200 px-4 py-3 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">भाषा चुनें / Language</span>
            <div className="flex gap-1">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    language === lang.id ? 'bg-gov-navy text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  {lang.short}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase">डैशबोर्ड रोल चुनें</div>
          <div className="grid grid-cols-1 gap-2">
            {roles.map(role => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    handleRoleSelect(role);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2.5 bg-white rounded border border-slate-200 text-left font-medium text-xs text-slate-800"
                >
                  <div className={`p-1.5 rounded ${role.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold">{role.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
