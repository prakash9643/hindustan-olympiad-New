// components/Panel10.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Panel10: React.FC = () => (
  <section className="w-full bg-white py-12 md:py-20 flex items-center justify-center min-h-[500px] relative overflow-hidden">
    {/* Background Images - Both Left and Right */}
    <div 
      className="absolute inset-0 z-0 top-0 right-[-2%] bottom-[-22%] w-full"
      style={{
        backgroundImage: "url('/images/panel10/prz1.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "30% auto",
      }}
    />
    
    {/* Alternative approach using separate divs */}
    {/* Left Background Image */}
    <div 
      className="absolute left-[-1%] top-0 bottom-[-22%] w-full z-0"
      style={{
        backgroundImage: "url('/images/panel10/prz1.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        backgroundSize: "30% auto",
      }}
    />

    {/* Content */}
    <div className="max-w-4xl relative z-10 w-full flex flex-col justify-center items-center gap-12 px-4 md:px-8">
      
      {/* Heading Section */}
      <div className="w-full flex flex-col justify-center items-center text-center">
        {/* Heading */}
        <motion.h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          Lucky Draw Prizes
        </motion.h2>
        
        {/* Divider */}
        <motion.div 
          className="h-1 w-20 bg-gradient-to-r from-[#B2252A] to-black mt-2 mb-8 rounded-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        />
      </div>
      
      {/* Prize Cards */}
      <div className="w-full relative space-y-6 flex items-center justify-center gap-8 flex-col md:flex-row md:space-y-0">
        {/* First Prize Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-red-100 transform hover:scale-105 transition-transform duration-300 w-full max-w-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-800">Score above 90%</span>
            <div className="bg-[#B2252A] text-white px-3 py-1 rounded-full text-sm font-bold">
              1 Winner
            </div>
          </div>
          <div className="text-2xl font-bold text-[#B2252A] flex items-center gap-2 justify-start">
            🚗 Luxury Car
          </div>
          <p className="text-gray-600 text-sm mt-2">
            1 lucky winner will <span className="font-bold text-[#B2252A]">win a car</span>
          </p>
        </motion.div>

        {/* Second Prize Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200 transform hover:scale-105 transition-transform duration-300 w-full max-w-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-800">Score above 75%</span>
            <div className="bg-[#B2252A] text-white px-3 py-1 rounded-full text-sm font-bold">
              5 Winners
            </div>
          </div>
          <div className="text-2xl font-bold text-[#B2252A] flex items-center gap-2 justify-start">
            🛵 Electric Scooters
          </div>
          <p className="text-gray-600 text-sm mt-2">
            5 lucky winners will win
            <span className="font-bold text-[#B2252A]"> electric scooters</span>
          </p>
        </motion.div>
      </div>

      {/* Floating elements for visual appeal */}
      <motion.div 
        className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm rotate-12 shadow-lg z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        🎉 Exciting Prizes!
      </motion.div>
    </div>
  </section>
);

export default Panel10;