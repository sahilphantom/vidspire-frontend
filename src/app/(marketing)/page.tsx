import FAQSection from "@/components/home/FAQSection";
import FeaturesSection from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ProblemSection from "@/components/home/ProblemSection";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Hero />
      <FeaturesSection />
      <ProblemSection />
      <FAQSection />
    </main>
  );
}