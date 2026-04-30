"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, doc, setDoc, writeBatch, 
  increment, getDocs, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { X, Loader2, Database, ImagePlus, UploadCloud, Link as LinkIcon, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CollectionBuilderModal({ isOpen, onClose, mode, selectedIds, resetSelection }: any) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [targetSlug, setTargetSlug] = useState(""); 
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (isOpen) {
      const q = query(collection(db, "collections"), orderBy("createdAt", "desc"));
      getDocs(q).then(snap => setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
  }, [isOpen]);

  const selectExisting = (col: any) => {
    setTargetSlug(col.id);
    setTitle(col.title || "");
    setDesc(col.description || "");
    setLoc(col.location || "");
    // On mobile, scroll back to top of form after selecting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = "dqgstsvzk"; 
    const uploadPreset = "ml_default"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) return null;
      return data.secure_url;
    } catch (err) {
      return null;
    }
  };

  const handleSave = async () => {
    if (!targetSlug || !title) return alert("Document ID (Slug) and Title are required.");
    setLoading(true);
    const batch = writeBatch(db);

    try {
      let coverUrl = "";
      if (coverFile) {
        coverUrl = await uploadToCloudinary(coverFile);
        if (!coverUrl) throw new Error("Cover upload failed.");
      }

      const colRef = doc(db, "collections", targetSlug);
      const collectionMeta: any = {
        title,
        description: desc,
        location: loc,
        updatedAt: serverTimestamp(),
      };
      if (coverUrl) collectionMeta.coverImage = coverUrl;

      if (mode === 'create') {
        selectedIds.forEach((id: string) => {
          batch.update(doc(db, "assets", id), { collectionId: targetSlug });
        });
        collectionMeta.assetCount = increment(selectedIds.length);
      } else if (bulkFiles) {
        for (let i = 0; i < bulkFiles.length; i++) {
          const secureUrl = await uploadToCloudinary(bulkFiles[i]);
          if (!secureUrl) continue;
          const assetId = `${targetSlug}_${Date.now()}_${i}`;
          batch.set(doc(db, "assets", assetId), {
            id: assetId,
            collectionId: targetSlug,
            title: `${title} Asset ${i + 1}`,
            original_url: secureUrl,
            preview_url: secureUrl.replace('/upload/', '/upload/q_auto,f_auto,w_800/'),
            price: 19,
            tags: ["desi", "pixelio", targetSlug],
            createdAt: serverTimestamp()
          });
        }
        collectionMeta.assetCount = increment(bulkFiles.length);
        collectionMeta.createdAt = serverTimestamp();
      }

      batch.set(colRef, collectionMeta, { merge: true });
      await batch.commit();
      setSuccess(true);
      resetSelection();
    } catch (e: any) {
      alert(`Sync Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-2xl overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#080808] border-0 md:border md:border-white/10 w-full max-w-7xl min-h-screen md:min-h-0 md:h-[90vh] md:rounded-[3rem] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* LEFT: FORM INPUTS */}
        <div className="w-full md:w-1/2 p-6 md:p-14 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto custom-scrollbar">
          <header className="mb-8 md:mb-10 flex justify-between items-center">
            <h2 className="text-2xl md:text-4xl font-serif tracking-tight text-white">Registry <span className="text-amber-500 italic">Architect</span></h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-zinc-500 hover:text-white"><X size={24}/></button>
          </header>

          {success ? (
            <div className="text-center py-12 md:py-20 flex flex-col items-center">
              <CheckCircle2 className="text-emerald-500 mb-6" size={60} />
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">Database Mapped</h3>
              <p className="text-zinc-500 mb-10 max-w-xs text-sm">The collection context and heritage assets are now synchronized.</p>
              <button onClick={() => { setSuccess(false); onClose(); }} className="w-full md:w-auto px-10 py-4 bg-amber-500 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:scale-105 transition">Return to Engine</button>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><LinkIcon size={12}/> Document ID (Slug)</label>
                  <input className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl font-bold text-amber-500 text-sm outline-none focus:border-amber-500 transition" value={targetSlug} onChange={e => setTargetSlug(e.target.value)} placeholder="e.g., jodhpur-heritage" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Public Title</label>
                  <input className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl font-bold text-white text-sm outline-none focus:border-amber-500 transition" value={title} onChange={e => setTitle(e.target.value)} placeholder="Royal Rajput Wedding" />
                </div>
              </div>

              <div className="p-4 md:p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <label className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2"><ImagePlus size={14}/> Hero Image</label>
                <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full text-[10px] text-zinc-500 file:bg-amber-500 file:border-none file:px-3 file:py-1.5 file:rounded-lg file:font-black file:text-[9px] file:uppercase file:mr-4 cursor-pointer" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Location Origin</label>
                <input className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-amber-500 transition" value={loc} onChange={e => setLoc(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Narrative Description</label>
                <textarea className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl h-24 resize-none text-white text-sm outline-none focus:border-amber-500 transition" value={desc} onChange={e => setDesc(e.target.value)} />
              </div>

              {mode === 'upload' && (
                <div className="p-6 md:p-10 border-2 border-dashed border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] text-center bg-zinc-900/20 group hover:border-amber-500/50 transition-all">
                  <UploadCloud className="mx-auto mb-4 text-zinc-700 group-hover:text-amber-500 transition-colors" size={32}/>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-4">Bulk Selection</p>
                  <input type="file" multiple onChange={e => setBulkFiles(e.target.files)} className="w-full text-[10px] text-zinc-500" />
                </div>
              )}

              <button 
                onClick={handleSave} disabled={loading}
                className="w-full bg-amber-500 text-black py-5 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto text-black" /> : 'Synchronize Context'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: REGISTRY SIDEBAR */}
        <div className="w-full md:w-1/2 bg-[#050505] p-6 md:p-12 overflow-y-auto border-t md:border-t-0 md:border-l border-white/5 custom-scrollbar">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <Database className="text-amber-500 w-5 h-5 md:w-6 md:h-6" />
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-white">Global Registry</h3>
              <p className="text-[8px] md:text-[9px] font-black uppercase text-zinc-600 tracking-widest mt-1">Existing Clusters</p>
            </div>
          </div>
          
          <div className="grid gap-3 md:gap-4">
            {collections.map(col => (
              <div 
                key={col.id} onClick={() => selectExisting(col)}
                className={`group p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer flex items-center gap-4 md:gap-6 ${targetSlug === col.id ? 'border-amber-500 bg-amber-500/5 shadow-lg' : 'border-white/5 bg-zinc-900/30 hover:border-white/20'}`}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/5">
                    <img src={col.coverImage || "/placeholder.jpg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[8px] md:text-[9px] font-black text-amber-500 uppercase tracking-widest truncate">{col.id}</p>
                    <span className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest shrink-0 ml-2">Qty: {col.assetCount || 0}</span>
                  </div>
                  <h4 className="text-lg md:text-xl font-serif text-white/90 group-hover:text-white transition-colors truncate">{col.title}</h4>
                </div>
                <ChevronRight className={`md:hidden shrink-0 ${targetSlug === col.id ? 'text-amber-500' : 'text-zinc-800'}`} size={16} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}