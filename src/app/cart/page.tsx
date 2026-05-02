"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  doc, 
  updateDoc, 
  increment, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  arrayUnion 
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Trash2, Wallet, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    // 1. Listen to User Data
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (d) => {
      setUserData(d.data());
    });

    // 2. Listen to Cart Items
    const q = query(collection(db, "cart"), where("userId", "==", user.uid));
    const unsubCart = onSnapshot(q, (snap) => {
      setCartItems(snap.docs.map(d => ({ cartId: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubUser(); unsubCart(); };
  }, [user]);

  const walletBalance = userData?.walletBalance || 0;
  const downloadBalance = userData?.downloadBalance || 0;
  
  // Filter out items already owned
  const newItemsOnly = cartItems.filter(item => !userData?.purchasedAssets?.includes(item.assetId || item.id));
  
  // Logic: Use credits if available for ALL items, otherwise use wallet balance
  const hasEnoughCredits = downloadBalance >= newItemsOnly.length && newItemsOnly.length > 0;
  const totalCost = hasEnoughCredits ? 0 : newItemsOnly.reduce((acc, item) => acc + (item.price || 0), 0);

  const handlePurchase = async () => {
    if (newItemsOnly.length === 0 && cartItems.length > 0) {
        // Handle case where user is just clearing already owned items from cart
        setPurchasing(true);
        try {
            for (const item of cartItems) {
                await deleteDoc(doc(db, "cart", item.cartId));
            }
            router.push('/profile');
            return;
        } catch (e) { console.error(e); } 
        finally { setPurchasing(false); return; }
    }

    // Check affordability
    if (!hasEnoughCredits && walletBalance < totalCost) {
      alert("Insufficient Balance. Please add credits or top up your wallet.");
      router.push('/pricing');
      return;
    }

    setPurchasing(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      // DEDUCTION LOGIC:
      // If we have credits, deduct credits. If not, deduct from wallet.
      if (hasEnoughCredits) {
        await updateDoc(userRef, {
          downloadBalance: increment(-newItemsOnly.length)
        });
      } else {
        await updateDoc(userRef, {
          walletBalance: increment(-totalCost)
        });
      }

      // Process items
      for (const item of cartItems) {
        const finalAssetId = item.assetId || item.id;

        // If not already owned, record the purchase
        if (!userData?.purchasedAssets?.includes(finalAssetId)) {
            await addDoc(collection(db, "purchases"), {
                userId: user.uid,
                assetId: finalAssetId,
                title: item.title || "Untitled Asset",
                url: item.original_url || item.preview_url || "", 
                purchasedAt: new Date()
            });

            await updateDoc(userRef, {
                purchasedAssets: arrayUnion(finalAssetId)
            });
        }

        // Always remove from cart after processing
        await deleteDoc(doc(db, "cart", item.cartId));
      }

      alert("Transaction finished successfully!");
      router.push('/profile'); 
    } catch (err) {
      console.error("Purchase Error:", err);
      alert("Transaction failed.");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-8 pt-40">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2">
          <h1 className="text-5xl font-serif mb-12 flex items-center gap-4 text-[#0F172A]">
            <ShoppingBag className="text-blue-600" /> Checkout
          </h1>
          
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => {
                const isOwned = userData?.purchasedAssets?.includes(item.assetId || item.id);
                return (
                  <div key={item.cartId} className={`bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-6 border border-slate-100 group ${isOwned ? 'opacity-60 grayscale' : ''}`}>
                    <img src={item.preview_url} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                    <div className="flex-grow">
                      <h3 className="font-serif text-xl">{item.title}</h3>
                      {isOwned ? (
                        <div className="flex items-center gap-2 mt-2 text-blue-600">
                          <Info size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Already in Library</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mt-1">
                            <p className={`text-sm font-black ${hasEnoughCredits ? 'text-slate-400 line-through' : 'text-blue-600'}`}>₹{item.price}</p>
                            {hasEnoughCredits && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Using Credit</span>}
                        </div>
                      )}
                    </div>
                    <button onClick={async () => await deleteDoc(doc(db, "cart", item.cartId))} className="p-4 text-slate-300 hover:text-red-500 transition">
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="font-black uppercase tracking-widest text-slate-400">Cart is empty</p>
              <Link href="/" className="mt-6 inline-block text-blue-600 font-bold">Explore Assets →</Link>
            </div>
          )}
        </div>

        <div className="bg-[#0F172A] text-white p-10 rounded-[3rem] h-fit sticky top-40 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Summary</h2>
          
          <div className="space-y-4 mb-10 pb-10 border-b border-white/10">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Items</span>
                <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Credits Required</span>
                <span className="text-blue-400">{newItemsOnly.length}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold pt-4">
                <span>Total Cost</span>
                <span className={hasEnoughCredits ? "text-emerald-400" : ""}>
                    {hasEnoughCredits ? "0 Credits" : `₹${totalCost}`}
                </span>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-slate-500">Your Wallet</span>
                <span>₹{walletBalance}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-slate-500">Your Credits</span>
                <span className="text-blue-400">{downloadBalance}</span>
            </div>
          </div>

          {newItemsOnly.length === 0 && cartItems.length > 0 ? (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
              <Info className="text-blue-500 shrink-0" size={16} />
              <p className="text-[9px] leading-relaxed text-blue-200 uppercase font-bold tracking-wider">
                  All items in your cart are already owned. Confirming will clear your cart.
              </p>
            </div>
          ) : hasEnoughCredits ? (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                <p className="text-[9px] leading-relaxed text-emerald-200 uppercase font-bold tracking-wider">
                    Using available credits for this purchase.
                </p>
              </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={16} />
                <p className="text-[9px] leading-relaxed text-amber-200 uppercase font-bold tracking-wider">
                    {downloadBalance === 0 ? "No credits available. Wallet will be used." : "Not enough credits for all items. Wallet will be used."}
                </p>
            </div>
          )}

          <button 
            disabled={
                cartItems.length === 0 || 
                purchasing || 
                (!hasEnoughCredits && walletBalance < totalCost)
            }
            onClick={handlePurchase}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
          >
            {purchasing ? <Loader2 className="animate-spin mx-auto"/> : "Confirm Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}