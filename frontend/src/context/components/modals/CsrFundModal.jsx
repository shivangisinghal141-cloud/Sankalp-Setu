import React, { useState } from 'react';
import { useEcosystem } from '../../EcosystemContext';
import { X, Briefcase, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CsrFundModal = ({ opportunity, isOpen, onClose }) => {
  const { pledgeCsrFund } = useEcosystem();
  const [amount, setAmount] = useState('500000');
  const [partnerName, setPartnerName] = useState('TATA CSR Foundation');
  const [funded, setFunded] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await pledgeCsrFund(opportunity.id, partnerName, amount);
    setFunded(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-900 text-white px-6 py-4 flex items-center justify-between border-b-4 border-amber-400">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-amber-300" />
            <h3 className="text-base font-bold">उद्योग / CSR निधि प्रतिबद्धता (CSR Co-funding)</h3>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!funded ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1">
              <span className="text-amber-900 font-bold block text-xs">परियोजना:</span>
              <span className="font-bold text-slate-900 text-sm">{opportunity.title}</span>
              <div className="flex justify-between text-[11px] text-amber-800 pt-1">
                <span>कुल आवश्यक: <strong>{opportunity.targetResource}</strong></span>
                <span>स्थिति: <strong className="text-amber-900">{opportunity.status}</strong></span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">उद्योग / CSR कॉर्पोरेट संस्था का नाम *</label>
              <input
                type="text"
                required
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">प्रतिबद्ध CSR निधि राशि (₹ INR में) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold text-gov-navy"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[11px] space-y-1 text-slate-600">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>CSR 80G एवं अनुपालन प्रमाण पत्र</span>
              </div>
              <p>संकल्प प्लेटफॉर्म पर सभी CSR योगदान प्रत्यक्ष जिला प्रशासन निष्पादन खातों में हस्तांतरित होते हैं और 100% ऑडिटेड हैं।</p>
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
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow flex items-center gap-1"
              >
                <span>₹ {Number(amount).toLocaleString('en-IN')} स्वीकृत करें</span>
              </button>
            </div>

          </form>
        ) : (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">CSR निधि प्रतिबद्धता सफलतापूर्वक पंजीकृत!</h4>
            <p className="text-xs text-slate-600">धन्यवाद {partnerName}! आपकी प्रतिबद्धता का प्रत्यक्ष प्रभाव रिपोर्ट में अंकन होगा।</p>
            <button
              onClick={onClose}
              className="bg-amber-600 text-white font-bold text-xs px-6 py-2 rounded mt-2"
            >
              डैशबोर्ड पर लौटें
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
