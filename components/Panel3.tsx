// components/Panel3.tsx
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
  {
    icon: "/images/panel3/icon1.svg",
    text: (
      <>
        India’s largest multi-subject Olympiad, trusted by over a <strong>million participants</strong> and backed by Hindustan’s legacy
      </>
    ),
  },
  {
    icon: "/images/panel3/icon2.svg",
    text: (
      <>
        Opens up a competitive stage for students from Grade 1 to 12, across <strong>boards and geographies</strong>
      </>
    ),
  },
  {
    icon: "/images/panel3/icon3.svg",
    text: (
      <>
        <strong>Builds foundational skills</strong> in problem solving, logical reasoning and critical thinking
      </>
    ),
  },
];

const Panel3: React.FC = () => {
  return (
    <motion.section
      className={`${poppins.variable} ${inter.variable} w-full bg-[#FEF1E5]`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      id="journey"
    >
      <div className="w-full flex flex-col md:flex-row m-0 items-stretch max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-10 space-y-6">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
            >
              <Image
                src={item.icon}
                alt={`Icon ${index + 1}`}
                width={56}
                height={56}
                className="w-[56px] h-[56px] mb-3"
              />
              <p className="text-[18px] font-[400] leading-[1.6] max-w-md">
                {item.text}
              </p>
              {index < features.length - 1 && <hr className="border-gray-300 w-full mt-4" />}
            </motion.div>
          ))}
        </div>

        {/* Right Section: Image */}
        <div className="w-full md:w-1/2 flex items-start justify-center m-0 p-0">
          <Image
            src="/images/panel3/image.jpg"
            alt="Student"
            width={800}
            height={600}
            className="h-full object-cover"
            priority
            unoptimized
          />
        </div>
      </div>
    </motion.section>
  );
};

export default Panel3;
