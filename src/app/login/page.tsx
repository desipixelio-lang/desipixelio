"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, login, loginWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();

  const LOGO_URL = "https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png";

  // --- AUTOMATIC REDIRECT IF LOGGED IN ---
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      alert("Invalid login credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      alert("Google Sign-In failed. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row">
      
      {/* LEFT SIDE: Visual Storytelling */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-zinc-900 overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777432752/ChatGPT_Image_Apr_28_2026_09_18_01_PM_cmxy0h.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" 
          alt="Indian Heritage" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent"></div>
        
        <div className="relative z-10 p-20 max-w-xl">
          {/* BRAND LOGO */}
          <div className="mb-10 flex items-center gap-4">
            <img 
              src={LOGO_URL} 
              alt="DesiPixelio Logo" 
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
            />
           
          </div>

          <h1 className="text-6xl font-serif leading-tight mb-6">
            Capture the <br /> <span className="text-amber-500 italic">Essence</span> of India.
          </h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
            Access the world's most exclusive collection of high-resolution AI-generated heritage media. Professional quality for global creators.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Interface */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-20 relative">
        <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="w-full max-w-md">
          {/* MOBILE LOGO (Only shows on mobile) */}
          <div className="lg:hidden flex justify-center mb-8">
             <img src={LOGO_URL} alt="Logo" className="w-18 h-18 object-contain" />
          </div>

          <header className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-serif mb-3">Sign In</h2>
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">Authorized Access Portal</p>
          </header>

          {/* GOOGLE LOGIN */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-100 transition-all shadow-xl mb-8 group active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-[10px] uppercase tracking-widest">Sign in with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-10">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[10px] text-gray-700 font-black uppercase tracking-widest">or email</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} className="text-amber-500" /> Email Address
              </label>
              <input 
                required 
                type="email" 
                placeholder="manager@desipixelio.com"
                className="w-full bg-black border border-white/5 p-4 rounded-2xl focus:border-amber-500 outline-none transition text-sm text-white font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={12} className="text-amber-500" /> Password
              </label>
              <input 
                required 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-black border border-white/5 p-4 rounded-2xl focus:border-amber-500 outline-none transition text-sm text-white font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-amber-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify & Enter <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-12 font-medium">
            New to the library? {' '}
            <Link href="/register" className="text-amber-500 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      
    </div>
  );
}