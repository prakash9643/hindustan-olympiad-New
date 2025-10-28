// components/Panel9.tsx
"use client";

import { Poppins, Inter } from "next/font/google";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const panelData = [
  
  {
    icon: "/images/panel9/icon1.svg",
    title: "All India Toppers",
    text: (
      <>
        <strong>Top 3</strong> performers of each class will win <strong> Latops ,</strong> <strong> Tablets </strong>and <strong> Smart phones </strong> respectively
      </>
    ),
  },
  {
    icon: "/images/panel9/icon2.svg",
    title: "Regional Toppers",
    text: (
      <>
        Top <strong> 3 </strong> performers of each class will recieve certificates,  assessment reports and prizes worth <strong> Rs.5100,</strong> <strong>Rs.4100,</strong> <strong> Rs
3100 </strong>
      </>
    ),
  },
  {
    icon: "/images/panel9/icon3.svg",
    title: "District Toppers",
    text: (
      <>
        Top <strong> 3 </strong> performers of each class will recieve certificates,  assessment reports and prizes worth <strong>Rs.3100,</strong> <strong>Rs.2100,</strong> <strong>Rs
1100</strong>
      </>
    ),
  },
];

const Panel9: React.FC = () => (
  <section className="w-full bg-[#FEF3E6] py-10 md:py-24 flex flex-col items-center md:pb-0">
    <div className="w-full max-w-7xl flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-6 px-4 md:px-10">
      {panelData.map((item, idx) => (
        <motion.div
          key={item.title}
          className="flex flex-col items-center md:items-center mb-8 md:mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ delay: idx * 0.2 }}
        >
          <Image
            src={item.icon}
            alt={item.title}
            width={60}
            height={60}
            className="mb-3 md:mb-4"
            unoptimized
          />
          <h3 className="text-[20px] md:text-[24px] font-bold text-black mb-2 text-center">
            {item.title}
          </h3>
          <p className="text-[16px] md:text-[17px] text-black text-center max-w-[260px] md:max-w-none">
            {item.text}
          </p>
        </motion.div>
      ))}
    </div>
    {/* Illustration: animated in view */}
    <motion.div
      className="flex justify-center w-full mt-8 md:mt-12 mb-0 pb-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ delay: panelData.length * 0.2 }}
    >
      <Image
        src="/images/panel9/icon5.svg"
        alt="Toppers Illustration"
        width={380}
        height={260}
        className="h-auto mb-0 pb-0"
        priority
        unoptimized
      />
    </motion.div>
  </section>
);

export default Panel9;
