"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, ArrowRight, Check, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Password Criteria Logic
  const criteria = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
    match: formData.password === formData.confirmPassword && formData.password !== ''
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criteria.length || !criteria.number || !criteria.special || !criteria.match) {
      alert("Please meet all password requirements.");
      return;
    }
    
    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      router.push('/'); // Redirect to Home after success
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-amber-500 items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-7xl font-serif text-black leading-tight mb-6">India's <br/> Finest <br/> <span className="text-white underline">Pixels.</span></h1>
          <p className="text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <ShieldCheck size={16} /> Secure Registration for Creators
          </p>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-serif mb-2">Join DesiPixelio</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Start your visual journey today</p>
          </div>

          {/* COLORFUL GOOGLE BUTTON */}
          <button 
            onClick={handleGoogle}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl mb-8 group"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-xs uppercase tracking-widest">Sign up with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-900 flex-1"></div>
            <span className="text-[10px] text-gray-700 font-bold uppercase">or Email</span>
            <div className="h-px bg-gray-900 flex-1"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-600" size={18}/>
              <input required type="text" placeholder="Full Name" className="w-full bg-[#0a0a0a] border border-gray-900 p-4 pl-12 rounded-2xl focus:border-amber-500 outline-none transition text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-600" size={18}/>
              <input required type="email" placeholder="Email Address" className="w-full bg-[#0a0a0a] border border-gray-900 p-4 pl-12 rounded-2xl focus:border-amber-500 outline-none transition text-sm" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-600" size={18}/>
              <input required type="password" placeholder="Create Password" className="w-full bg-[#0a0a0a] border border-gray-900 p-4 pl-12 rounded-2xl focus:border-amber-500 outline-none transition text-sm" onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-600" size={18}/>
              <input required type="password" placeholder="Confirm Password" className="w-full bg-[#0a0a0a] border border-gray-900 p-4 pl-12 rounded-2xl focus:border-amber-500 outline-none transition text-sm" onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>

            {/* PASSWORD CRITERIA INFO */}
            <div className="grid grid-cols-2 gap-2 py-4">
              <CriteriaItem met={criteria.length} text="8+ Characters" />
              <CriteriaItem met={criteria.number} text="Include Number" />
              <CriteriaItem met={criteria.special} text="Special Symbol" />
              <CriteriaItem met={criteria.match} text="Passwords Match" />
            </div>

            <button disabled={loading} className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-2xl shadow-amber-500/10">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={16}/></>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-10">
            Already a member? <Link href="/login" className="text-amber-500 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function CriteriaItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter ${met ? 'text-emerald-500' : 'text-gray-700'}`}>
      {met ? <Check size={12}/> : <X size={12}/>} {text}
    </div>
  );
}