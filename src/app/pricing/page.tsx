"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, ShoppingCart, Zap, Crown, 
  Rocket, ShieldCheck, Mail, User, Loader2
} from 'lucide-react';

// --- CUSTOM SOCIAL ICONS ---
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

// --- MAIN COMPONENT ---
export default function PricingPage() {
  const { user } = useAuth();
  
  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC", 
    coolGray: "#94A3B8" 
  };

  const plans = [
    {
      name: "Starter",
      price: "199",
      limit: "29 Images",
      desc: "Perfect for social media creators and small blogs.",
      icon: <Zap className="text-blue-400" size={28} />,
      features: ["Standard License", "HD Resolution", "7-Day Expiry", "Email Support"],
      button: "Start Creating",
      featured: false
    },
    {
      name: "Pro Storyteller",
      price: "699",
      limit: "69 Images",
      desc: "The most popular choice for digital agencies and designers.",
      icon: <Rocket className="text-amber-500" size={28} />,
      features: ["Enhanced License", "4K High-Res", "No Expiry", "Priority Support", "Collection Access"],
      button: "Get Pro Access",
      featured: true
    },
    {
      name: "Agency Elite",
      price: "1399",
      limit: "109 Images",
      desc: "Bulk high-fidelity assets for large scale campaigns.",
      icon: <Crown className="text-purple-400" size={28} />,
      features: ["Full Commercial Rights", "RAW Files Included", "Multi-User Access", "Dedicated Manager", "Early Access"],
      button: "Join The Elite",
      featured: false
    }
  ];

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed h-20 top-0 w-full z-[80] px-6 md:px-12 py-10 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <Link href="/">
          <img 
            src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" 
            alt="DesiPixelio" 
            className="h-16 md:h-20 w-auto transition-transform hover:scale-105" 
          />
        </Link>
        
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
           <Link href="/about" className="hover:text-blue-500 transition">About Us</Link>
          <Link href="/categories" className="hover:text-blue-500 transition">Categories</Link>
          <Link href="/collections" className="hover:text-blue-500 transition">Collections</Link>
          <Link href="/pricing" className="text-blue-500 underline underline-offset-8 decoration-2">Pricing</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/cart"><ShoppingCart size={24} className="hover:text-blue-500 transition"/></Link>
          {user ? (
            <div className="w-11 h-11 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden shadow-lg">
               <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-full h-full rounded-full object-cover" alt="" />
            </div>
          ) : (
            <Link href="/login" style={{ backgroundColor: PALETTE.electric }} className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Login</Link>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-64 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-[7rem] font-serif mb-8 tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-10 duration-700">Simple <span className="italic text-blue-500">Pricing</span></h1>
        <p style={{ color: PALETTE.coolGray }} className="text-[12px] font-black uppercase tracking-[0.5em] max-w-xl mx-auto leading-loose">
          Select a plan that fits your creative journey. High-fidelity assets for every type of storyteller.
        </p>
      </section>

      {/* --- PRICING CARDS --- */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              style={{ backgroundColor: plan.featured ? "#1E293B" : "rgba(30, 41, 59, 0.4)" }}
              className={`relative p-10 rounded-[3.5rem] border transition-all duration-500 group flex flex-col ${plan.featured ? 'border-blue-500 shadow-[0_0_80px_rgba(37,99,235,0.15)] scale-105 z-10' : 'border-white/5 hover:border-white/20'}`}
            >
              {plan.featured && (
                <div style={{ backgroundColor: PALETTE.electric }} className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                  Recommended Choice
                </div>
              )}
              
              <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl">{plan.icon}</div>
              <h3 className="text-2xl font-serif mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-xs mb-8 font-medium leading-relaxed">{plan.desc}</p>
              
              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold">₹</span>
                  <span className="text-6xl font-serif tracking-tighter">{plan.price}</span>
                </div>
                <div className="text-blue-500 font-black text-[11px] uppercase tracking-widest mt-4 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {plan.limit}
                </div>
              </div>

              <div className="space-y-5 mb-12 flex-grow">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" /> {feat}
                  </div>
                ))}
              </div>

              <button 
                style={{ backgroundColor: plan.featured ? PALETTE.electric : "white" }}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-2xl ${plan.featured ? 'text-white' : 'text-black hover:bg-blue-50'}`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </section>

     
    </div>
  );
}