import React from 'react';
import { Brain, Zap, Shield, LucideIcon } from 'lucide-react';
import { Space_Grotesk, Outfit } from "next/font/google";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});


const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-start p-4 text-left">
    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full ">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProblemSection: React.FC = () => {
  const problems: Problem[] = [
    {
      icon: <Brain className="w-6 h-6 text-[#B02E2B]" />,
      title: 'The "Post & Pray" Trap',
      description: 'You spend 10 hours filming a video idea that was doomed to fail before you even hit record. You are operating blind, hoping the algorithm saves you.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#B02E2B]" />,
      title: 'Invisible Competitor Gaps',
      description: 'Your niche has massive "content holes"—topics people are searching for but no one is making. You can\'t see them, so you keep fighting for scraps in crowded topics.',
    },
    {
      icon: <Shield className="w-6 h-6 text-[#B02E2B]" />,
      title: 'Vanity Metric Blindness',
      description: 'You obsess over Subscriber count, but ignore the metrics that actually pay: Retention Drop-offs and Audience Demand. You are optimizing for ego, not revenue.',
    }
  ];

  return (
    <section className="w-[95%] m-auto py-16 bg-white dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className={`text-center ${spaceGrotesk.className} mb-12`}>
          <h2 className="text-xs font-semibold tracking-widest text-[#B02E2B] uppercase mb-4">PROBLEM</h2>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 dark:text-white">
         Stop Guessing. It’s Costing You Views.
          </h1>
           <p className={`text-gray-600 ${outfit.className} dark:text-zinc-400 text-lg leading-relaxed`}>
           90% of creators rely on "gut feeling" and luck. That is why they fail.You are losing traffic <br/> 
           to competitors who use data to engineer their virality.
          </p>
        </div>
        <div className={`grid grid-cols-1 ${outfit.className} md:grid-cols-3 gap-8 text-left`}>
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;