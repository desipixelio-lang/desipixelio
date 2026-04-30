"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingCart, ChevronDown, X, ChevronRight, Menu, 
  Globe, Printer, Image as ImageIcon, Zap, Search, ArrowRight 
} from 'lucide-react';

export default function Navbar({ categories }: { categories: string[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!user?.uid) {
      setCartCount(0);
      return;
    }
    const q = query(collection(db, "cart"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCartCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <>
      

      <nav className="fixed h-20 top-0 w-full z-[100] px-6 md:px-18 py-5 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition">
            <Menu size={22} className="text-white" />
          </button>
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" 
              alt="Logo" 
              className="h-18 md:h-18 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <Link href="/about" className="hover:text-blue-500 transition">About Us</Link>
          <div className="relative group">
            <Link href="/services" className="flex items-center gap-1 cursor-pointer hover:text-blue-500 py-2">
              Services <ChevronDown size={14}/>
            </Link>
            <div className="absolute top-full left-0 w-64 bg-[#1E293B] border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-3 shadow-2xl">
              <Link href="/services/stocks" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 rounded-xl transition-all mb-1 font-bold"><ImageIcon size={16} /> Stock Media</Link>
              <Link href="/services/development" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 rounded-xl transition-all mb-1 font-bold"><Globe size={16} /> Web & App Dev</Link>
              <Link href="/services/printing" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 rounded-xl transition-all mb-1 font-bold"><Printer size={16} /> Printing Jobs</Link>
            </div>
          </div>
          <div className="relative group">
            <span className="flex items-center gap-1 cursor-pointer hover:text-blue-500 py-2">Categories <ChevronDown size={14}/></span>
            <div className="absolute top-full left-0 w-56 bg-[#1E293B] border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-3 shadow-2xl">
              {categories.map(cat => (
                <Link key={cat} href={`/categories/${cat.toLowerCase()}`} className="block px-4 py-3 hover:bg-blue-600 rounded-xl transition-all mb-1 font-bold">{cat}</Link>
              ))}
              <hr className="border-white/5 my-2" />
              <Link href="/categories" className="flex items-center justify-between px-4 py-3 text-blue-400 font-black hover:text-white transition-colors uppercase text-[9px]">All Categories <ArrowRight size={14}/></Link>
            </div>
          </div>
          <Link href="/collections" className="hover:text-blue-500 transition">Collections</Link>
          <Link href="/pricing" className="hover:text-blue-500 transition">Pricing</Link>
        </div>

        <div className="flex items-center gap-5 text-white">
          <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#F59E0B] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0F172A]">{cartCount}</span>
            )}
          </Link>
          {!user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition">Login</Link>
              <Link href="/register" className="bg-[#2563EB] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition">Sign Up</Link>
            </div>
          ) : (
            <Link href="/profile" className="flex items-center gap-3 pl-2 border-l border-white/10 group">
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden transition-transform group-hover:scale-105">
                 <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-full h-full rounded-full object-cover" alt="Profile" />
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeMenu}/>
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#0F172A] border-r border-white/5 p-6 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <img src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" className="h-10 w-auto" alt="Logo" />
              <button onClick={closeMenu} className="p-2 bg-white/10 rounded-full text-white active:scale-90 transition"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-10 text-white">
              <Link href="/about" className="py-4 text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5 flex items-center justify-between" onClick={closeMenu}>About Us <ChevronRight size={14} /></Link>
              <div className="py-2 border-b border-white/5 text-white">
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-4 mt-2">Core Services</p>
                <div className="grid gap-3">
                  <Link href="/services/stocks" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl" onClick={closeMenu}><ImageIcon size={18} className="text-blue-500"/> <span className="text-[10px] font-bold uppercase">Stock Media</span></Link>
                  <Link href="/services/development" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl" onClick={closeMenu}><Globe size={18} className="text-amber-500"/> <span className="text-[10px] font-bold uppercase">Web & App Dev</span></Link>
                  <Link href="/services/printing" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl" onClick={closeMenu}><Printer size={18} className="text-emerald-500"/> <span className="text-[10px] font-bold uppercase">Printing Hub</span></Link>
                </div>
              </div>
              <div className="py-6 border-b border-white/5">
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-4">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <Link key={cat} href={`/categories/${cat.toLowerCase()}`} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-bold uppercase text-center" onClick={closeMenu}>{cat}</Link>
                  ))}
                </div>
              </div>
              <Link href="/collections" className="py-5 text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5 flex items-center justify-between" onClick={closeMenu}>Collections <ChevronRight size={14} /></Link>
              <Link href="/pricing" className="py-5 text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5 flex items-center justify-between" onClick={closeMenu}>Pricing Plans <ChevronRight size={14} /></Link>
              <div className="mt-8 space-y-4">
                {!user ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/login" className="py-4 text-center text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-2xl" onClick={closeMenu}>Login</Link>
                    <Link href="/register" className="py-4 text-center text-[10px] font-black uppercase tracking-widest rounded-2xl bg-[#2563EB]" onClick={closeMenu}>Sign Up</Link>
                  </div>
                ) : (
                  <Link href="/profile" className="flex items-center justify-center gap-3 p-5 bg-zinc-900 border border-white/5 rounded-[2rem]" onClick={closeMenu}><Zap size={16} className="text-amber-500" /> <span className="text-[10px] font-black uppercase tracking-[0.3em]">Profile</span></Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}