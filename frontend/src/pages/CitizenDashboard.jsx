import React, { useState } from 'react';
import { useEcosystem } from '../context/EcosystemContext';
import { NewIssueModal } from '../components/modals/NewIssueModal';
import { SankalpConnect } from '../components/common/SankalpConnect';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Filter,
  Check
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { issues, t } = useEcosystem();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredIssues = issues.filter(issue => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress') return issue.status === 'प्रगति पर' || issue.status === 'सत्यापित';
    if (activeFilter === 'resolved') return issue.status === 'समाधान';
    if (activeFilter === 'pending') return issue.status === 'दर्ज' || issue.status === 'लंबित';
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Greeting & CTA */}
        <div className="bg-white rounded-xl border border-slate-300 p-6 gov-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-gov-navy" />
              <h1 className="text-2xl font-bold text-gov-navy">{t('citGreeting')}</h1>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {t('citSub')}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-gov-navy font-extrabold text-sm px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('reportIssueBtn')}</span>
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('myReports')}</span>
              <span className="text-3xl font-black text-gov-navy">12</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('inProgress')}</span>
              <span className="text-3xl font-black text-amber-600">4</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('resolved')}</span>
              <span className="text-3xl font-black text-emerald-600">7</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-300 p-5 gov-shadow flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('pending')}</span>
              <span className="text-3xl font-black text-red-600">1</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Reusable SANKALP Ecosystem Connection Bar */}
        <SankalpConnect compact />

        {/* Filter Tabs & Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-gov-navy">
            {t('recentReports')}
          </h2>

          <div className="flex items-center space-x-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                activeFilter === 'all' ? 'bg-gov-navy text-white' : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              {t('filterAll')} (12)
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                activeFilter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              {t('inProgress')} (4)
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-3 py-1 rounded-full font-bold transition-colors ${
                activeFilter === 'resolved' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              {t('resolved')} (7)
            </button>
          </div>
        </div>

        {/* Issue Cards List */}
        <div className="space-y-6">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl border border-slate-300 p-6 gov-shadow space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-300">
                    ID: {issue.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    issue.priority === 'उच्च' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {issue.priority} {t('priorityLabel')}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {issue.date}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    {issue.location}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gov-navy">{issue.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{issue.description}</p>
                <div className="mt-2 text-xs font-semibold text-emerald-800 flex items-center gap-1">
                  <span>{t('assignedDeptLabel')}</span>
                  <span className="underline">{issue.assignedDept}</span>
                </div>
              </div>

              {/* 6-Stage Visual Timeline Stepper */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  6-Stage Status Stepper:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 relative">
                  {[t('step1'), t('step2'), t('step3'), t('step4'), t('step5'), t('step6')].map((stepLabel, idx) => {
                    const stepObj = issue.timeline[idx] || {};
                    return (
                      <div key={idx} className="flex flex-col items-center text-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          stepObj.completed 
                            ? 'bg-emerald-600 text-white shadow' 
                            : stepObj.current 
                              ? 'bg-amber-500 text-gov-navy ring-4 ring-amber-100 animate-pulse' 
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stepObj.completed ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>

                        <span className={`text-xs font-bold mt-1.5 ${stepObj.completed ? 'text-emerald-950' : stepObj.current ? 'text-amber-900 font-extrabold' : 'text-slate-500'}`}>
                          {stepLabel}
                        </span>

                        <span className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                          {stepObj.date || ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      <NewIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
