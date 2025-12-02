import FAQSection from "@/components/home/FAQSection";
import FeaturesSection from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/src/components/home/SolutionSection";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Hero />
      <FeaturesSection />
      <ProblemSection />
      <SolutionSection />
      <FAQSection />
    </main>
  );
}