"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});

// List of sponsors — replace these with your actual logos
const sponsors = [
  { name: "NPS Vatsalya", logo: "/images/navbar/NPS-Vatsalya_logo.png", url: "#" },
  { name: "STEMLearn.AI", logo: "/images/navbar/STEMLearn.AI-logo-white.png", url: "#" },
//   { name: "Amity University Patna", logo: "/images/navbar/Amity University__Logo__Patna.jpg", url: "#" },
  { name: "Amity University", logo: "/images/navbar/Amity University__Logo__Jharkhand.jpg", url: "#" },
];

// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CARD_WIDTH = 250;
const GAP = 18;

export default function PanelSponsors() {
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    function onResize() {
      const w = window.innerWidth;
      if (w >= 1024) setSlidesToShow(3);
      else if (w >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (current > sponsors.length - slidesToShow) setCurrent(0);
  }, [slidesToShow, current]);

  const next = () =>
    setCurrent((prev) =>
      prev === sponsors.length - slidesToShow ? 0 : prev + 1
    );
  const prev = () =>
    setCurrent((prev) =>
      prev === 0 ? sponsors.length - slidesToShow : prev - 1
    );

  const totalWidth = sponsors.length * (CARD_WIDTH + GAP) - GAP;
  const translateX = -(current * (CARD_WIDTH + GAP));

  return (
    <motion.section
      className={`${poppins.variable} relative bg-[#FFF9F4] py-16 flex flex-col items-center overflow-visible`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      id="sponsors"
    >
      {/* Heading */}
      <motion.h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        Our Sponsors
      </motion.h2>
      <motion.div
        className="h-[2px] w-24 bg-black mt-4 mb-6"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
      />
      <motion.p
        className="text-center text-base md:text-lg mb-6 font-inter"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        Proudly supported by our amazing partners.
      </motion.p>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl flex items-center justify-center px-2">
        {/* Prev Arrow */}
        {/* <motion.button
          aria-label="Previous"
          onClick={prev}
          className="hidden md:flex absolute -left-8 z-20 top-1/2 -translate-y-1/2 bg-[#B2252A] text-white rounded-full w-11 h-11 text-2xl items-center justify-center shadow-lg"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          &#8249;
        </motion.button> */}

        {/* Slider */}
        <motion.div
          className="w-full overflow-hidden"
          style={{ maxWidth: `${slidesToShow * (CARD_WIDTH + GAP) - GAP}px` }}
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
        >
          <div
            className="flex transition-transform duration-500"
            style={{
              width: totalWidth,
              transform: `translateX(${translateX}px)`,
              gap: `${GAP}px`,
            }}
          >
            {sponsors.map((s, index) => (
              <div
                key={s.name + index}
                style={{
                  width: `${CARD_WIDTH}px`,
                  minWidth: `${CARD_WIDTH}px`,
                  background: "white",
                  borderRadius: "14px",
                  boxShadow: "0 3px 10px #0001",
                  border: "1px solid #ececec",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <Image
                    src={s.logo}
                    alt={s.name}
                    width={150}
                    height={150}
                    className="object-contain w-[150px] h-[100px]"
                  />
                  {/* <p className="text-center mt-3 text-sm font-semibold text-black">
                    {s.name}
                  </p> */}
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next Arrow */}
        {/* <motion.button
          aria-label="Next"
          onClick={next}
          className="hidden md:flex absolute -right-8 z-20 top-1/2 -translate-y-1/2 bg-[#B2252A] text-white rounded-full w-11 h-11 text-2xl items-center justify-center shadow-lg"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          &#8250;
        </motion.button> */}
      </div>

      {/* Mobile Arrows */}
      <motion.div
        className="flex md:hidden w-full justify-between mt-7 max-w-sm"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        transition={{ delay: 0.5 }}
      >
        <button
          aria-label="Previous"
          onClick={prev}
          className="bg-[#B2252A] text-white rounded-full w-9 h-9 text-xl flex items-center justify-center shadow"
        >
          &#8249;
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="bg-[#B2252A] text-white rounded-full w-9 h-9 text-xl flex items-center justify-center shadow"
        >
          &#8250;
        </button>
      </motion.div>
    </motion.section>
  );
}
