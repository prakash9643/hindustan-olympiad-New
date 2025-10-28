"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: "700", variable: "--font-poppins" });

const cards = [
  "/images/panel12/card1.svg",
  "/images/panel12/card2.svg",
  "/images/panel12/card3.svg",
  "/images/panel12/card4.svg",
];

const Panel12: React.FC = () => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={`${poppins.variable} bg-[#FFF7F3] py-10 flex flex-col items-center`} id="advisory-panel">
      {/* Heading */}
      <h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center mb-4"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Advisory Council
      </h2>
      <div className="h-[2px] w-24 bg-black mb-6 mx-auto" />

      {/* Carousel for mobile */}
      <div className="relative flex items-center justify-center w-full sm:hidden">
        <button
          onClick={handlePrev}
          className="absolute left-2 z-10 bg-[#B2252A] rounded-full p-2 shadow-md"
        >
          <ArrowLeft size={24} color="white" />
        </button>

        <div className="w-[335px] h-[380px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Image
                src={cards[index]}
                alt={`Advisory card ${index + 1}`}
                width={335}
                height={380}
                className="object-contain rounded-xl bg-white shadow-md"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-2 z-10 bg-[#B2252A] rounded-full p-2 shadow-md"
        >
          <ArrowRight size={24} color="white" />
        </button>
      </div>

      {/* Grid layout for tablet/desktop */}
      <div className="hidden sm:flex flex-wrap gap-4 justify-center">
        {cards.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-[268px] h-[304px]">
            <Image
              src={src}
              alt={`Advisory card ${idx + 1}`}
              width={268}
              height={304}
              className="object-contain rounded-xl bg-white shadow-md"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Panel12;
