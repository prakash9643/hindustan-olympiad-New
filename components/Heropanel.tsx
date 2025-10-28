import React, { useState, useEffect } from "react";
import { Poppins, Inter } from "next/font/google";
import { motion } from "framer-motion";

// Font setup
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

const images = [
  "/images/hero/img1.jpg",
  "/images/hero/img2.jpg",
  "/images/hero/img3.jpg",
  "/images/hero/img4.jpg",
];

const SLIDE_DURATION = 4000; // 4 seconds per slide

const HeroPanel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
      className={`${poppins.variable} ${inter.variable} relative font-sans overflow-hidden h-[calc(100vh-80px)]`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center 70%",
              opacity: idx === current ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-20 z-10" />
      </div>

      {/* Stats Box: pinned to bottom of hero, animates on load */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-20 flex justify-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="bg-[#FFF7F3] shadow-lg rounded-lg p-4 md:p-6 px-8 md:px-12 flex flex-col items-center">
          <h1
            className="text-[20px] md:text-[32px] font-poppins font-bold text-[#B2252A] mb-4 leading-tight text-center whitespace-normal"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            TEST YOUR ACADEMIC EXCELLENCE
          </h1>
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-8 items-center justify-center w-full">
            {[
              ["4", "States"],
              ["150", "Districts"],
              ["6000", "Schools"],
              ["6 Lakh+", "Students"],
              ["~₹2 Crore", "Worth Prizes"],
            ].map(([num, label], i) => (
              <div
                key={i}
                className={`flex flex-col items-center ${
                  i < 4 ? "border-r md:border-r-2 border-[#B2252A] pr-3 md:pr-8" : ""
                }`}
              >
                <p
                  className="text-[16px] md:text-[20px] font-semibold text-black whitespace-nowrap"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {num}
                </p>
                <p
                  className="text-[12px] md:text-[14px] text-black mt-[2px] whitespace-nowrap"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroPanel;
