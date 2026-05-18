"use client";

import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Code2, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Layers, 
  Rocket 
} from 'lucide-react';

export default function DevStudioPage() {
  const [projectBrief, setProjectBrief] = useState("");
  
  const CONTACT_INFO = {
    whatsapp: "919588847410", // Replace with your actual WhatsApp number
    telegram: "your_username", // Replace with your Telegram username
  };

  const PALETTE = {
    midnight: "#0F172A",
    slate: "#1E293B",
    electric: "#2563EB",
    amber: "#F59E0B",
    emerald: "#10B981"
  };

  const getEncodedMessage = () => {
    return encodeURIComponent(
      `Hello DesiPixelio Dev Studio, I have a project idea: \n\n${projectBrief}`
    );
  };

  const handleContact = (platform: 'whatsapp' | 'telegram') => {
    if (!projectBrief.trim()) {
      alert("Please enter a short project brief or link first.");
      return;
    }

    const message = getEncodedMessage();
    const urls = {
      whatsapp: `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`,
      telegram: `https://t.me/${CONTACT_INFO.telegram}?text=${message}`
    };

    window.open(urls[platform], '_blank');
  };

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans pt-20">
      <section className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Code2 size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">
            Dev <span className="text-amber-500 italic">Studio</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            From high-performance Next.js web apps to native Flutter mobile ecosystems. 
            Briefly describe your vision below to start a direct consultation.
          </p>
        </div>

        {/* Input Box */}
        <div style={{ backgroundColor: PALETTE.slate }} className="p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl mb-12">
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-6 text-center">
            Describe your project or paste a reference link
          </label>
          
          <div className="relative group mb-10">
            <textarea 
              placeholder="I want to build a school management system similar to..." 
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl py-6 px-8 text-lg focus:border-amber-500 outline-none transition-all min-h-[150px] resize-none"
              value={projectBrief}
              onChange={(e) => setProjectBrief(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleContact('whatsapp')}
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#128C7E] text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-green-500/20"
            >
              <MessageCircle size={20} />
              Consult on WhatsApp
            </button>

            <button 
              onClick={() => handleContact('telegram')}
              className="flex items-center justify-center gap-4 bg-[#0088cc] hover:bg-[#0077b5] text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-500/20"
            >
              <Send size={20} />
              Consult on Telegram
            </button>
          </div>
        </div>

        {/* Tech Stack / Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <Globe className="text-blue-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Web Apps</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase">SEO-optimized Next.js and React architectures.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <Smartphone className="text-emerald-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Mobile Apps</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase">Cross-platform Flutter and native Android development.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <Layers className="text-amber-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Management Systems</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase">Custom institutional software like school portals.</p>
          </div>
        </div>

      </section>
    </div>
  );
}