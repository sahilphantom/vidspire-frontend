import FAQSection from "@/components/home/FAQSection";
import FeaturesSection from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import  Hero  from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";
import ProblemSection from "@/components/home/ProblemSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <FeaturesSection />
    <ProblemSection />
    <FAQSection />
    <Footer />
    
    </>
  );
}
