import React, { useState } from 'react';
import { useEcosystem } from '../../EcosystemContext';
import { MapPin, Filter, AlertTriangle, CheckCircle, Clock, Info, Layers } from 'lucide-react';

export const ProblemMap = ({ height = "h-96", onSelectIssue }) => {
  const { issues, setSelectedIssueForRouting } = useEcosystem();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(issues[0]);

  const categories = [
    { id: 'all', label: 'सभी (All)' },
    { id: 'water', label: '💧 जल आपूर्ति' },
    { id: 'roads', label: '🛣️ सड़क एवं बुनियादी ढांचा' },
    { id: 'waste', label: '🗑️ कचरा प्रबंधन' },
    { id: 'lights', label: '💡 स्ट्रीट लाइट' },
    { id: 'health', label: '🏥 स्वास्थ्य' },
  ];

  const filteredIssues = issues.filter(issue => {
    if (selectedCategory === 'all') return true;
    return issue.categoryKey === selectedCategory;
  });

  const getMarkerColor = (priority) => {
    switch (priority) {
      case 'उच्च': return 'bg-red-600 border-white text-white shadow-lg animate-pulse';
      case 'मध्यम': return 'bg-amber-500 border-white text-white shadow';
      default: return 'bg-emerald-600 border-white text-white shadow';
    }
  };

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
    if (onSelectIssue) onSelectIssue(issue);
    setSelectedIssueForRouting(issue);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 gov-shadow overflow-hidden">
      {/* Map Control Bar */}
      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-slate-800 text-sm">लाइव जन समस्या मानचित्र (Live Problem Hotspot Map)</h3>
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-300">
            {filteredIssues.length} सक्रिय हॉटस्पॉट
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs py-1">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Map Container */}
      <div className={`relative bg-slate-900 ${height} w-full overflow-hidden flex items-center justify-center`}>
        
        {/* Geographic Grid SVG Backdrop */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simulated Map Contour Graphics */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* District Labels */}
        <div className="absolute top-4 left-4 bg-slate-800/90 text-slate-200 text-[11px] font-medium px-3 py-1.5 rounded border border-slate-700 backdrop-blur">
          📍 स्थान: राजस्थान व उत्तर प्रदेश जोन (Jaipur & NCR Region)
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white text-[10px] p-2.5 rounded border border-slate-700 space-y-1 z-10 backdrop-blur">
          <div className="font-bold border-b border-slate-700 pb-1 mb-1">गंभीरता संकेतक (Severity)</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> 🔴 उच्च प्राथमिकता (High)</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 🟠 मध्यम प्राथमिकता (Medium)</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 🟢 सामान्य (Low)</div>
        </div>

        {/* Interactive Map Nodes / Hotspots */}
        <div className="relative w-full h-full max-w-4xl max-h-[500px]">
          {filteredIssues.map((issue, idx) => {
            // Coordinate to percentage calculation
            const topPct = 20 + ((idx * 23) % 65);
            const leftPct = 15 + ((idx * 27) % 70);

            return (
              <button
                key={issue.id}
                onClick={() => handleMarkerClick(issue)}
                style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${getMarkerColor(issue.priority)} transition-transform group-hover:scale-125`}>
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Marker Tooltip Label */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-30 border border-slate-700">
                  <div className="font-bold">{issue.title}</div>
                  <div className="text-[10px] text-slate-300">{issue.location} • AI Conf: {issue.aiConfidence}%</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Issue Quick Drawer Card */}
        {selectedIssue && (
          <div className="absolute bottom-4 right-4 bg-white text-slate-800 p-4 rounded-lg shadow-2xl border border-slate-300 max-w-sm w-full z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                ID: {selectedIssue.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                selectedIssue.priority === 'उच्च' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {selectedIssue.priority} प्राथमिकता
              </span>
            </div>
            
            <h4 className="font-bold text-sm text-gov-navy leading-snug">{selectedIssue.title}</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{selectedIssue.description}</p>

            <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">श्रेणी:</span>
                <span className="font-semibold text-slate-800">{selectedIssue.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">AI मैच विश्वास:</span>
                <span className="font-bold text-emerald-700">{selectedIssue.aiConfidence}%</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedIssueForRouting(selectedIssue)}
              className="mt-3 w-full bg-gov-navy hover:bg-slate-800 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-1"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>AI स्मार्ट रूटिंग विवरण देखें (Routing Details)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
