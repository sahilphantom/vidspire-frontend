// src/app/(marketing)/layout.tsx
import { Navbar } from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}