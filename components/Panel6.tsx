// components/Panel6.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins, Inter } from "next/font/google";

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

const TABS = [
  { label: "For class 1st – 10th", key: "junior" },
  { label: "For class 11th & 12th", key: "senior" },
];

const SUBJECTS = {
  junior: [
    {
      title: "",
      color: "bg-[#EDB450]",
      list: [
        "Mathematics",
        "Science",
        "General Knowledge",
        "English",
        "Logical Reasoning",
      ],
    },
  ],
  senior: [
    {
      title: "Science (PCM)",
      color: "bg-[#EDB450]",
      list: ["Physics", "Chemistry", "Maths", "English", "Logical Reasoning"],
    },
    {
      title: "Science (PCB)",
      color: "bg-[#FFF8F0]",
      list: ["Physics", "Chemistry", "Biology", "English", "Logical Reasoning"],
    },
    {
      title: "Commerce With Maths",
      color: "bg-[#EDB450]",
      list: ["Economics", "Accountancy", "Maths", "English", "Logical Reasoning"],
    },
    {
      title: "Commerce Without Maths",
      color: "bg-[#FFF8F0]",
      list: [
        "Economics",
        "Accountancy",
        "Business Studies",
        "English",
        "Logical Reasoning",
      ],
    },
    {
      title: "Humanities",
      color: "bg-[#EDB450]",
      list: [
        "Political Science",
        "History",
        "Economics",
        "English",
        "Logical Reasoning",
      ],
    },
  ],
};

type SubjectKey = keyof typeof SUBJECTS;

const tabVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.44, type: "spring" as const } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { duration: 0.22 } 
  },
};

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


const Panel6 = () => {
  const [selected, setSelected] = useState<SubjectKey>("junior");

  return (
    <section id="classes-subjects" className={`${poppins.variable} ${inter.variable} w-full py-10 bg-transparent max-w-7xl mx-auto`}>
      {/* Heading */}
      <div className="w-full flex flex-col items-center">
        <h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#A62828] font-poppins text-center"
          style={{ lineHeight: 1.2 }}
        >
          Subjects &amp; Streams
        </h2>
        <div className="h-[2px] w-24 bg-black mt-4 mb-6 rounded-full mx-auto" />
      </div>

      {/* Card container */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Outer Yellow Border */}
          <div className="relative border-8 border-[#EDB450] rounded-2xl overflow-hidden bg-[#EDB450]/10 p-0">
            {/* Tabs */}
            <div className="flex w-full bg-[#EDB450]">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`
                    flex-1 py-3 text-[1.07rem] sm:text-[1.14rem] font-bold font-poppins
                    transition-all duration-200
                    ${
                      selected === tab.key
                        ? "bg-white text-black"
                        : "bg-[#EDB450] text-black"
                    }
                  `}
                  style={{
                    borderBottom:
                      selected === tab.key
                        ? "4px solid #A62828"
                        : "4px solid #EDB450",
                  }}
                  onClick={() => {setSelected(tab.key as SubjectKey) ; handleWidgetClick(tab.label, "hindustanolympiad2025", "#classes-subjects");}}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-b-2xl pt-8 pb-8 px-3 sm:px-8 min-h-[170px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex flex-col gap-6">
                    {SUBJECTS[selected].map((group: { title: string; color: string; list: string[] }, idx: number) => (
                      <div
                        key={idx}
                        className={`
                          rounded-xl px-3 sm:px-6 py-4 ${group.color} mb-2 w-full
                        `}
                        style={{ minHeight: 70 }}
                      >
                        <div className="font-bold text-[1.12rem] mb-2 font-poppins">
                          {group.title}
                        </div>
                        <div
                          className={`
                            flex flex-wrap md:flex-nowrap
                            gap-x-8 gap-y-1
                            text-[1rem] sm:text-[1.06rem]
                            font-inter
                            ${group.list.length > 4 ? "justify-between" : ""}
                          `}
                        >
                          {group.list.map((subj, i) => (
                            <span
                              key={i}
                              className="min-w-[120px] sm:min-w-[130px] text-base md:text-[1.08rem]"
                            >
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Panel6;
