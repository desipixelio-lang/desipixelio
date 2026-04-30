"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CreditCard, Download, BookOpen } from 'lucide-react';

export default function HelpTopicPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Content Mapping
  const content: any = {
    billing: { title: "Billing & Wallet", icon: <CreditCard size={48}/>, text: "All transactions on DesiPixelio are processed via Razorpay. Your wallet balance is stored securely in your encrypted profile." },
    licensing: { title: "Licensing Rights", icon: <ShieldCheck size={48}/>, text: "Images are sold under a Royalty-Free license. This means you pay once and can use the image multiple times for the defined scope." },
    downloads: { title: "Download Help", icon: <Download size={48}/>, text: "If a download fails, please check your 'My Downloads' section in your profile. You can re-download any purchased item for free." },
    contribute: { title: "Contributor Hub", icon: <BookOpen size={48}/>, text: "We accept high-resolution heritage photography. Contributors earn 60% commission on every sale made through the platform." }
  };

  const data = content[slug as string] || content.billing;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8 md:p-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-20 text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft size={20}/> Back to Help Center
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="text-blue-500 mb-10">{data.icon}</div>
        <h1 className="text-6xl font-serif mb-8">{data.title}</h1>
        <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] leading-relaxed text-slate-300 text-lg">
          {data.text}
          <div className="mt-12 pt-12 border-t border-white/10">
            <h4 className="text-white font-bold mb-4">Still need help with this?</h4>
            <Link href="/help" className="text-blue-500 underline underline-offset-8 font-black uppercase text-[10px] tracking-widest">Speak to an expert →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}