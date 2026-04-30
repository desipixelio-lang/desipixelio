"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, CheckCircle2, XCircle, Info, 
  ArrowLeft, Scale, Globe, FileText, AlertCircle 
} from 'lucide-react';

export default function LicensingPage() {
  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC" 
  };

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* --- HEADER --- */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition">
          <ArrowLeft size={20}/> 
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Back to Library</span>
        </Link>
        <div className="flex items-center gap-2 opacity-60">
           <Scale size={18} className="text-blue-500"/>
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Universal License</span>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tighter">Usage <span className="italic text-blue-500">Rights.</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            DesiPixelio offers a simplified, all-in-one license designed for the modern AI era. 
            One payment, unlimited possibilities, zero legal confusion.
          </p>
        </div>
      </header>

      {/* --- THE STANDARD LICENSE --- */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck className="text-blue-500" size={32}/>
                 <h2 className="text-4xl md:text-5xl font-serif tracking-tight">The Standard <span className="text-blue-500 italic">License</span></h2>
              </div>
              
              <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl">
                This license grants you a non-exclusive, perpetual right to use the purchased AI asset globally for commercial and personal projects.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* ALLOWED SECTION */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 flex items-center gap-2">
                    <CheckCircle2 size={14}/> Permitted Usage
                  </h4>
                  <ul className="space-y-4">
                    <li className="text-sm text-slate-300 font-bold">✓ Digital Ads & Social Media</li>
                    <li className="text-sm text-slate-300 font-bold">✓ Websites & Mobile Apps</li>
                    <li className="text-sm text-slate-300 font-bold">✓ Marketing & Presentations</li>
                    <li className="text-sm text-slate-300 font-bold">✓ Print Media & Editorial</li>
                    <li className="text-sm text-slate-300 font-bold">✓ Educational & Personal Use</li>
                  </ul>
                </div>

                {/* STRICT PROHIBITIONS */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">
                    <XCircle size={14}/> Strict Prohibitions
                  </h4>
                  <ul className="space-y-4">
                    <li className="text-sm text-slate-100 font-black">✖ No redistribution as a standalone file</li>
                    <li className="text-sm text-slate-100 font-black">✖ No exclusive ownership claims</li>
                    <li className="text-sm text-slate-300 font-bold">✖ No use in trademarks or logos</li>
                    <li className="text-sm text-slate-300 font-bold">✖ No resale on competing stock sites</li>
                    <li className="text-sm text-slate-300 font-bold">✖ No use in offensive/illegal contexts</li>
                  </ul>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-600/20 p-3 rounded-2xl">
                       <Globe className="text-blue-500" size={24}/>
                    </div>
                    <div>
                       <p className="text-xs font-bold">Global Validity</p>
                       <p className="text-[10px] text-slate-500 uppercase font-black">No Regional Restrictions</p>
                    </div>
                 </div>
                 <Link href="/" className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                    Agree & Browse Assets
                 </Link>
              </div>
            </div>
            {/* Background watermark */}
            <FileText className="absolute -bottom-20 -right-20 opacity-5 text-white" size={400}/>
          </div>
        </div>
      </section>

      {/* --- IMPORTANT LEGAL CLARITY --- */}
      <section style={{ backgroundColor: PALETTE.offWhite }} className="rounded-t-[5rem] text-slate-900 py-32 px-6 md:px-12 shadow-[0_-50px_100px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <AlertCircle className="text-blue-600 mx-auto mb-4" size={32}/>
            <h2 className="text-4xl font-serif">Legal <span className="italic text-blue-600">Clarity</span></h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Protecting the DesiPixelio Ecosystem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
               <h3 className="font-serif text-xl mb-4 text-slate-800">Standalone Files</h3>
               <p className="text-sm text-slate-500 leading-relaxed">
                 Redistribution of the image as a standalone file is strictly forbidden. You must incorporate the image into a larger design (e.g., a website, poster, or ad) before sharing with third parties.
               </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
               <h3 className="font-serif text-xl mb-4 text-slate-800">Ownership Claims</h3>
               <p className="text-sm text-slate-500 leading-relaxed">
                 You are granted a license to use the image, but you may not claim exclusive ownership or copyright over the AI-generated asset itself. All intellectual property remains with DesiPixelio.
               </p>
            </div>
          </div>

          <div className="mt-20 text-center text-slate-400 max-w-2xl mx-auto">
             <p className="text-xs leading-relaxed italic">
               Note: Because these assets are generated using advanced AI diffusion models, similar visual concepts may exist. Our license ensures your right to use the specific high-fidelity file provided at the time of purchase.
             </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ backgroundColor: PALETTE.midnight }} className="py-12 border-t border-white/5 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
           © 2026 DesiPixelio  • Crafted with ❤️ in Jaipur
        </p>
      </footer>
    </div>
  );
}