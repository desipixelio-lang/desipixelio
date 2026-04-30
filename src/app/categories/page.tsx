"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, ShoppingCart, ChevronDown, User, 
  ArrowRight, Loader2, Grid2X2, Layers
} from 'lucide-react';

export default function AllCategoriesPage() {
  const { user } = useAuth();
  
  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC", 
    coolGray: "#94A3B8" 
  };

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchAllCategories() {
      setLoading(true);
      try {
        // Fetch all categories sorted by name
        const q = query(collection(db, "categories"), orderBy("name", "asc"));
        const snap = await getDocs(q);
        setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllCategories();
  }, []);

  // Filter categories based on search input
  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed h-20 top-0 w-full z-[80] px-6 md:px-12 py-6 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" 
            alt="DesiPixelio" 
            className="h-18 w-auto"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
           <Link href="/about" className="hover:text-blue-500 transition">About Us</Link>
          <Link href="/categories" className="text-blue-500 underline underline-offset-8 decoration-2">Categories</Link>
          <Link href="/collections" className="hover:text-blue-500 transition">Collections</Link>
          <Link href="/pricing" className="hover:text-blue-500 transition">Pricing</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative group hover:text-blue-500 transition-colors">
            <ShoppingCart size={22} />
          </Link>
          {user ? (
            <Link href="/profile" className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden">
               <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-full h-full object-cover" alt="" />
            </Link>
          ) : (
            <Link href="/login" style={{ backgroundColor: PALETTE.electric }} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Login</Link>
          )}
        </div>
      </nav>

      {/* --- HERO / SEARCH --- */}
      <section className="pt-48 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif mb-6">Visual <span style={{ color: PALETTE.electric }}>Index</span></h1>
          <p style={{ color: PALETTE.coolGray }} className="text-[10px] font-black uppercase tracking-[0.4em] mb-12">Browse through {categories.length} Heritage Categories</p>
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20}/>
            <input 
              type="text" 
              placeholder="Find a specific category..." 
              style={{ backgroundColor: PALETTE.slate }}
              className="w-full border border-white/10 rounded-2xl py-5 pl-14 pr-8 text-sm focus:border-blue-500 outline-none transition-all shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- CATEGORIES GRID (WHITISH TONE) --- */}
      <div style={{ backgroundColor: PALETTE.offWhite }} className="rounded-t-[5rem] text-slate-900 py-24 px-6 md:px-12 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40}/>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Index...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/categories/${cat.name.toLowerCase()}`}
                  className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-2xl hover:border-blue-500 transition-all duration-500 flex flex-col justify-between min-h-[180px]"
                >
                  <div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Layers size={24} />
                    </div>
                    <h3 className="text-2xl font-serif capitalize group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">View Collection</span>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-40">
              <p className="text-slate-400 font-black uppercase tracking-widest">No matching categories found</p>
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer style={{ backgroundColor: PALETTE.midnight }} className="pt-32 pb-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
          <div className="md:col-span-2">
            <img src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" className="h-7 w-auto mb-8 mx-auto md:mx-0" alt="Logo" />
            <p style={{ color: PALETTE.coolGray }} className="text-xs leading-relaxed max-w-sm mx-auto md:mx-0">The ultimate visual index for authentic Indian media. Search through hundreds of curated cultural categories.</p>
          </div>
          <div>
            <h5 className="text-[11px] font-black uppercase tracking-widest mb-8 text-white">Resources</h5>
            <ul style={{ color: PALETTE.coolGray }} className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
              <li><Link href="/collections" className="hover:text-blue-500">Collections</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-500">Pricing</Link></li>
              <li><Link href="/help" className="hover:text-blue-500">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] font-black uppercase tracking-widest mb-8 text-white">Company</h5>
            <ul style={{ color: PALETTE.coolGray }} className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-blue-500">About Us</Link></li>
              <li><Link href="/licensing" className="hover:text-blue-500">Licensing</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
          © 2026 DesiPixelio  • Crafted with ❤️ in Jaipur
        </div>
      </footer>
    </div>
  );
}