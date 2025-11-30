"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, LucideIcon } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons: LucideIcon[] = [Facebook, Twitter, Instagram, Linkedin];
  const companyLinks: string[] = ["Home", "About Us", "Features", "Pricing"];
  const resourceLinks: string[] = ["Blog", "Case Studies", "Help Center", "API Docs"];

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-zinc-800 pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Top Section: 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center ">
              <img
                src="/assets/vidspirelogo.png"
                alt="Videspire Logo"
                width={80}
                height={80}
                className="w-20 h-20 -my-6 object-contain"
              />
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                VideSpire
              </span>
            </Link>
            <p className="text-gray-600 dark:text-zinc-400 leading-relaxed pr-4">
              Explore the latest AI solutions from VideSpire to skyrocket your YouTube channel's growth and engagement.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-[#d6211e] dark:hover:text-[#d6211e] hover:border-[#d6211e] dark:hover:border-[#d6211e] transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Company</h3>
            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-zinc-400 hover:text-[#d6211e] dark:hover:text-[#d6211e] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resources</h3>
            <ul className="space-y-4">
              {resourceLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-zinc-400 hover:text-[#d6211e] dark:hover:text-[#d6211e] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#d6211e] shrink-0" />
                <span className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                  123 AI Innovation Way, San Francisco, CA 94105
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-[#d6211e] shrink-0" />
                <span className="text-gray-600 dark:text-zinc-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-[#d6211e] shrink-0" />
                <a
                  href="mailto:support@vidspire.com"
                  className="text-gray-600 dark:text-zinc-400 hover:text-[#d6211e] dark:hover:text-[#d6211e] transition-colors duration-300"
                >
                  support@vidspire.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 text-center text-gray-500 dark:text-zinc-500 text-sm">
          <p>
            © Copyright {currentYear}, All Rights Reserved by VideSpire.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;