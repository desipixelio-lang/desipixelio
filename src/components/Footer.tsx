"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const PALETTE = {
    midnight: "#0F172A",
    slate: "#1E293B",
    electric: "#2563EB",
    coolGray: "#94A3B8"
  };

  return (
    <footer 
      style={{ backgroundColor: PALETTE.midnight }} 
      className="pt-24 pb-12 px-6 md:px-12 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-6 group">
              <img 
                src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" 
                className="h-25 w-auto object-contain transition-transform group-hover:scale-105" 
                alt="DesiPixelio Logo" 
              />
            </Link>
            <p 
              style={{ color: PALETTE.coolGray }} 
              className="text-xs leading-relaxed max-w-sm font-medium"
            >
              Empowering institutions with digital software, high-res stock media, and premium commercial printing services.
            </p>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col items-center md:items-start">
            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 text-white">
              Resources
            </h5>
            <ul style={{ color: PALETTE.coolGray }} className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
              <li>
                <Link href="/services/stocks" className="hover:text-blue-500 transition-colors">Stock Media</Link>
              </li>
              <li>
                <Link href="/services/development" className="hover:text-blue-500 transition-colors">Dev Studio</Link>
              </li>
              <li>
                <Link href="/services/printing" className="hover:text-blue-500 transition-colors">Printing</Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col items-center md:items-start">
            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 text-white">
              Company
            </h5>
            <ul style={{ color: PALETTE.coolGray }} className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
              <li>
                <Link href="/about" className="hover:text-blue-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
            © 2026 DesiPixelio
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
            Crafted with ❤️ in Jaipur
          </p>
        </div>
      </div>
    </footer>
  );
}