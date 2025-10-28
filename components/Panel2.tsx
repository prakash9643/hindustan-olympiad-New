// components/Panel2.tsx
"use client";

import { Poppins, Inter } from 'next/font/google';
import { motion } from 'framer-motion';

// Define fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
});

const Panel2 = () => {
  return (
    <motion.div
      id="about"
      className={`${poppins.variable} ${inter.variable}
        bg-[#FFFFFF]
        flex flex-col md:flex-row
        md:min-h-screen
        py-4 sm:py-6 md:py-0 md:px-0 max-w-7xl mx-auto
      `}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Section: Text Content */}
      <motion.div
        className="
          w-full md:w-1/2
          flex justify-center items-center
          py-4 sm:py-6
          md:w-5/12
          md:min-h-[50vh]
          px-4 md:px-0
        "
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="text-center">
          <h2
            className="
              text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem]
              font-poppins font-bold
              text-[#B22B16]
              mb-3
              leading-tight tracking-tight
              whitespace-nowrap
            "
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            About Hindustan Olympiad
          </h2>
          <hr className="border-t-2 border-black w-16 sm:w-20 mx-auto mb-3" />
          <p
            className="
              text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem]
              text-black leading-relaxed
            "
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            A Decade of Excellence
          </p>
          <p className='mt-4'>
            Identified as one of the world’s biggest Olympiads with a legacy of 10 years, Hindustan Olympiad has empowered around 15 Lakh students by providing a unique platform to compete at a national level. It is open for all students of classes 1st to 12th. Unlike most ‘one-subject’ examinations, Hindustan Olympiad reveals the competence levels in all major subjects where every participant is given a certificate and an assessment report.

          </p>
        </div>
      </motion.div>

      {/* Right Section: Collage Image */}
      <motion.div
        className="w-full py-4 md:py-6 px-4  md:w-7/12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <img
          src="/images/panel2/P2Collage.jpg"
          alt="Collage"
          className="
            mx-auto
            h-auto
            object-contain md:object-cover
            object-top md:object-center
          "
        />
      </motion.div>
    </motion.div>
  );
};

export default Panel2;
