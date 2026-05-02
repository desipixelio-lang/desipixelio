"use client";

import React from 'react';
import { 
  Printer, 
  Code2, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Globe, 
  Zap 
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      id: 'printing',
      title: "Premium Printing",
      description: "High-definition physical prints delivered to your doorstep. From business cards to large-scale banners.",
      icon: <Printer className="text-blue-500" size={32} />,
      features: ["CMYK Precision",  "Bulk Discounts"],
      color: "blue",
      priceTag: "Contact for Pricing"
    },
    {
      id: 'web-dev',
      title: "Web Development",
      description: "Custom-built, high-performance web applications using the latest tech stack (Next.js, React, Firebase).",
      icon: <Code2 className="text-emerald-500" size={32} />,
      features: ["SEO Optimized", "Fully Responsive", "CMS Integration"],
      color: "emerald",
      priceTag: "Custom Quotes"
    },
    {
      id: 'stock-assets',
      title: "Stock Library",
      description: "Real-world high-quality stock images and assets. Authentic photography at prices lower than any global competitor.",
      icon: <ImageIcon className="text-amber-500" size={32} />,
      features: [ "Ultra HD Resolution", "One-time Purchase"],
      color: "amber",
      priceTag: "Lowest Price Guaranteed"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20 pt-40">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Our Services</h2>
          <h1 className="text-6xl font-serif text-[#0F172A] leading-tight">
            Comprehensive solutions for <span className="italic text-slate-400">modern creators.</span>
          </h1>
          <p className="mt-6 text-slate-500 text-lg leading-relaxed">
            We bridge the gap between digital excellence and physical quality, 
            offering premium assets and services at accessible prices.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col"
            >
              <div className="mb-8 p-4 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-serif mb-4 text-[#0F172A]">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>

              <ul className="space-y-3 mb-10">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 size={16} className="text-slate-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pricing</p>
                  <p className="font-bold text-[#0F172A]">{service.priceTag}</p>
                </div>
                <Link 
                  href={
                     service.id === 'stock-assets' ? '/services/stocks' : 
                     service.id === 'printing' ? '/services/printing' : 
                    '/services/development' 
                                }
                  className="bg-[#0F172A] text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition Strip */}
        <div className="mt-20 bg-[#0F172A] rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl"><Zap className="text-blue-400" size={24}/></div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Fast</p>
                <p className="font-bold">Turnaround</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl"><Globe className="text-emerald-400" size={24}/></div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Global</p>
                <p className="font-bold">Standards</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl"><Layers className="text-amber-400" size={24}/></div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Quality</p>
                <p className="font-bold">Guaranteed</p>
              </div>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all">
            Start a Project
          </button>
        </div>

        {/* Stock Highlight Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] aspect-square object-cover" alt="Service Preview" />
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] aspect-square object-cover mt-8" alt="Service Preview" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 hidden md:block">
                    <p className="text-4xl font-serif text-blue-600 mb-1">90%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cheaper than competitors</p>
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-serif text-[#0F172A] mb-6">Why our Stock Assets?</h2>
                <p className="text-slate-500 leading-relaxed mb-8">
                    Stop overpaying for stock photos. We provide high-resolution, commercially licensed assets 
                    shot by local creators at a fraction of the cost of global agencies. 
                    Perfect for startups and local businesses.
                </p>
                <Link href="/" className="inline-flex items-center gap-3 text-blue-600 font-bold uppercase text-xs tracking-widest group">
                    Browse Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}