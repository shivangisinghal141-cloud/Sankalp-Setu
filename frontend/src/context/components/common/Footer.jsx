import React from 'react';
import { ShieldCheck, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gov-navy text-slate-300 text-xs pt-8 pb-6 border-t-4 border-amber-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700">
          
          {/* Col 1: About SANKALP */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-500 text-gov-navy font-bold rounded flex items-center justify-center text-lg">
                सं
              </div>
              <span className="text-xl font-bold text-white tracking-tight">संकल्प SANKALP</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              जन समस्या से समाधान तक — एक एकीकृत राष्ट्रीय डिजिटल प्लेटफॉर्म जो नागरिक शिकायतों को एआई तकनीक, विश्वविद्यालय नवाचार एवं उद्योग सीएसआर (CSR) सहयोग से वास्तविक समाधानों में बदलता है।
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>प्रमाणित सरकारी मंच (Government Verified)</span>
            </div>
          </div>

          {/* Col 2: Institutional Portals */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
              सरकारी पोर्टल एवं लिंक
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="https://mygov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">MyGov Portal <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">CPGRAMS शिकायत पोर्टल <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://mohua.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">आवास एवं शहरी कार्य मंत्रालय <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://jalshakti-dowr.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">जल शक्ति मंत्रालय <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://mic.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">MoE Innovation Cell (IIC) <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
              मुख्य विशेषताएँ
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>• AI आधारित स्मार्ट श्रेणीकरण एवं डुप्लीकेट पहचान</li>
              <li>• बहु-हितधारक रूटिंग (Gov + University + CSR)</li>
              <li>• IVR एवं पंचायत CSC सहायता (कीपैड फोन हेतु)</li>
              <li>• लाइव समाधान नक्शा व पारदर्शिता टाइमलाइन</li>
              <li>• रीयल-टाइम प्रभाव विश्लेषण व फीडबैक प्रणाली</li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpline */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
              हेल्पलाइन एवं संपर्क
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Phone className="w-4 h-4" />
                <span>टोल-फ्री नंबर: 1800-185-2026</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support@sankalp.gov.in</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>राष्ट्रीय सूचना विज्ञान केंद्र (NIC), नई दिल्ली, भारत</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400">
          <p>© 2026 संकल्प (SANKALP) Ecosystem. सर्वाधिकार सुरक्षित। National Informatics Centre.</p>
          <p className="mt-2 md:mt-0 text-slate-400">
            डिजिटल इंडिया • स्मार्ट सिटी मिशन • शिक्षा मंत्रालय (IIC) • कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR)
          </p>
        </div>
      </div>
    </footer>
  );
};
