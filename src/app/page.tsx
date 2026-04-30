"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, orderBy, limit, 
  doc, setDoc, serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, Download, Loader2, ArrowRight, Plus, 
  Globe, Printer, Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';

export default function DesiPixelioHome() {
  const { user } = useAuth();
  const router = useRouter();
  
  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC"
  };

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<any>(null);

  const optimize = (url: string, w: number) => {
    if (!url) return "";
    return url.replace('/upload/', `/upload/c_scale,w_${w},q_auto:good,f_auto/`);
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      try {
        const q = query(collection(db, "assets"), orderBy("createdAt", "desc"), limit(40));
        const snap = await getDocs(q);
        if (isMounted) {
          setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Firebase Initialization Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => { isMounted = false; };
  }, []);

  const handleAddToCart = async (img: any, redirect = false) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const cartId = `${user.uid}_${img.id}`;
      await setDoc(doc(db, "cart", cartId), {
        userId: user.uid,
        assetId: img.id,
        title: img.title,
        price: img.price,
        preview_url: img.preview_url,
        addedAt: serverTimestamp()
      });
      if (redirect) router.push('/cart');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredGallery = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return searchQuery ? images.filter(i => 
      i.title?.toLowerCase().includes(q) || 
      i.tags?.some((t: string) => t.toLowerCase().includes(q))
    ) : images;
  }, [searchQuery, images]);

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* --- HERO --- */}
      <section className="pt-48 pb-24 px-6 relative flex flex-col items-center justify-center min-h-[80vh] text-center overflow-hidden">
        <img src={optimize("https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777203311/WhatsApp_Image_2026-04-26_at_17.01.38_yjrdzx.jpg", 1200)} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50" alt="Hero Background" />
        <div style={{ background: `linear-gradient(to bottom, ${PALETTE.midnight}00, ${PALETTE.midnight})` }} className="absolute inset-0"></div>
        <div className="relative z-10 w-full max-w-5xl px-4">
          <h1 className="text-5xl md:text-[7.5rem] font-serif mb-8 leading-none tracking-tight">Vibrant <span className="text-blue-500 italic">Pixels</span><br/>Modern Soul.</h1>
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={24}/>
            <input type="text" placeholder="Search heritage, festivals, or architecture..." style={{ backgroundColor: PALETTE.slate }} className="w-full border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-lg focus:border-blue-500 outline-none transition-all shadow-2xl" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <div id="gallery-start" style={{ backgroundColor: PALETTE.offWhite }} className="rounded-t-[4rem] text-slate-900 py-20 px-6 md:px-12 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-serif">Latest Releases</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Curated heritage media</p>
            </div>
            <Link href="/categories" className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:gap-3 transition-all">Explore All <ArrowRight size={14}/></Link>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40}/><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Refreshing library...</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
              {filteredGallery.map(img => (
                <div key={img.id} onClick={() => setPreviewImage(img)} className="relative rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid bg-white shadow-sm hover:shadow-2xl transition-all duration-700 active:scale-95">
                  <img src={img.preview_url ? optimize(img.preview_url, 500) : '/placeholder.jpg'} loading="lazy" className="w-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={img.title || "Asset"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4">
                    <p className="text-white text-[10px] font-black truncate uppercase tracking-widest">{img.title || "Untitled"}</p>
                    <p style={{ color: PALETTE.amber }} className="text-[11px] font-black mt-1 italic">₹{img.price ? Number(img.price).toLocaleString('en-IN') : '0'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- SERVICES CARDS --- */}
        <section className="max-w-7xl mx-auto pt-32 pb-12">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-[#0F172A]">Our Specialized Services</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <Link href="/services/stocks" className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500"><ImageIcon size={32} /></div>
                <h3 className="text-2xl font-serif text-[#0F172A] mb-4">Stock Media Hub</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">Access real stock images from 40+ global platforms at competitive prices.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Acquire Assets <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></div>
              </Link>
              <Link href="/services/development" className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500"><Globe size={32} /></div>
                <h3 className="text-2xl font-serif text-[#0F172A] mb-4">Digital Development</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">Specializing in Next.js web applications and custom software systems.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600">Consultation <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></div>
              </Link>
              <Link href="/services/printing" className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500"><Printer size={32} /></div>
                <h3 className="text-2xl font-serif text-[#0F172A] mb-4">Print Operations</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">High-quality commercial printing for examination papers and marksheets.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">Order Printing <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></div>
              </Link>
           </div>
        </section>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {previewImage && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setPreviewImage(null)} />
          <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
            <div style={{ backgroundColor: PALETTE.slate }} className="rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
              <img src={previewImage.preview_url ? optimize(previewImage.preview_url, 800) : ""} className="w-full h-auto max-h-[50vh] object-cover" alt="" />
              <div className="p-10">
                <h2 className="text-3xl font-serif mb-2 tracking-tight">{previewImage.title || "Untitled"}</h2>
                <p style={{ color: PALETTE.amber }} className="text-2xl font-black mb-8 italic">₹{previewImage.price ? Number(previewImage.price).toLocaleString('en-IN') : '0'}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleAddToCart(previewImage, true)} style={{ backgroundColor: PALETTE.electric }} className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition shadow-lg">
                    <Download size={18} /> Buy & Download Now
                  </button>
                  <button onClick={() => handleAddToCart(previewImage)} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition">
                    <Plus size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}