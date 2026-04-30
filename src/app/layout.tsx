"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<string[]>([]);
  
  // This ensures we don't hide the navbar accidentally due to a null pathname
  const isAdminPage = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const catSnap = await getDocs(collection(db, "categories"));
        setCategories(catSnap.docs.map((d) => d.data().name));
      } catch (err) {
        console.error("Layout Category Fetch Error:", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    // Added suppressHydrationWarning to ignore extension-injected attributes
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#0F172A]" suppressHydrationWarning>
        <AuthProvider> 
          {/* Force Navbar to show if not in admin */}
          {!isAdminPage && <Navbar categories={categories} />}
          
          {/* This wrapper ensures content doesn't hide behind the fixed navbar */}
          <div className={!isAdminPage ? "pt-20" : ""}>
            {children}
          </div>

          {!isAdminPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}