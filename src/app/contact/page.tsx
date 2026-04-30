"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, MessageSquare, MapPin, Send, 
  ArrowLeft, CheckCircle2, Loader2, Globe
} from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Twitter = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);


  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC" 
  };

  const handleStartChat = () => {
    window.open(`https://wa.me/91XXXXXXXXXX?text=Namaste%20DesiPixelio%20Support`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* --- HEADER --- */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition">
          <ArrowLeft size={20}/> 
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Library</span>
        </Link>
        <img 
          src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" 
          className="h-20 w-auto opacity-80" 
          alt="Logo" 
        />
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* LEFT: CONTENT & INFO */}
        <div className="space-y-12">
          <div>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 tracking-tighter">Get in <span className="italic text-blue-500">Touch.</span></h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Have a custom AI asset request or need help with licensing? Our team is ready to assist your creative journey.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                <Mail className="text-blue-500 group-hover:text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Us</p>
                <p className="text-xl font-serif">support@desipixelio.com</p>
              </div>
            </div>

            <div onClick={handleStartChat} className="flex items-start gap-6 group cursor-pointer">
              <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-emerald-500 transition-colors">
                <MessageSquare className="text-emerald-500 group-hover:text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">WhatsApp Chat</p>
                <p className="text-xl font-serif text-emerald-500">Start Chat →</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-white/5 p-4 rounded-2xl">
                <MapPin className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Studio Location</p>
                <p className="text-xl font-serif">Jaipur, Rajasthan, India</p>
              </div>
            </div>
          </div>

          
        </div>

        {/* RIGHT: CONTACT FORM */}
        <div style={{ backgroundColor: PALETTE.slate }} className="p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-serif mb-4">Namaste, Message Received!</h2>
              <p className="text-slate-400 text-sm mb-8">We will get back to your query within 24 hours.</p>
              <button onClick={() => setSent(false)} className="text-blue-500 font-black uppercase text-[10px] tracking-widest">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" placeholder="Arjun Singh" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Address</label>
                  <input required type="email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" placeholder="arjun@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Inquiry Type</label>
                <select className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold appearance-none">
                  <option className="bg-[#1E293B]">Licensing & Rights</option>
                  <option className="bg-[#1E293B]">Wallet & Payments</option>
                  <option className="bg-[#1E293B]">Custom AI Asset Request</option>
                  <option className="bg-[#1E293B]">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Message</label>
                <textarea required rows={5} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold resize-none" placeholder="Tell us more about your project..."></textarea>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><Send size={18}/> Send Inquiry</>}
              </button>
            </form>
          )}
          {/* Decorative watermark */}
          <Mail size={300} className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none" />
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
        © 2026 DesiPixelio  • Crafted with ❤️ in Jaipur
      </footer>
    </div>
  );
}