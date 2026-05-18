"use client";

import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Truck, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Award, 
  BookOpen 
} from 'lucide-react';

export default function PrintingHubPage() {
  const [orderDetails, setOrderDetails] = useState("");
  
  const CONTACT_INFO = {
    whatsapp: "919588847410", // Replace with your actual WhatsApp number
    telegram: "your_username", // Replace with your Telegram username
  };

  const PALETTE = {
    midnight: "#0F172A",
    slate: "#1E293B",
    electric: "#2563EB",
    emerald: "#10B981"
  };

  const getEncodedMessage = () => {
    return encodeURIComponent(
      `Hello DesiPixelio Printing Hub, I want to place a printing order: \n\n${orderDetails}`
    );
  };

  const handleContact = (platform: 'whatsapp' | 'telegram') => {
    if (!orderDetails.trim()) {
      alert("Please enter your printing requirements (e.g., Number of marksheets, paper type).");
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
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Printer size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">
            Printing <span className="text-emerald-500 italic">Hub</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Premium commercial printing for academic institutions and businesses. 
            Enter your requirements below for marksheets, exam papers, or branding.
          </p>
        </div>

        {/* Order Input Box */}
        <div style={{ backgroundColor: PALETTE.slate }} className="p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl mb-12">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 text-center">
            Specify Order Details (Quantity, Paper Quality, Sizes)
          </label>
          
          <div className="relative group mb-10">
            <textarea 
              placeholder="" 
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl py-6 px-8 text-lg focus:border-emerald-500 outline-none transition-all min-h-[150px] resize-none"
              value={orderDetails}
              onChange={(e) => setOrderDetails(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleContact('whatsapp')}
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#128C7E] text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-green-500/20"
            >
              <MessageCircle size={20} />
              Order on WhatsApp
            </button>

            <button 
              onClick={() => handleContact('telegram')}
              className="flex items-center justify-center gap-4 bg-[#0088cc] hover:bg-[#0077b5] text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-500/20"
            >
              <Send size={20} />
              Order on Telegram
            </button>
          </div>
        </div>

        {/* Printing Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <Award className="text-emerald-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Academic Media</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase">Custom marksheets and degree certificates with high-security finishes.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <BookOpen className="text-blue-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Exam Solutions</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase">Bulk printing of examination papers for schools and coaching centers.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <Truck className="text-amber-500 mb-4" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Statewide Delivery</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase">Secure and fast logistical support for bulk orders across Rajasthan.</p>
          </div>
        </div>

      </section>
    </div>
  );
}