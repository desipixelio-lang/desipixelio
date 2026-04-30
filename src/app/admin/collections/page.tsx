"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Library, FolderPlus, ImageUp, CheckCircle, Loader2 } from 'lucide-react';
import CollectionBuilderModal from './CollectionBuilderModal';

export default function AdminCollectionsManager() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'upload'>('create');

  useEffect(() => {
    const q = query(collection(db, "assets"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setAssets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden">
      
      {/* --- PREMIUM CONTROL HEADER --- */}
      <header className="p-4 md:p-8 border-b border-white/5 bg-[#050505] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-50">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif flex items-center gap-3 md:gap-4 tracking-tighter">
             <Library className="text-amber-500 shrink-0" size={28} /> 
             <span className="truncate">Collection Engine</span>
          </h1>
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-500 mt-1 md:mt-2">
            Selection Queue: {selectedAssetIds.length} Assets
          </p>
        </div>

        <div className="flex w-full sm:w-auto gap-3 md:gap-4">
          <button 
            onClick={() => { setModalMode('create'); setIsModalOpen(true); }}
            disabled={selectedAssetIds.length === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-zinc-900 border border-white/10 rounded-xl md:rounded-2xl hover:bg-zinc-800 transition disabled:opacity-30"
          >
            <FolderPlus size={16} className="text-amber-500" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Map</span>
          </button>
          
          <button 
            onClick={() => { setModalMode('upload'); setIsModalOpen(true); }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-amber-500 text-black rounded-xl md:rounded-2xl hover:bg-amber-400 transition shadow-xl shadow-amber-500/10"
          >
            <ImageUp size={16} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Bulk</span>
          </button>
        </div>
      </header>

      {/* --- SCROLLABLE GALLERY --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 no-scrollbar">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syncing Assets...</p>
          </div>
        ) : (
          assets.map(asset => (
            <div 
              key={asset.id} 
              onClick={() => toggleSelection(asset.id)}
              className={`group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 aspect-square ${
                selectedAssetIds.includes(asset.id) 
                ? 'border-amber-500 scale-[0.98] shadow-lg shadow-amber-500/20' 
                : 'border-transparent hover:border-white/20'
              }`}
            >
              <img 
                src={asset.preview_url} 
                className={`w-full h-full object-cover transition-all duration-500 ${
                  selectedAssetIds.includes(asset.id) ? 'grayscale-0' : 'grayscale-[0.6] group-hover:grayscale-0'
                }`} 
                alt={asset.title || "Asset"}
              />
              
              {/* Selection Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                selectedAssetIds.includes(asset.id) ? 'bg-amber-500/20 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'
              } flex items-center justify-center`}>
                <CheckCircle 
                  className={`transition-transform duration-300 ${
                    selectedAssetIds.includes(asset.id) ? 'text-amber-500 scale-110' : 'text-white/50 scale-75'
                  }`} 
                  size={28} 
                />
              </div>
            </div>
          ))
        )}
      </main>

      <CollectionBuilderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode} 
        selectedIds={selectedAssetIds}
        resetSelection={() => setSelectedAssetIds([])}
      />
    </div>
  );
}