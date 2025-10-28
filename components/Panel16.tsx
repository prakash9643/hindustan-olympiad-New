// components/Panel16.tsx
"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "400"],
  variable: "--font-poppins",
});

const Panel16: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<"initial" | "choose" | "school" | "student">("initial");

  const handleCTA = () => setStep("choose");
  const chooseSchool = () => {
    router.push("/eoi/school");
  };
  const chooseStudent = () => {
    router.push("/eoi/student");
  };

  // explicit line-height for consistency
  const headingStyle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    lineHeight: "1.3",
  };  
  // GTM HandleClickOutside
  const handleCtaClick = (cta_text: string, cta_position: string) => {
    const userData = localStorage.getItem("user");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "cta_click",
      cta_text, // e.g. "participate_now"
      section_name: "hindustanolympiad",
      page_type: "hindustanolympiad",
      user_ID: userData,
      user_login_status: userData ? "logged_in" : "non_logged_in",
      data_source: typeof window !== "undefined" && window.location.pathname.includes("/amp") ? "amp" : "non_amp",
      cta_position, // e.g. "article_bottom" or "article_inline"
      domain_name: window.location.hostname,
    });
    // 👇 Add this log for testing
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

  return (
    <motion.section
      className={`${poppins.variable} w-full py-16 flex flex-col items-center bg-white`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      id="participate"
    >
      <motion.h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center whitespace-normal break-words"
        style={headingStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Want to Register for Hindustan Olympiad 2025?
      </motion.h2>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            onClick={() => { chooseSchool(); handleCtaClick("register_as_school", "article_bottom"); }}
            className="bg-[#B2252A] text-white font-bold text-base sm:text-lg px-6 py-3 rounded-md shadow transition hover:bg-[#861B1D]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Register as school
          </button>
          <button
            onClick={() => {chooseStudent(); handleCtaClick("register_for_individual_student", "article_bottom");}}
            className="bg-[#B2252A] text-white font-bold text-base sm:text-lg px-6 py-3 rounded-md shadow transition hover:bg-[#861B1D]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Register for individual student 
          </button>
        </div>
      {/* Initial Heading & CTA */}
      {/* {step === "initial" && (
        <>
          <motion.button
            onClick={handleCTA}
            className="mt-6 bg-[#B2252A] text-white font-bold text-base sm:text-lg px-8 py-3 rounded-md shadow transition hover:bg-[#861B1D]"
            style={{ fontFamily: "Poppins, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
          </motion.button>
        </>
      )} */}

      {/* Choose User Type */}
      {step === "choose" && (
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}          
        >
          <h2
            className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center whitespace-normal"
            style={headingStyle}
          >
            Who are you? (Choose one to proceed)
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={chooseSchool}
              className="bg-[#B2252A] text-white font-bold text-base sm:text-lg px-6 py-3 rounded-md shadow transition hover:bg-[#861B1D]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              School
            </button>
            <button
              onClick={chooseStudent}
              className="bg-[#B2252A] text-white font-bold text-base sm:text-lg px-6 py-3 rounded-md shadow transition hover:bg-[#861B1D]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Student
            </button>
          </div>
        </motion.div>
      )}

      {/* School Message */}
      {step === "school" && (
        <motion.div
          className="max-w-md text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center whitespace-normal"
            style={headingStyle}
          >
            Great! We’d love to have your school onboard.
          </h2>
          <p
            className="text-center text-base sm:text-lg mt-4 mb-4"
          >
            Please reach out to our team to register your school and your students for Hindustan Olympiad 2025.
          </p>
          <div className="text-left space-y-2">
            <p>📞 <strong>Contact:</strong></p>
            <p>Mr. XYZ</p>
            <p>📱 +91-XXXXXXXXXX</p>
            <p>📧 olympiad@hindustantimes.com</p>
          </div>
        </motion.div>
      )}

      {/* Student Message */}
      {step === "student" && (
        <motion.div
          className="max-w-md text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] text-center whitespace-normal"
            style={headingStyle}
          >
            You can only participate via your school.
          </h2>
          <p
            className="text-center text-base sm:text-lg mt-4 mb-4"
          >
            Please coordinate with your school or ask your school coordinator to reach out to us.
          </p>
          <div className="text-left space-y-2">
            <p>📞 <strong>Need help? Contact us at:</strong></p>
            <p>📱 +91-XXXXXXXXXX</p>
            <p>📧 olympiad@hindustantimes.com</p>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default Panel16;
