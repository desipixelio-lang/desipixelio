"use client";

import React, { useState } from 'react';
import { Link as LinkIcon, Send, MessageCircle, SendHorizontal, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function StockMediaPage() {
  const [mediaLink, setMediaLink] = useState("");
  
  // Configuration for your contact points
  const CONTACT_INFO = {
    whatsapp: "919000000000", // Replace with your actual WhatsApp number
    telegram: "your_username", // Replace with your Telegram username
  };

  const PALETTE = {
    midnight: "#0F172A",
    slate: "#1E293B",
    electric: "#2563EB",
    amber: "#F59E0B"
  };

  const getEncodedMessage = () => {
    return encodeURIComponent(`Hello DesiPixelio, I want to acquire this stock media: ${mediaLink}`);
  };

  const handleContact = (platform: 'whatsapp' | 'telegram') => {
    if (!mediaLink.trim()) {
      alert("Please paste a media link first.");
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
          <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <ImageIcon size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">Stock Media <span className="text-blue-500 italic">Hub</span></h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Acquire high-resolution assets from 40+ global platforms. Paste your link below to start a direct chat for instant delivery.
          </p>
        </div>

        {/* Input Box */}
        <div style={{ backgroundColor: PALETTE.slate }} className="p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl mb-12">
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 text-center">
            Paste Asset Link (Shutterstock, Adobe Stock, etc.)
          </label>
          
          <div className="relative group mb-10">
            <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={24} />
            <input 
              type="url" 
              placeholder="https://www.shutterstock.com/image-photo/..." 
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-lg focus:border-blue-500 outline-none transition-all"
              value={mediaLink}
              onChange={(e) => setMediaLink(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Option */}
            <button 
              onClick={() => handleContact('whatsapp')}
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#128C7E] text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-green-500/20"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </button>

            {/* Telegram Option */}
            <button 
              onClick={() => handleContact('telegram')}
              className="flex items-center justify-center gap-4 bg-[#0088cc] hover:bg-[#0077b5] text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-500/20"
            >
              <Send size={20} />
              Chat on Telegram
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <CheckCircle2 className="text-blue-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Instant Setup</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed uppercase">Your link is pre-loaded into the chat for immediate response.</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <CheckCircle2 className="text-amber-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Global Access</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed uppercase">Support for all major stock platforms worldwide.</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <CheckCircle2 className="text-emerald-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Secure Delivery</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed uppercase">Encrypted direct-to-user file transfer over chat.</p>
          </div>
        </div>

      </section>
    </div>
  );
}