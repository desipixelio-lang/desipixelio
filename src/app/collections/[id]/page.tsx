"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, where, doc, getDoc, 
  setDoc, serverTimestamp, onSnapshot 
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, Loader2, MapPin, 
  CheckCircle2, ShoppingBag, ListChecks, Info, Eye, X
} from 'lucide-react';

export default function CollectionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [images, setImages] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setUserData(snap.data());
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "collections", String(id));
        const snap = await getDoc(docRef);
        if (snap.exists()) setMeta(snap.data());

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

  const selectedItems = useMemo(() => 
    images.filter(img => selectedIds.includes(img.id)), 
  [selectedIds, images]);

  const newItemsToBuy = useMemo(() => 
    selectedItems.filter(item => !userData?.purchasedAssets?.includes(item.id)),
  [selectedItems, userData]);

  const totalPrice = newItemsToBuy.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const toggleSelect = (imgId: string) => {
    setSelectedIds(prev => 
      prev.includes(imgId) ? prev.filter(id => id !== imgId) : [...prev, imgId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === images.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(images.map(img => img.id));
    }
  };

  const handleBulkAddToCart = async () => {
    if (!user) return router.push('/login');
    if (selectedIds.length === 0) return;

    setIsAdding(true);
    try {
      for (const item of selectedItems) {
        if (userData?.purchasedAssets?.includes(item.id)) continue;

        const cartId = `${user.uid}_${item.id}`;
        await setDoc(doc(db, "cart", cartId), {
          userId: user.uid,
          assetId: item.id,
          title: item.title,
          price: item.price,
          preview_url: item.preview_url,
          original_url: item.original_url || item.preview_url,
          addedAt: serverTimestamp()
        });
      }
      router.push('/cart');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <header className="fixed top-0 w-full z-50 p-4 md:p-6 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition">
          <ArrowLeft size={16}/> Back
        </button>
        <h2 className="font-serif italic text-blue-500 text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{meta?.title}</h2>
      </header>

      <main className="pt-32 md:pt-40 pb-48 px-4 md:px-12">
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-2 text-blue-500 mb-4 text-[10px] font-black uppercase">
            <MapPin size={14}/> {meta?.location || "India"}
          </div>
          <h1 className="text-4xl md:text-7xl font-serif mb-6 leading-tight">{meta?.title}</h1>
          <p className="text-slate-400 leading-relaxed text-sm md:text-lg">{meta?.description}</p>
          
          {!loading && images.length > 0 && (
            <button 
                onClick={handleSelectAll}
                className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/10"
            >
                <ListChecks size={14} className="text-blue-500" />
                {selectedIds.length === images.length ? "Deselect All" : "Select All Collection"}
            </button>
          )}
        </div>

        <div className="bg-[#F8FAFC] rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 min-h-[50vh]">
          {loading ? (
             <div className="flex justify-center py-32"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
          ) : (
            <div className="columns-2 lg:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
              {images.map(img => {
                const isSelected = selectedIds.includes(img.id);
                const isOwned = userData?.purchasedAssets?.includes(img.id);
                return (
                  <div 
                    key={img.id} 
                    className={`group relative rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 break-inside-avoid border-4 ${isSelected ? 'border-blue-500 scale-[1.02]' : 'border-transparent bg-white shadow-sm'} ${isOwned ? 'opacity-70 grayscale-[0.5]' : ''}`}
                  >
                    <div onClick={() => toggleSelect(img.id)}>
                      <img src={img.preview_url} className="w-full h-auto" alt="" />
                    </div>
                    
                    {/* Preview Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPreview(img.preview_url);
                      }}
                      className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-black/50 hover:bg-black/70 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye size={16} />
                    </button>

                    {isOwned && (
                      <div className="absolute top-2 left-12 md:top-4 md:left-14 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[8px] font-black text-slate-900 uppercase">Owned</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 md:top-4 md:right-4">
                        {isSelected && <div className="bg-blue-500 text-white p-1 md:p-2 rounded-full shadow-lg"><CheckCircle2 size={16} /></div>}
                    </div>

                    <div className="p-4 md:p-6 text-slate-900 bg-white" onClick={() => toggleSelect(img.id)}>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-black uppercase truncate">{img.title}</span>
                        <span className={`font-black text-xs ${isOwned ? 'text-slate-400 line-through' : 'text-blue-600'}`}>₹{img.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* FULL IMAGE PREVIEW MODAL */}
      {selectedPreview && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedPreview(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition">
            <X size={32} />
          </button>
          <img 
            src={selectedPreview} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            alt="Preview" 
          />
        </div>
      )}

      {/* RESPONSIVE FLOATING ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-3xl animate-in slide-in-from-bottom-10">
            <div className="bg-[#0F172A] border border-white/10 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                
                <div className="flex items-center justify-between w-full md:w-auto md:border-r md:border-white/10 md:pr-6 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500"><ShoppingBag size={20} /></div>
                      <div>
                          <p className="text-slate-500 text-[8px] font-black uppercase">Selection</p>
                          <h4 className="text-sm md:text-lg font-serif">{selectedIds.length} Assets</h4>
                      </div>
                    </div>
                    {newItemsToBuy.length < selectedIds.length && (
                      <div className="text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                        <Info size={10} /> {selectedIds.length - newItemsToBuy.length} Already Owned
                      </div>
                    )}
                </div>

                <div className="flex items-center justify-between w-full md:flex-1">
                    <div className="md:ml-4">
                        <p className="text-slate-500 text-[8px] font-black uppercase">Total Charge</p>
                        <h4 className="text-lg md:text-2xl font-serif text-amber-500">₹{totalPrice.toLocaleString('en-IN')}</h4>
                    </div>
                    
                    <button 
                        disabled={isAdding}
                        onClick={handleBulkAddToCart}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase text-[9px] md:text-[11px] tracking-widest transition-all active:scale-95"
                    >
                        {isAdding ? <Loader2 className="animate-spin" /> : "Move to Cart"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}