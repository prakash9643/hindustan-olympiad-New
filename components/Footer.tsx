// components/Footer.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Poppins, Inter } from "next/font/google";
import { motion } from "framer-motion";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
});

const Footer: React.FC = () => (
  <motion.div
        id="footer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
      <footer id="footer"
        className={`${poppins.variable} ${inter.variable} w-full bg-white px-4 py-6 max-w-7xl mx-auto`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          {/* Contact Us */}
          <div className="flex-1">
            <h3
              className="font-bold text-[#B2252A] text-base mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Contact us
            </h3>
            <p
              className="text-sm mb-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              For any queries please contact us at:
            </p>
            <a
              href="mailto: olympiadsupport@livehindustan.com"
              className="text-sm font-semibold block"
              style={{ fontFamily: "Inter, sans-serif", color: "#B2252A" }}
            >
              olympiadsupport@livehindustan.com
            </a>
          </div>

          {/* Social Links */}
          {/* <div className="flex-1 flex flex-col items-center">
            <h3
              className="font-bold text-[#B2252A] text-base mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Connect With US
            </h3>
            <div className="flex gap-3">
              {[
                { alt: "Facebook", src: "/facebook.jpg" },
                { alt: "Twitter", src: "/x.jpg" },
                { alt: "LinkedIn", src: "/linkedin.jpg" },
                { alt: "Instagram", src: "/instagram.jpg" },
              ].map(({ alt, src }) => (
                <a key={alt} href="#" aria-label={alt} className="w-8 h-8">
                  <Image src={src} alt={alt} width={32} height={32} />
                </a>
              ))}
            </div>
          </div> */}

          {/* Quick Links */}
          <div className="flex-1">
            <h3
              className="font-bold text-[#B2252A] text-base mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Quick Links
            </h3>
            <ul className="list-disc list-inside text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <li>
                <a href="/terms-and-conditions" className="hover:underline">
                  Terms &amp; Condition
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dotted divider */}
        <div className="border-t border-dotted border-[#B2252A] my-4" />

        {/* Copyright */}
        <p
          className="text-center text-xs text-black"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          © Copyright 2025 All rights reserved
        </p>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-4 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-lg shadow-md"
        >
          ↑
        </button>
        <a
          href="/faq" // yaha apna FAQ ka URL daal do
          target="_blank"
          rel="noopener noreferrer"
          aria-label="FAQ"
          title="FAQ"
          className="fixed bottom-4 right-1-5 w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center text-lg shadow-md"
        >
          FAQ
        </a>
      </footer>

    </motion.div>
);

export default Footer;
