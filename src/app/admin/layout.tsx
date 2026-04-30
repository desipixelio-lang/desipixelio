import AdminGuard from "@/components/AdminGuard/page";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      {/* This renders your admin pages (dashboard, collections, etc.) 
          only if the AdminGuard allows it */}
      {children}
    </AdminGuard>
  );
}