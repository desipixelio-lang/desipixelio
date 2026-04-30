"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Download, Loader2, Camera, MapPin, X } from 'lucide-react';

export default function CollectionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch Collection Title/Desc
        const docRef = doc(db, "collections", String(id));
        const snap = await getDoc(docRef);
        if (snap.exists()) setMeta(snap.data());

        // Fetch Assets where collectionId == current page ID
        const q = query(collection(db, "assets"), where("collectionId", "==", id));
        const assetSnap = await getDocs(q);
        setImages(assetSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <header className="fixed top-0 w-full z-50 p-6 bg-[#0F172A]/80 backdrop-blur-md flex justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16}/> Back</button>
        <h2 className="font-serif italic text-blue-500">{meta?.title}</h2>
      </header>

      <main className="pt-40 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mb-16">
          <div className="flex items-center gap-2 text-blue-500 mb-4 text-[10px] font-black uppercase"><MapPin size={14}/> {meta?.location}</div>
          <h1 className="text-6xl font-serif mb-6">{meta?.title}</h1>
          <p className="text-slate-400 leading-relaxed">{meta?.description}</p>
        </div>

        <div className="bg-[#F8FAFC] rounded-[4rem] p-12 min-h-[40vh]">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
          ) : images.length > 0 ? (
            <div className="columns-2 md:columns-4 gap-6 space-y-6">
              {images.map(img => (
                <div key={img.id} onClick={() => setSelected(img)} className="rounded-3xl overflow-hidden cursor-pointer bg-white shadow-md hover:shadow-2xl transition-all break-inside-avoid">
                  <img src={img.preview_url} className="w-full h-auto" alt="" />
                  <div className="p-4 text-slate-900 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase truncate">{img.title}</span>
                    <span className="text-blue-600 font-black text-xs">₹{img.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-black uppercase italic">No assets linked to this collection ID yet.</div>
          )}
        </div>
      </main>

      {/* Modal Preview */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-[#1E293B] rounded-[3rem] overflow-hidden max-w-lg w-full shadow-2xl">
            <img src={selected.preview_url} className="w-full h-auto max-h-[60vh] object-cover" />
            <div className="p-8">
              <h2 className="text-2xl font-serif mb-6">{selected.title}</h2>
              <button className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Buy Now - ₹{selected.price}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}