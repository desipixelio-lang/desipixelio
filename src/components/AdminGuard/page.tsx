"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const OFFICIAL_ADMIN_EMAIL = "desipixelio@gmail.com";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user && user.email?.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
        setAuthorized(true);
      } else {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // This prevents the admin page code (and its Firestore listeners) 
  // from ever running for non-admins, stopping the "Permission Denied" errors.
  if (loading || !authorized) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Securing Environment...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}