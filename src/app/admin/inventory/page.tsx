"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, query, orderBy, getDocs, 
  deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { 
  Trash2, Edit3, Save, X, Search, 
  Loader2, Image as ImageIcon, Eye, EyeOff,
  Tag, IndianRupee, Info
} from 'lucide-react';
import Link from 'next/link';

export default function MyGallery() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch Logic
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "assets"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  // Update Logic
  const handleUpdate = async (id: string, updatedData: any) => {
    try {
      const assetRef = doc(db, "assets", id);
      await updateDoc(assetRef, updatedData);
      setAssets(assets.map(item => item.id === id ? { ...item, ...updatedData } : item));
      setEditingId(null);
      alert("Changes Saved!");
    } catch (error) {
      alert("Error updating asset");
    }
  };

  // Delete Logic
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this asset permanently?")) {
      await deleteDoc(doc(db, "assets", id));
      setAssets(assets.filter(item => item.id !== id));
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-amber-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif">Asset Inventory</h1>
            <p className="text-gray-500 text-sm mt-2">Manage, Edit, and Audit your DesiPixelio library.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-600" />
              <input 
                type="text" placeholder="Search by title..." 
                className="bg-[#111] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm w-full outline-none focus:border-amber-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/admin/upload" className="bg-amber-500 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400">
              New Upload
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-amber-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssets.map((asset) => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                isEditing={editingId === asset.id}
                onEdit={() => setEditingId(asset.id)}
                onCancel={() => setEditingId(null)}
                onSave={(data) => handleUpdate(asset.id, data)}
                onDelete={() => handleDelete(asset.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: INDIVIDUAL ASSET CARD ---
function AssetCard({ asset, isEditing, onEdit, onCancel, onSave, onDelete }: any) {
  const [formData, setFormData] = useState({ ...asset });
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className={`relative bg-[#0a0a0a] border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${isEditing ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-gray-900'}`}>
      
      {/* Image Preview Area */}
      <div className="relative h-72 overflow-hidden group">
        <img 
          src={showOriginal ? asset.original_url : asset.preview_url} 
          alt={asset.title} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/000000/F59E0B?text=Broken+URL")}
        />
        
        {/* Toggle Overlay (Visual Check) */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setShowOriginal(!showOriginal)}
            className="p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-amber-500 transition-colors group/btn"
          >
            {showOriginal ? <EyeOff className="w-4 h-4 text-amber-500 group-hover/btn:text-black" /> : <Eye className="w-4 h-4 text-white" />}
          </button>
        </div>

        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <p className="text-[10px] font-black text-amber-500 tracking-widest uppercase">
            {showOriginal ? 'Master Original' : 'Watermarked Preview'}
          </p>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-8">
        {!isEditing ? (
          // VIEW MODE
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{asset.category}</span>
                <h3 className="text-xl font-serif text-white mt-1">{asset.title}</h3>
              </div>
              <p className="text-amber-500 font-black text-lg">₹{asset.price}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {asset.tags?.map((tag: string) => (
                <span key={tag} className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-400">#{tag}</span>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={onEdit} className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-xl flex items-center justify-center gap-2 transition font-bold text-xs uppercase tracking-widest">
                <Info className="w-4 h-4" /> Details & Edit
              </button>
              <button onClick={onDelete} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-4">
            <div>
              <label className="text-[9px] font-bold text-gray-600 uppercase mb-2 block tracking-widest">Asset Title</label>
              <input 
                className="w-full bg-[#111] border border-gray-800 p-3 rounded-xl text-sm outline-none focus:border-amber-500 transition"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-gray-600 uppercase mb-2 block tracking-widest">Price (INR)</label>
                <div className="relative">
                   <IndianRupee className="absolute left-3 top-3 w-3 h-3 text-gray-500" />
                   <input 
                    type="number"
                    className="w-full bg-[#111] border border-gray-800 p-3 pl-8 rounded-xl text-sm outline-none focus:border-amber-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-600 uppercase mb-2 block tracking-widest">Category</label>
                <select 
                  className="w-full bg-[#111] border border-gray-800 p-3 rounded-xl text-sm outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Indian Culture</option>
                  <option>Festivals</option>
                  <option>Architecture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-gray-600 uppercase mb-2 block tracking-widest">Keywords (Tags)</label>
              <textarea 
                className="w-full bg-[#111] border border-gray-800 p-3 rounded-xl text-sm outline-none h-20 resize-none"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={onCancel} className="flex-1 bg-gray-900 hover:bg-gray-800 p-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">Cancel</button>
              <button 
                onClick={() => {
                  const dataToSave = {
                    ...formData,
                    tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((t: string) => t.trim()) : formData.tags
                  };
                  onSave(dataToSave);
                }}
                className="flex-1 bg-amber-500 text-black p-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}