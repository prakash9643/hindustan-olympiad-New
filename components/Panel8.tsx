// components/Panel8.tsx
"use client";

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

const red = "#B2252A";
const black = "#000000";
const bg = "#FEF3E6"; // updated to match Panel 9

const rewards = [
  {
    title: "Certificate",
    subtitle: "Receive certificates & personalized assessment",
  },
  {
    title: "~7.5K",
    subtitle: "Prizes",
  },
  {
    title: "~₹2 Crore",
    subtitle: "Prize Pool",
  },
  {
    title: "Assessment Report",
    subtitle: "Detailed performance analysis",
  },
];

const Panel8: React.FC = () => (
  <section
    className={`${poppins.variable} ${inter.variable} w-full py-8 px-2`}
    style={{ background: bg }}
    id="rewards"
  >
    <div className="max-w-7xl mx-auto flex flex-col items-center pt-12">
      {/* Animated Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold mb-1 text-center"
          style={{ color: red, fontFamily: "Poppins, sans-serif" }}
        >
          Rewards & Recognition
        </h2>
        <div className="h-[2px] w-24 bg-black mt-4 mb-6 rounded-full mx-auto" />
        <p
          className="text-center text-lg mb-2 font-inter"
          style={{ color: black, fontFamily: "Inter, sans-serif" }}
        >
          Win <span className="font-bold">cash prizes, gold, electric scooters, cars</span> and more!
        </p>
      </motion.div>

      {/* Desktop version: Row of cards */}
      <div className="hidden md:flex gap-6 justify-center items-center mt-6 w-full">
        {rewards.map((item, idx) => (
          <motion.div
            key={idx}
            className={
              item.title === "Certificate" || item.title === "Assessment Report"
                ? "shadow-lg rounded-xl bg-white px-8 py-7 flex flex-col items-center min-w-[210px] max-w-[270px] w-full min-h-[120px]"
                : "shadow-lg rounded-xl bg-white px-3 py-7 flex flex-col items-center min-w-[140px] max-w-[160px] w-full min-h-[120px]"
            }
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
          >
            <p
              className="font-bold mb-2 text-[1.15rem] md:text-[1.3rem] text-center"
              style={{ color: red, fontFamily: "Poppins, sans-serif" }}
            >
              {item.title}
            </p>
            <p className="text-xs md:text-sm text-center text-black leading-snug font-inter">
              {item.subtitle}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile version: stacked rows */}
      <div className="flex flex-col gap-4 w-full md:hidden mt-6">
        {rewards.map((item, idx) => (
          <motion.div
            key={idx}
            className="shadow-lg rounded-xl bg-white px-6 py-6 flex flex-col items-center min-h-[120px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
          >
            <p
              className="font-bold mb-2 text-[1.25rem] text-center"
              style={{ color: red, fontFamily: "Poppins, sans-serif" }}
            >
              {item.title}
            </p>
            <p className="text-base text-center text-black leading-snug font-inter">
              {item.subtitle}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Panel8;
