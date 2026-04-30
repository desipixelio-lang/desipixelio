"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Trash2, Wallet, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    // 1. Get Wallet Balance
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (d) => {
      setWalletBalance(d.data()?.walletBalance || 0);
    });

    // 2. Get Cart Items (Assumes you have a 'cart' collection where userId == user.uid)
    const q = query(collection(db, "cart"), where("userId", "==", user.uid));
    const unsubCart = onSnapshot(q, (snap) => {
      setCartItems(snap.docs.map(d => ({ cartId: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubUser(); unsubCart(); };
  }, [user]);

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  const handlePurchase = async () => {
    if (walletBalance < total) return alert("Insufficient Balance. Please top up your wallet.");
    
    setPurchasing(true);
    try {
      // 1. Deduct from Wallet
      await updateDoc(doc(db, "users", user.uid), {
        walletBalance: increment(-total)
      });

      // 2. Move items to 'downloads' and clear cart
      for (const item of cartItems) {
        await addDoc(collection(db, "purchases"), {
          userId: user.uid,
          assetId: item.id,
          title: item.title,
          url: item.preview_url,
          purchasedAt: new Date()
        });
        await deleteDoc(doc(db, "cart", item.cartId));
      }

      alert("Purchase Successful! Head to your downloads.");
    } catch (err) {
      console.error(err);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-8 pt-40">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Cart List */}
        <div className="lg:col-span-2">
          <h1 className="text-5xl font-serif mb-12 flex items-center gap-4">
            <ShoppingBag className="text-blue-600" /> Your Cart
          </h1>
          
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.cartId} className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-6 border border-slate-100">
                  <img src={item.preview_url} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <p className="text-blue-600 font-black text-sm">₹{item.price}</p>
                  </div>
                  <button onClick={async () => await deleteDoc(doc(db, "cart", item.cartId))} className="p-4 text-slate-300 hover:text-red-500 transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="font-black uppercase tracking-widest text-slate-400">Cart is empty</p>
              <Link href="/" className="mt-6 inline-block text-blue-600 font-bold">Back to Assets →</Link>
            </div>
          )}
        </div>

        {/* Summary Side Panel */}
        <div className="bg-[#0F172A] text-white p-10 rounded-[3rem] h-fit sticky top-40 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
            <Wallet size={16}/> Wallet Checkout
          </h2>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 text-sm">Subtotal</span>
            <span className="text-xl font-bold">₹{total}</span>
          </div>
          
          <div className="flex justify-between items-center mb-10 pb-10 border-b border-white/10">
            <span className="text-slate-400 text-sm">Wallet Balance</span>
            <span className={walletBalance < total ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>
              ₹{walletBalance}
            </span>
          </div>

          {walletBalance < total && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6">
              Low Balance. Please top up.
            </div>
          )}

          <button 
            disabled={cartItems.length === 0 || walletBalance < total || purchasing}
            onClick={handlePurchase}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            {purchasing ? <Loader2 className="animate-spin mx-auto"/> : "Complete Purchase"}
          </button>

          <p className="text-center text-[9px] text-slate-500 uppercase mt-6 tracking-widest">
            Licensed for Commercial Use
          </p>
        </div>
      </div>
    </div>
  );
}