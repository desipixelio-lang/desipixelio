"use client";

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Script from 'next/script';
import { 
  CheckCircle2, Zap, Crown, 
  Rocket, Loader2
} from 'lucide-react';

export default function PricingPage() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
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
      price: 199,
      limitValue: 29, // Numerical value for database
      limit: "29 Images",
      desc: "Perfect for social media creators and small blogs.",
      icon: <Zap className="text-blue-400" size={28} />,
      features: ["Standard License", "HD Resolution", "7-Day Expiry", "Email Support"],
      button: "Start Creating",
      featured: false
    },
    {
      name: "Pro Storyteller",
      price: 699,
      limitValue: 69,
      limit: "69 Images",
      desc: "The most popular choice for digital agencies and designers.",
      icon: <Rocket className="text-amber-500" size={28} />,
      features: ["Enhanced License", "4K High-Res", "No Expiry", "Priority Support", "Collection Access"],
      button: "Get Pro Access",
      featured: true
    },
    {
      name: "Agency Elite",
      price: 1399,
      limitValue: 109,
      limit: "109 Images",
      desc: "Bulk high-fidelity assets for large scale campaigns.",
      icon: <Crown className="text-purple-400" size={28} />,
      features: ["Full Commercial Rights", "RAW Files Included", "Multi-User Access", "Dedicated Manager", "Early Access"],
      button: "Join The Elite",
      featured: false
    }
  ];

  const handleSubscription = async (plan: typeof plans[0]) => {
    if (!user) return alert("Please login to purchase a plan.");
    setLoadingPlan(plan.name);

    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "DesiPixelio",
        description: `Purchase ${plan.name} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // Update user's download balance in Firestore
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            downloadBalance: increment(plan.limitValue),
            currentPlan: plan.name,
            lastPurchase: new Date()
          });
          alert(`Success! ${plan.limitValue} downloads added to your account.`);
        },
        prefill: { email: user?.email },
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <section className="pt-64 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-[7rem] font-serif mb-8 tracking-tighter leading-none">Simple <span className="italic text-blue-500">Pricing</span></h1>
        <p style={{ color: PALETTE.coolGray }} className="text-[12px] font-black uppercase tracking-[0.5em] max-w-xl mx-auto leading-loose">
          Select a plan that fits your creative journey.
        </p>
      </section>

      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              style={{ backgroundColor: plan.featured ? "#1E293B" : "rgba(30, 41, 59, 0.4)" }}
              className={`relative p-10 rounded-[3.5rem] border transition-all duration-500 group flex flex-col ${plan.featured ? 'border-blue-500 shadow-[0_0_80px_rgba(37,99,235,0.15)] scale-105 z-10' : 'border-white/5 hover:border-white/20'}`}
            >
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
                disabled={loadingPlan === plan.name}
                onClick={() => handleSubscription(plan)}
                style={{ backgroundColor: plan.featured ? PALETTE.electric : "white" }}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-2xl ${plan.featured ? 'text-white' : 'text-black hover:bg-blue-50'} flex justify-center items-center`}
              >
                {loadingPlan === plan.name ? <Loader2 className="animate-spin" size={18} /> : plan.button}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}