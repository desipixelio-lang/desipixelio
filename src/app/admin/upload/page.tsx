"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  Upload, X, CheckCircle2, Loader2, Tag, 
  IndianRupee, Type, ArrowLeft, Search, Hash
} from 'lucide-react';
import Link from 'next/link';

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Tag States
  const [availableTags, setAvailableTags] = useState<{id: string, name: string}[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    price: '19',
  });

  // 1. Fetch tags/categories from your Firestore 'categories' collection
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const q = query(collection(db, "categories"), orderBy("name", "asc"));
        const snap = await getDocs(q);
        const tags = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setAvailableTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setSuccess(false);
    }
  };

  const toggleTag = (tagName: string) => {
    const name = tagName.toLowerCase();
    if (selectedTags.includes(name)) {
      setSelectedTags(selectedTags.filter(t => t !== name));
    } else {
      setSelectedTags([...selectedTags, name]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || selectedTags.length === 0) {
      alert("Please select at least one tag/category.");
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload Failed");

      const originalUrl = result.url; 
      const logoId = "pixel_logo_png_vapjid";
      const transformation = `l_${logoId},w_200,o_25,a_30,fl_tiled/q_auto:low`;
      const previewUrl = originalUrl.replace("/upload/", `/upload/${transformation}/`);

      // Save to Firestore using the selectedTags array
      await addDoc(collection(db, "assets"), {
        title: formData.title,
        price: Number(formData.price),
        tags: selectedTags, // This is the array of categories/tags
        original_url: originalUrl,
        preview_url: previewUrl,
        createdAt: serverTimestamp(),
        fileType: file.type,
      });

      setSuccess(true);
      setFile(null);
      setPreview(null);
      setSelectedTags([]);
      setFormData({ title: '', price: '19' });
      alert("Asset Published Successfully!");

    } catch (error: any) {
      console.error("Upload Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const filteredTags = availableTags.filter(t => 
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-amber-500 mb-10 text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: IMAGE SELECTOR */}
          <div className="space-y-4">
            {!preview ? (
              <label className="border-2 border-dashed border-gray-800 rounded-[2.5rem] h-[550px] flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/[0.01] transition-all group">
                <div className="bg-[#111] p-6 rounded-3xl mb-4 border border-gray-800 group-hover:scale-110 transition-all">
                  <Upload className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold">Select Master Image</h3>
                <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest text-[10px]">High-Res Original Only</p>
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
              </label>
            ) : (
              <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-800 h-[550px]">
                <img src={preview} alt="Selected Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {setFile(null); setPreview(null);}} 
                  className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS FORM */}
          <div className="bg-[#0a0a0a] border border-gray-900 p-8 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-2xl font-serif mb-2">Publish New Asset</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Select relevant tags from your library categories.</p>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <Type className="w-3 h-3 text-amber-500" /> Asset Title
                </label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Majestic Fort Architecture"
                  className="w-full bg-[#111] border border-gray-800 p-4 rounded-2xl focus:border-amber-500 outline-none transition text-sm text-white" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee className="w-3 h-3 text-amber-500" /> Price
                </label>
                <input 
                  required 
                  type="number" 
                  className="w-full bg-[#111] border border-gray-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition text-sm font-bold text-white" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                />
              </div>

              {/* DYNAMIC TAG SELECTOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-3 h-3 text-amber-500" /> Assign Tags & Categories
                </label>
                
                {/* Search Tags */}
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                  <input 
                    type="text"
                    placeholder="Search your categories..."
                    className="w-full bg-[#050505] border border-gray-800 p-3 pl-11 rounded-xl text-xs outline-none focus:border-gray-600 transition"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                  />
                </div>

                {/* Tag Cloud */}
                <div className="bg-[#050505] border border-gray-900 p-4 rounded-2xl h-48 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.name)}
                          className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                            selectedTags.includes(tag.name.toLowerCase())
                              ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20'
                              : 'bg-[#111] border-gray-800 text-gray-500 hover:border-gray-600'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-700 text-[10px] w-full text-center py-10">No categories found matching your search.</p>
                    )}
                  </div>
                </div>

                {/* Selection Preview */}
                {selectedTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] text-gray-600 font-bold uppercase mr-2">Selected:</p>
                    {selectedTags.map(tag => (
                      <span key={tag} className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                disabled={uploading || !file || selectedTags.length === 0} 
                type="submit" 
                className="w-full bg-amber-500 disabled:bg-gray-900 disabled:text-gray-700 text-black font-bold py-5 rounded-2xl transition-all shadow-xl shadow-amber-500/10 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> 
                    <span className="uppercase tracking-widest text-[11px]">Syncing & Watermarking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> 
                    <span className="uppercase tracking-widest text-[11px]">Publish to DesiPixelio</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}