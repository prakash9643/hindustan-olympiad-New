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
  <section className="w-full bg-white py-8 md:py-12 flex items-center justify-center min-h-[390px]">
    <div className="max-w-6xl w-full flex flex-col md:flex-row items-stretch justify-between gap-10 px-4 md:px-8">
      {/* Left Side: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
        {/* Heading */}
        <motion.h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] mb-2 text-center md:text-left"
          style={{ fontFamily: "Poppins, sans-serif" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          Lucky Draw Prizes
        </motion.h2>
        {/* Divider */}
        <div className="h-[2px] w-24 bg-black mt-4 mb-6 rounded-full mx-auto md:mx-0" />
        {/* Reward Lines */}
        <div className="mt-0 space-y-6 text-[1.08rem] md:text-[1.13rem] text-black font-[500] text-center md:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="font-bold">Score above 90%:</span>
            <ul className="list-disc pl-5 mt-2">
              <li>1 lucky winner will
                <span className="font-bold text-[#B2252A]"> win a car</span>
              </li>


            </ul>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <span className="font-bold">Score above 75%:</span>
            <ul className="list-disc pl-5 mt-2">
              <li>5 lucky winners will win
                <span className="font-bold text-[#B2252A]"> electic scooters</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Prize Illustration */}
      <motion.div
        className="w-full md:w-1/2 flex relative min-h-[240px] items-end justify-center mt-8 md:mt-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <Image
          src="/images/panel10/prz1.png"
          alt="Lucky Draw Prizes"
          width={500}
          height={300}
          className="max-w-[380px] w-full h-auto self-end"
          priority
          unoptimized
        />
      </motion.div>
    </div>
  </section>
);

export default Panel10;
