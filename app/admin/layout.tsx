"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import { AdminAuthProvider, useAdminAuth } from "./_components/AdminAuthContext";
import { Skeleton } from "@/components/ui/skeleton";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    if (!loading && user && pathname === "/admin/login") {
      router.push("/admin");
    }
  }, [loading, user, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex bg-zinc-50"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
