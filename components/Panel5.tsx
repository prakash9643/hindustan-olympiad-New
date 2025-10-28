// components/Panel5.tsx
"use client";

import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";

// Fonts
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

const features = [
  { icon: "/images/panel5/icon1.svg", text: <>2 hour test with 100 questions from 5 subjects</> },
  { icon: "/images/panel5/icon2.svg", text: <>MCQ based questions</> },
  {
    icon: "/images/panel5/icon3.svg",
    text: (
      <>
        Exam conducted in both 
        <br />
        Hindi and English
      </>
    ),
  },
];

const Panel5: React.FC = () => (
  <section className={`${poppins.variable} ${inter.variable} w-full bg-[#EDB450]`} id="format">
    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full max-w-7xl mx-auto">
      {/* Left (Orange section with heading and features) */}
      <div className="flex flex-col justify-center pl-4 pr-2 md:pr-0 py-10 md:py-16 md:pb-24 h-full">
        <h2
          className="text-2xl md:text-3xl font-bold text-white font-poppins"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Exam Format
        </h2>
        <div className="bg-white h-[3px] w-32 mt-2 mb-10 opacity-90" />
        <div className="flex flex-col space-y-14">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 * idx, duration: 0.6 }}
            >
              <Image
                src={feature.icon}
                alt={`icon${idx + 1}`}
                width={48}
                height={48}
                className="min-w-[48px] min-h-[48px]"
                unoptimized
              />
              <p
                className="text-white text-[17px] md:text-[18px] font-semibold leading-snug font-inter"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right (Image fills right 50%) */}
      <div className="relative w-full h-[340px] md:h-auto min-h-[340px]">
        <Image
          src="/images/panel5/exam-image.jpg"
          alt="Exam"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  </section>
);

export default Panel5;
