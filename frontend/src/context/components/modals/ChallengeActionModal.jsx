import React, { useState } from 'react';
import { useEcosystem } from '../../EcosystemContext';
import { X, GraduationCap, Lightbulb, CheckCircle2, Rocket } from 'lucide-react';

export const ChallengeActionModal = ({ challenge, isOpen, onClose }) => {
  const { proposeUniversitySolution } = useEcosystem();
  const [projectTitle, setProjectTitle] = useState('');
  const [studentTeam, setStudentTeam] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await proposeUniversitySolution(challenge.id, projectTitle || challenge.title, studentTeam || 'IIC Student Team');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-purple-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-purple-400">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-purple-300" />
            <h3 className="text-base font-bold">विश्वविद्यालय / IIC समाधान प्रस्ताव (Propose Innovation)</h3>
          </div>
          <button onClick={onClose} className="text-purple-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <span className="text-purple-800 font-bold block">चैलेंज संदर्भ:</span>
              <span className="font-semibold text-purple-950 text-sm">{challenge.title}</span>
              <span className="text-slate-500 block mt-1">📍 {challenge.location}</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">प्रस्तावित आईओटी / एआई समाधान का शीर्षक *</label>
              <input
                type="text"
                required
                placeholder="उदा. AI Based Automated Sensor & Low-Cost Monitor"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">छात्र टीम व समन्वयक विवरण *</label>
              <input
                type="text"
                required
                placeholder="उदा. टीम स्पार्क (B.Tech 4th Year CSE / Mentor: Dr. Sharma)"
                value={studentTeam}
                onChange={e => setStudentTeam(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">प्रोटोटाइप कार्यप्रणाली विवरण</label>
              <textarea
                rows={3}
                placeholder="तकनीकी दृष्टिकोण, आवश्यक हार्डवेयर एवं 60-दिवसीय कार्यान्वयन योजना लिखें..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded flex items-center gap-1 shadow"
              >
                <Rocket className="w-4 h-4 text-purple-300" />
                <span>समाधान सबमिट करें (Submit Proposal)</span>
              </button>
            </div>

          </form>
        ) : (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-purple-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">प्रस्ताव सफलतापूर्वक दर्ज किया गया!</h4>
            <p className="text-xs text-slate-600">यह नवाचार प्रोजेक्ट अब सरकारी विभाग एवं CSR पार्टनर के सहयोग पृष्ठ पर दृश्यमान है।</p>
            <button
              onClick={onClose}
              className="bg-purple-700 text-white font-bold text-xs px-6 py-2 rounded mt-2"
            >
              डैशबोर्ड पर लौटें
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
