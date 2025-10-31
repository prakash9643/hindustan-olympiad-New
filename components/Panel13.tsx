"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
// Sample Paper Modal
import SamplePaperModal from "@/components/SamplepaperModal";
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
    event: "cta_click",
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
    event: "cta_click",
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
        className="w-full relative bg-[#FFF7F3] py-12 px-2 flex justify-center"
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
        className="w-full bg-white py-16 px-2 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        id="sample-papers"
      >
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-8">
          {/* Left: Heading + Line + Subheading + Button */}
          <motion.div
            className="flex flex-col items-center flex-1 mb-8 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] leading-tight text-center md:text-left"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Study material and mock tests
            </h2>
            <div className="h-[2px] w-24 bg-black mt-4 mx-auto md:mx-0" />
            <p className="text-base sm:text-lg md:text-lg font-medium text-[#2d2d2d] mb-5 text-center md:text-left mt-8">
              Enjoy <strong>FREE</strong> ACCESS to online mock tests and preparation material worth <strong>Rs.500</strong> on the <strong className="text-[#B2252A]">STEMLearn.AI</strong> app
            </p>
            <div className="relative flex flex-col items-center">
              <button
                className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Preparation Material and Mock Tests
              </button>

              {/* Animated Coming Soon below button */}
              <motion.span
                className="text-[1.5rem] text-[#B2252A] font-bold"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }} // zoom in and out
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                style={{ width: "100%", marginTop: "1.5rem", textAlign: "center" }}
              >
                Coming Soon
              </motion.span>
            </div>
            {/* <small className="mt-2 text-gray-600 text-center md:text-left font-bold">
              Powered by
              <span aria-hidden="true">
                <img src="/STEMLearn.AI-logo-white.png" alt="(external link)" className="inline-block ml-1 w-12 h-12" />
              </span>
            </small> */}
          </motion.div>
        </div>
      </motion.section>
      {/* End Here */}
      
      {/* Popup modal */}
      <SamplePaperModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Panel13;
