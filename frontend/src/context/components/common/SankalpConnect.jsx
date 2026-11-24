import React from 'react';
import { UserCheck, Bot, GitFork, Building2, GraduationCap, Briefcase, Lightbulb, Rocket, LineChart, ArrowRight } from 'lucide-react';

export const SankalpConnect = ({ compact = false, currentStep = 'routing' }) => {
  const steps = [
    { id: 'citizen', name: 'नागरिक', icon: UserCheck, color: 'border-blue-500 text-blue-700 bg-blue-50' },
    { id: 'ai', name: 'AI विश्लेषण', icon: Bot, color: 'border-cyan-500 text-cyan-700 bg-cyan-50' },
    { id: 'routing', name: 'स्मार्ट रूटिंग Engine', icon: GitFork, color: 'border-indigo-500 text-indigo-700 bg-indigo-50 font-bold scale-105' },
    { id: 'gov', name: '🏛️ सरकार', icon: Building2, color: 'border-emerald-600 text-emerald-800 bg-emerald-50' },
    { id: 'univ', name: '🎓 विश्वविद्यालय', icon: GraduationCap, color: 'border-purple-600 text-purple-800 bg-purple-50' },
    { id: 'csr', name: '🏢 उद्योग / CSR', icon: Briefcase, color: 'border-amber-600 text-amber-800 bg-amber-50' },
    { id: 'solution', name: 'नवाचार समाधान', icon: Lightbulb, color: 'border-yellow-500 text-yellow-800 bg-yellow-50' },
    { id: 'execution', name: 'कार्यान्वयन', icon: Rocket, color: 'border-teal-500 text-teal-800 bg-teal-50' },
    { id: 'impact', name: 'मापने योग्य प्रभाव', icon: LineChart, color: 'border-green-600 text-green-800 bg-green-100 font-bold' },
  ];

  return (
    <div className={`bg-white rounded-lg border border-slate-300 p-5 gov-shadow ${compact ? 'py-3' : 'py-6'}`}>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-base font-bold text-gov-navy uppercase tracking-wider">
              SANKALP CONNECT Ecosystem Flow
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            समस्या से इंटेलिजेंस, कनेक्शन, सहयोग, समाधान व प्रभाव का लाइव प्रवाह (Problem to Impact Pipeline)
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded">
          SIH Unified Architecture
        </span>
      </div>

      {/* Connected Diagram */}
      <div className="overflow-x-auto py-2">
        <div className="min-w-[800px] flex items-center justify-between space-x-2 relative">
          
          {/* 1. Citizen */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-blue-800 shadow">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1">👤 नागरिक</span>
            <span className="text-[10px] text-slate-500">समस्या दर्ज</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {/* 2. AI */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-cyan-100 border-2 border-cyan-600 flex items-center justify-center text-cyan-800 shadow">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1">🤖 AI इंटेलिजेंस</span>
            <span className="text-[10px] text-slate-500">वर्ग व डुप्लीकेट जांच</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {/* 3. Smart Routing */}
          <div className="flex flex-col items-center ring-2 ring-indigo-400 ring-offset-2 rounded-lg p-1 bg-indigo-50/50">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <GitFork className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-indigo-950 mt-1">🔀 स्मार्ट रूटिंग</span>
            <span className="text-[10px] font-semibold text-indigo-700">बहु-हितधारक मैच</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {/* 4. Multi-Stakeholder Matrix */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-2.5 bg-slate-50 flex space-x-2">
            
            <div className="flex flex-col items-center p-1.5 bg-emerald-50 rounded border border-emerald-300">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span className="text-[11px] font-bold text-emerald-900 mt-0.5">🏛️ सरकार</span>
              <span className="text-[9px] text-emerald-700">विभागीय कार्य</span>
            </div>

            <div className="flex items-center text-xs font-bold text-slate-400">↔</div>

            <div className="flex flex-col items-center p-1.5 bg-purple-50 rounded border border-purple-300">
              <GraduationCap className="w-5 h-5 text-purple-700" />
              <span className="text-[11px] font-bold text-purple-900 mt-0.5">🎓 विश्वविद्यालय</span>
              <span className="text-[9px] text-purple-700">IIC नवाचार</span>
            </div>

            <div className="flex items-center text-xs font-bold text-slate-400">↔</div>

            <div className="flex flex-col items-center p-1.5 bg-amber-50 rounded border border-amber-300">
              <Briefcase className="w-5 h-5 text-amber-700" />
              <span className="text-[11px] font-bold text-amber-900 mt-0.5">🏢 उद्योग / CSR</span>
              <span className="text-[9px] text-amber-700">संसाधन सहायता</span>
            </div>

          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {/* 5. Solution & Execution */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-teal-100 border-2 border-teal-600 flex items-center justify-center text-teal-800 shadow">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1">💡 समाधान व कार्य</span>
            <span className="text-[10px] text-slate-500">धरातल पर निष्पादन</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {/* 6. Impact */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-lg">
              <LineChart className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-emerald-950 mt-1">📊 मापने योग्य प्रभाव</span>
            <span className="text-[10px] font-bold text-emerald-700">5-स्टार नागरिक रेटिंग</span>
          </div>

        </div>
      </div>
    </div>
  );
};
