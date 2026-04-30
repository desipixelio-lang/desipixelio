"use client";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export default function Gallery({ selectedCategory = "All" }) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const assetsRef = collection(db, "assets");
        let q;

        // ARRANGEMENT LOGIC:
        if (selectedCategory === "All") {
          // Get the 20 newest images across all categories
          q = query(assetsRef, orderBy("createdAt", "desc"), limit(20));
        } else {
          // Filter by category AND sort by date
          q = query(
            assetsRef, 
            where("category", "==", selectedCategory), 
            orderBy("createdAt", "desc")
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setImages(fetchedData);
      } catch (error) {
        console.error("Error reading images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedCategory]); // Re-runs whenever you click a new category

  if (loading) return <div className="text-center py-20 text-amber-500">Loading DesiPixelio Library...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10">
      {images.map((img: any) => (
        <div key={img.id} className="group relative rounded-xl overflow-hidden shadow-2xl">
          <img src={img.preview_url} alt={img.title} className="w-full h-72 object-cover transition group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <p className="text-sm font-bold">{img.title}</p>
            <p className="text-amber-500 text-xs font-bold">₹{img.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}