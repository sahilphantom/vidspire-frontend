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
      title: 'Data Overload',
      description: 'You’re drowning in analytics. Thousands of comments, trends, CTR graphs, retention charts… but no clear direction. Valuable insights slip through the cracks every single day.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#B02E2B]" />,
      title: 'Slow Decision-Making',
      description: 'By the time you figure out what’s working, the trend is already gone. Manual processing keeps you behind competitors who move faster.',
    },
    {
      icon: <Shield className="w-6 h-6 text-[#B02E2B]" />,
      title: 'Data Security Concerns',
      description: 'With increasing cyber threats, businesses worry about the safety of their sensitive information when adopting new technologies.',
    },
  ];

  return (
    <section className="w-[95%] m-auto py-16 bg-white dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className={`text-center ${spaceGrotesk.className} mb-12`}>
          <h2 className="text-xs font-semibold tracking-widest text-[#B02E2B] uppercase mb-4">PROBLEM</h2>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
           Manually handling your YouTube data is <br />
           killing your growth.

          </h1>
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