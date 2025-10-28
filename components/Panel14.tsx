// components/Panel14.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Font import for Poppins
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: "700", variable: "--font-poppins" });

const testimonials = [
  { title: "Students Speak", link: "https://www.youtube.com/embed/YNOO5_P5kYA" },
  { title: "Students Speak", link: "https://www.youtube.com/embed/sTVbRSwE_Ec" },
  { title: "Educator Experience", link: "https://www.youtube.com/embed/pPuQfNVMroo" },
  { title: "Educator Experience", link: "https://www.youtube.com/embed/HqktuhWrm2U" },
];

// Animation variant for fade-up
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CARD_WIDTH = 370; // px, controls how big each card is
const GAP = 18;         // px, spacing between cards




export default function Panel14() {
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [current, setCurrent] = useState(0);

  // Responsive
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

  // Clamp on resize
  useEffect(() => {
    if (current > testimonials.length - slidesToShow) setCurrent(0);
  }, [slidesToShow, current]);

  const next = () => setCurrent(prev => prev === testimonials.length - slidesToShow ? 0 : prev + 1);
  const prev = () => setCurrent(prev => prev === 0 ? testimonials.length - slidesToShow : prev - 1);

  const totalWidth = testimonials.length * (CARD_WIDTH + GAP) - GAP;
  const translateX = -(current * (CARD_WIDTH + GAP));

  // GTM HandleGTMEvent
  interface WidgetClickEvent {
    event: string;
    cta_text: string;
    widget_name: string;
    section_name: string;
    target_url: string;
    page_type: string;
    user_login_status: "logged_in" | "non_logged_in";
    user_ID: string | null;
    data_source: "amp" | "non_amp";
  }  
  const handleWidgetClick = (
    cta_text: string,
    widget_name: string,
    target_url: string
  ): void => {
    const userData = localStorage.getItem("user");
    window.dataLayer = window.dataLayer || [];
    const event: WidgetClickEvent = {
      event: "widget_clicked",
      cta_text, // e.g. "youtube_video"
      widget_name, // e.g. "hindustanolympiad2025"
      section_name: "hindustanolympiad",
      target_url,
      page_type: "hindustanolympiad",
      user_login_status: userData ? "logged_in" : "non_logged_in",
      user_ID: userData ? "User" : null,
      data_source: typeof window !== "undefined" && window.location.pathname.includes("/amp") ? "amp" : "non_amp",
    };
    window.dataLayer.push(event);
    console.log("GTM Event Pushed:", event);
  };

  return (
    <motion.section
      className={`${poppins.variable} relative bg-[#FEF3E6] py-12 flex flex-col items-center overflow-visible`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      id="testimonials"
    >
      {/* Heading */}
      <motion.h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        Testimonials
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
        Hear What Our Participants and Educators Have to Say.
      </motion.p>

      <div className="relative w-full max-w-6xl flex items-center justify-center px-2">
        {/* Prev Arrow */}
        <motion.button
          aria-label="Previous"
          onClick={prev}
          className="hidden md:flex absolute -left-8 z-20 top-1/2 -translate-y-1/2 bg-[#B2252A] text-white rounded-full w-11 h-11 text-2xl items-center justify-center shadow-lg"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          &#8249;
        </motion.button>

        {/* Slides Container */}
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
            style={{ width: totalWidth, transform: `translateX(${translateX}px)`, gap: `${GAP}px` }}
          >
            {testimonials.map((t, index) => (
              <div
                key={t.title + index}
                style={{ width: `${CARD_WIDTH}px`, minWidth: `${CARD_WIDTH}px`, maxWidth: `${CARD_WIDTH}px`, background: "white", borderRadius: "18px", boxShadow: "0 3px 16px #0001", border: "1px solid #ececec", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}
              >
                <div className="w-full aspect-video" onClick={() => handleWidgetClick(t.title, "hindustanolympiad2025", t.link)}>
                  <iframe                    
                    src={t.link}
                    title={t.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"                    
                  />
                </div>
                <p className="py-3 text-center text-base font-semibold text-black">
                  {t.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next Arrow */}
        <motion.button
          aria-label="Next"
          onClick={next}
          className="hidden md:flex absolute -right-8 z-20 top-1/2 -translate-y-1/2 bg-[#B2252A] text-white rounded-full w-11 h-11 text-2xl items-center justify-center shadow-lg"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          &#8250;
        </motion.button>
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
