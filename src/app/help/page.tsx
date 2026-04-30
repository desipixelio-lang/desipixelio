"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, HelpCircle, BookOpen, CreditCard, 
  Download, ShieldCheck, Mail, MessageSquare, 
  ChevronDown, ChevronUp, ArrowLeft, ExternalLink, X
} from 'lucide-react';

export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const PALETTE = { midnight: "#0F172A", slate: "#1E293B", electric: "#2563EB", offWhite: "#F8FAFC" };

  const handleStartChat = () => {
    window.open(`https://wa.me/91XXXXXXXXXX?text=Help%20needed%20with%20DesiPixelio`, '_blank');
  };

  const categories = [
    { id: "billing", icon: <CreditCard size={24}/>, title: "Billing & Wallet", desc: "Razorpay top-ups and invoices." },
    { id: "licensing", icon: <ShieldCheck size={24}/>, title: "Licensing Rights", desc: "Usage rights for heritage media." },
    { id: "downloads", icon: <Download size={24}/>, title: "Download Help", desc: "Accessing and formatting files." },
    { id: "contribute", icon: <BookOpen size={24}/>, title: "Contributor Hub", desc: "Sell your own photography." },
  ];

  const faqs = [
    { q: "My wallet balance isn't updating.", a: "Wait 2 minutes and refresh. If it fails, Start Chat with your Payment ID." },
    { q: "Can I use images for commercial ads?", a: "Yes, standard licenses cover digital ads and social media." },
    { q: "What file formats do you provide?", a: "High-fidelity JPEGs and PNGs. Elite members get RAW files." },
    { q: "Is there an expiry on wallet balance?", a: "No. Your balance remains valid forever." }
  ];

  // --- SEARCH LOGIC ---
  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition">
          <ArrowLeft size={20}/> <span className="text-[10px] font-black uppercase tracking-widest">Store</span>
        </Link>
        <img src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" className="h-10 w-auto opacity-80" alt="Logo" />
      </nav>

      <header className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight">How can we <span className="italic text-blue-500">help?</span></h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
          <input 
            type="text" 
            placeholder="Search help articles..." 
            style={{ backgroundColor: PALETTE.slate }}
            className="w-full border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-lg focus:border-blue-500 outline-none transition-all shadow-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={20}/>
            </button>
          )}
        </div>
      </header>

      {/* SEARCH RESULTS: CATEGORIES */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
            <Link key={cat.id} href={`/help/${cat.id}`} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-blue-600 transition-all duration-500 group relative">
              <div className="text-blue-500 group-hover:text-white mb-6 transition-colors">{cat.icon}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:translate-x-1 transition-transform">{cat.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-blue-100">{cat.desc}</p>
              <ExternalLink className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity" size={16}/>
            </Link>
          )) : (
            <div className="col-span-full text-center py-10 text-slate-500 font-bold uppercase tracking-widest text-xs">No topics match your search</div>
          )}
        </div>
      </section>

      {/* SEARCH RESULTS: FAQS */}
      <section style={{ backgroundColor: PALETTE.offWhite }} className="rounded-t-[5rem] text-slate-900 py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition">
                  <span className="font-bold text-slate-700">{faq.q}</span>
                  {activeFaq === i ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                </button>
                {activeFaq === i && <div className="px-6 pb-6 text-slate-500 text-sm animate-in fade-in slide-in-from-top-2">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: PALETTE.offWhite }} className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[4rem] p-12 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-serif mb-4">Need more <span className="italic text-blue-500">detail?</span></h2>
            <p className="text-slate-400 text-sm">Our heritage support experts are ready to assist you.</p>
          </div>
          <button onClick={handleStartChat} className="bg-emerald-500 hover:bg-emerald-400 text-black px-12 py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest transition-all shadow-xl">
            <MessageSquare size={18}/> Start Chat
          </button>
        </div>
      </section>
    </div>
  );
}