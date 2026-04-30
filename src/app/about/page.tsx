"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Cpu, ShieldCheck, Palette, 
  Layers, Sparkles, Zap, Globe, History
} from 'lucide-react';

export default function AboutPage() {
  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC",
    coolGray: "#94A3B8"
  };

  const values = [
    { 
      icon: <Cpu className="text-blue-500" />, 
      title: "Synthesized Perfection", 
      desc: "Our AI models are fine-tuned on authentic Indian motifs, ensuring every generation respects the intricate details of our culture." 
    },
    { 
      icon: <ShieldCheck className="text-emerald-500" />, 
      title: "Copyright Clean", 
      desc: "Every asset is unique and legally cleared. We provide full commercial rights for AI-generated media, so you can build without worry." 
    },
    { 
      icon: <Palette className="text-amber-500" />, 
      title: "Curation as Art", 
      desc: "We don't just prompt; we curate. Only the top 1% of our high-fidelity generations make it into the DesiPixelio library." 
    }
  ];

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 px-8 py-10 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition">
          <ArrowLeft size={20}/> 
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Back to Library</span>
        </Link>
        <img src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" className="h-12 w-auto opacity-90" alt="Logo" />
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-64 pb-32 px-6 text-center relative">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
            <Layers size={400} className="text-blue-500 animate-pulse" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-500/20">
              Future of Heritage
            </span>
          </div>
          <h1 className="text-6xl md:text-[7rem] font-serif mb-8 tracking-tighter leading-tight">
            Where <span className="italic text-blue-500">AI</span> meets <br /> Indian <span className="italic">Legacy.</span>
          </h1>
          <p style={{ color: PALETTE.coolGray }} className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            DesiPixelio is India’s premier AI-native stock agency. We leverage advanced latent diffusion to reimagine Indian heritage for the high-fidelity demands of 2026.
          </p>
        </div>
      </section>

      {/* --- TECH + TRADITION --- */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
            <div className="absolute -inset-4 bg-blue-600/20 rounded-[4rem] blur-3xl opacity-50"></div>
            <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200" 
                className="relative rounded-[3.5rem] shadow-2xl border border-white/5 saturate-[1.2] hover:scale-[1.02] transition-all duration-1000"
                alt="AI Generated Art"
            />
            <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl hidden md:block">
                <History size={32} className="text-amber-500" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeless Aesthetics</p>
            </div>
        </div>
        <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">Prompting the <span className="text-blue-500 italic">Past</span>, <br/>Building the <span className="text-blue-500">Future.</span></h2>
            <div className="space-y-6">
                <p className="text-slate-400 leading-relaxed text-lg">
                    Traditional stock media is limited by the physical. At DesiPixelio, we transcend those limits. Our library offers impossible angles, hyper-realistic lighting, and cinematic scenes that would take weeks to shoot manually.
                </p>
                <p className="text-slate-400 leading-relaxed text-lg">
                    By merging deep-learning algorithms with expert cultural curation, we provide assets that are not just visually stunning, but contextually accurate to the Indian subcontinent.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                <div className="flex items-center gap-4">
                    <Globe className="text-blue-500" />
                    <div>
                        <h4 className="text-xl font-bold">100% Unique</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">No duplicate assets</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Zap className="text-amber-500" />
                    <div>
                        <h4 className="text-xl font-bold">4K Native</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Ultra-HD Upscaling</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- THE CORE PILLARS --- */}
      <section style={{ backgroundColor: PALETTE.offWhite }} className="rounded-t-[5rem] text-slate-900 py-32 px-6 md:px-12 mt-20 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <h2 className="text-5xl font-serif max-w-xl leading-tight">Engineered for <span className="text-blue-600 italic">Creators.</span></h2>
                <p className="text-slate-500 max-w-sm text-sm font-medium">We’ve solved the "AI weirdness" problem through rigorous human oversight and proprietary prompt engineering.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {values.map((v, i) => (
                    <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 group hover:bg-blue-600 transition-all duration-700">
                        <div className="mb-8 scale-150 origin-left transition-transform group-hover:scale-125">{v.icon}</div>
                        <h3 className="text-2xl font-serif mb-4 group-hover:text-white transition-colors">{v.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed group-hover:text-blue-100 transition-colors">{v.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section style={{ backgroundColor: PALETTE.offWhite }} className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[4rem] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all"></div>
            <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-serif mb-8 tracking-tighter">Your vision, <br/> <span className="italic text-blue-500">Accelerated.</span></h2>
                <p className="text-slate-400 max-w-lg mx-auto mb-12 text-lg">Stop searching for the perfect shot. Start finding it in our AI-powered library.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link href="/pricing" className="bg-blue-600 hover:bg-blue-500 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                        Unlock Premium Access
                    </Link>
                    <Link href="/" className="bg-white/5 border border-white/10 hover:bg-white/10 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                        Browse Gallery
                    </Link>
                </div>
            </div>
        </div>
      </section>

      <footer className="py-12 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
            © 2026 DesiPixelio  • Crafted with ❤️ in Jaipur
        </p>
      </footer>
    </div>
  );
}