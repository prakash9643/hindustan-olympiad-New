// components/Panel11.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Fonts
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: "700", variable: "--font-poppins" });

// Colors
const red = "#B2252A";
const bg = "#FEF3E6";

// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Panel11: React.FC = () => (
  <section
    className={`${poppins.variable} w-full py-8 md:py-20 px-2 md:pb-0`}
    style={{ background: bg }}
    id="schedule"
  >
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      {/* Animated Heading & Divider */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-center pb-4"
          style={{ color: red, fontFamily: "Poppins, sans-serif" }}
        >
          Timeline for 2025
        </h2>
        <div className="h-[2px] w-24 bg-black mt-4 mb-6 mx-auto" />
      </motion.div>

      {/* Animated Timeline Image */}
      <motion.div
        className="w-full flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <Image
          src="/images/panel11/timeline.png"
          alt="Timeline"
          width={1100}
          height={500}
          className="w-full max-w-[900px] h-auto"
          priority
          unoptimized
        />
      </motion.div>
    </div>
  </section>
);

export default Panel11;
