"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
// Sample Paper Modal
import SamplePaperModal from "@/components/SamplepaperModal";
import MocktestModal from "@/components/mockTestModal";
// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// GTM HandleClickOutside
const handleCtaClick = (cta_text: string, cta_position: string) => {
  const userData = localStorage.getItem("user");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "cta_clicked",
    cta_text,
    section_name: "hindustanolympiad",
    page_type: "hindustanolympiad",
    user_ID: userData,
    user_login_status: userData ? "logged_in" : "non_logged_in",
    data_source: typeof window !== "undefined" && window.location.pathname.includes("/amp") ? "amp" : "non_amp",
    cta_position,
    domain_name: window.location.hostname,
  });
  console.log("CTA Click Event Fired:", {
    event: "cta_clicked",
    cta_text,
    cta_position,
    user_ID: userData ? "User" : "Guest",
    user_login_status: userData ? "logged_in" : "non_logged_in",
    data_source: typeof window !== "undefined" && window.location.pathname.includes("/amp") ? "amp" : "non_amp",
    domain_name: window.location.hostname,
  });
};

const Panel13: React.FC = () => {
  const [showModal, setShowModal] = useState(false); // ✅ inside function body
  const [mockshowModal, setMockShowModal] = useState(false); // ✅ inside function body
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Toggle text every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowComingSoon((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Sample paper */}
      <motion.section
        className="w-full relative bg-[#FFF7F3] py-32 px-2 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        id="sample-papers"
        style={{
          background: 'url("/images/panel13/image1.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="w-full max-w-6xl flex flex-col items-center gap-8 md:gap-8 relative z-10">
          {/* Left: Heading + Line + Subheading + Button */}
          <motion.div
            className="flex flex-col items-center md:items-center mb-8 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#FFF] leading-tight text-center md:text-left"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Start Your Prep
            </h2>
            <div className="h-[2px] w-24 bg-white mt-4 mb-6 mx-auto md:mx-0" />
            <small className="text-[1.4rem] font-bold text-[#FFF]" style={{ fontFamily: "Poppins, sans-serif" }}>Sample Paper</small>
            <p className="text-base sm:text-lg md:text-lg font-medium text-[#FFF] mb-5 mt-3 text-center md:text-left">
              Practice &amp; prepare with our curated sample papers.
            </p>
            <button
              className="rounded-xl bg-[#B2252A] text-white text-base font-bold px-10 py-3 mt-1 shadow-sm transition hover:bg-[#8c171b] active:scale-95 text-center"
              onClick={() => {
                handleCtaClick("sample_paper_coming_soon", "article_bottom");
                setShowModal(true); // ✅ open modal
              }}
            >
              Download Sample Paper
            </button>
          </motion.div>

          {/* Right: Image */}
          {/* <motion.div
            className="flex justify-center items-center w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ delay: 0.4 }}
          >
            <div className="rounded-2xl overflow-hidden w-full max-w-[500px] shadow-lg">
              <Image
                src="/images/panel13/image1.svg"
                alt="Sample Papers"
                width={560}
                height={360}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div> */}
        </div>
      </motion.section>
      {/* End Here */}

      {/* Study Material And Preparetions */}
      <motion.section
        className="w-full bg-[#f7f4f4] py-20 px-4 flex justify-center relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        id="sample-papers"
        >
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 relative">


        {/* LEFT TEXT CONTENT */}
        <motion.div
        className="flex flex-col items-center flex-1 mb-8 md:mb-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2 }}
        >
        <h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#111] leading-tight text-center"
        style={{ fontFamily: "Poppins, sans-serif", lineHeight: "1.5" }}
        >
        Prepare Smarter for the Hindustan Olympiad with
        <a href="https://stemlearn.ai/" target="_blank" className="text-[#e6576f]"> <u>STEMLearn.AI</u></a> App
        </h2>


        <div className="h-[2px] w-24 bg-[#e6576f] mt-10 mx-auto" />
        <button className=" relative mt-8 inline-block text-white font-semibold text-xl sm:text-2xl md:text-3xl lg:text-3xl px-10 py-4 sm:px-14 sm:py-4 md:px-20 md:py-5 lg:px-[6rem] lg:py-5 rounded-full bg-[#e6576f] shadow-[0_8px_15px_rgba(0,0,0,0.3)] border-[4px] sm:border-[5px] md:border-[6px] border-[#dadada] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_12px_25px_rgba(0,0,0,0.35)] "
           onClick={() => 
            { 
              handleCtaClick("preparation_material_and_mock_tests", "article_bottom"); 
              setMockShowModal(true);
            }}
          > 
          <span 
            className=" absolute inset-0 rounded-full border-[5px] sm:border-[6px] md:border-[8px] border-white/50 pointer-events-none drop-shadow-[0_3px_8px_rgba(0,0,0,0.5)] " ></span> 
          Start your <br/> <strong>Olympiad Prep</strong> here 
        </button>
        {/* RIGHT SIDE IMAGE (VISIBLE, NOT BACKGROUND) */}
      </motion.div>
        <div className="flex-1 flex justify-center">
           <img
            src="/images/panel13/mock_test.jpg"
            alt="Mock Test"
            className="
              rounded-3xl 
              shadow-[0_8px_20px_rgba(0,0,0,0.15)]
              max-w-[400px]
              w-full
              object-cover
              transition-all
              duration-500
              filter saturate-[0.9] brightness-[0.98]
            "
          />
        </div>
      </div>
      </motion.section>
      {/* End Here */}
      
      {/* Popup modal */}
      <SamplePaperModal open={showModal} onClose={() => setShowModal(false)} />
      <MocktestModal open={mockshowModal} onClose={() => setMockShowModal(false)} />
    </>
  );
};

export default Panel13;
