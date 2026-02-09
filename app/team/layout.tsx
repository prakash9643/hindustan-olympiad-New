"use client";
import React, { useEffect, useState } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const allowedAddStudentUsers = [
  "685b7c73ad2fe5fd0b12737c",
  "6874f0592c97dbf80815617c",
  "68a315644e9ba8d109135d1c"
];

const restrictedPages = [
  // "/team/add-school",
  "/team/add-student",
  "/team/bulk-add-students",
  "/team/bulk-add-school",
  "/team/multi-add-students",
   "/team/samplepaperrequest"
];

const tabs = [
  { label: "Add School", href: "/team/add-school" },
  { label: "View Schools", href: "/team/view-schools" },
  { label: "Add Student", href: "/team/add-student", requiresAccess: true },
  { label: "View Students", href: "/team/view-students" },
  { label: "Bulk Add Students", href: "/team/bulk-add-students", requiresAccess: true },
  { label: "Bulk Add Schools", href: "/team/bulk-add-school", requiresAccess: true },
  { label: "Individual Students", href: "/team/eoi-students" },
  { label: "Multi Add Students", href: "/team/multi-add-students", requiresAccess: true },
  { label: "Sample Paper", href: "/team/samplepaperrequest", requiresAccess: true }
];

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Set user cookie for middleware
  useEffect(() => {
    const setUserCookie = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        // Set cookie for server-side access (middleware)
        document.cookie = `user=${encodeURIComponent(stored)}; path=/`;
      }
    };
    
    setUserCookie();
  }, []);

  // Check authentication and authorization
  useEffect(() => {
    const checkAccess = () => {
      const stored = localStorage.getItem("user");

      if (!stored) {
        router.push("/phone-login/team");
        return false;
      }

      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);

        // Check if current page is restricted for this user
        const isRestrictedPage = restrictedPages.some(page => 
          pathname.startsWith(page)
        );
        
        if (isRestrictedPage && !allowedAddStudentUsers.includes(parsed._id)) {
          // Middleware should already block, but double-check client-side
          router.push("/team/view-schools");
          return false;
        }

        return true;
      } catch (error) {
        router.push("/phone-login/team");
        return false;
      }
    };

    const hasAccess = checkAccess();
    
    // Only show content if user is authenticated AND authorized
    if (hasAccess) {
      setLoading(false);
    }
  }, [pathname, router]);

  // Show loading while checking
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Filter tabs based on user ID
  const visibleTabs = tabs.filter((tab) => {
    if (!tab.requiresAccess) return true; // Normal tabs show for everyone
    return allowedAddStudentUsers.includes(user?._id);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <CardHeader className="p-0">
        <CardTitle>HO Team dashboard</CardTitle>
        <CardDescription>
          Manage schools and students with comprehensive forms and data views
        </CardDescription>
      </CardHeader>

      <div className="inline-flex md:h-10 rounded-md bg-muted p-1 text-muted-foreground mt-4 mb-4 flex-wrap">
        {visibleTabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium 
              ${pathname.startsWith(tab.href) ? "bg-primary text-white" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}