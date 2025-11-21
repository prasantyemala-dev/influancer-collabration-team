import type { Metadata } from "next";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CollabMap",
  description: "Connect, Collab, Create",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main className="min-h-screen bg-slate-50 pb-20">
            {children}
          </main>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
