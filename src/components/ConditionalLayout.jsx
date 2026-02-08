'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "../app/Components/Footer";
import { Toaster } from "sonner";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Define routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    '/guest',
    '/guest/',
    '/dashboard',
    '/dash',
    '/dashboard/',
    '/guest/dashboard',
    "/host",
    "/admin",
    '/guest/dashboard/'
  ];
  
  const shouldShowHeaderFooter = !hideHeaderFooterRoutes.some(route => 
    pathname?.startsWith(route)
  );

  return (
    <>
      {shouldShowHeaderFooter && (
        <div>
          <Header />
        </div>
      )}

      <main className="min-h-screen">
        {children}
        <Toaster />
      </main>

      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}