// components/Panel7.tsx
"use client";

import { Poppins, Inter } from "next/font/google";
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

const videoIds = [
  "sFsenivUj7w",
  "wGpm9CjzA6g",
  "pfnNuVL2bhQ",
];


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

const Panel7: React.FC = () => (
  <section
    id="olympiad-2025"
    className={`${poppins.variable} ${inter.variable} w-full py-12 px-4 bg-white max-w-7xl mx-auto pb-24`}
  >
    {/* Animated Heading & Subheading */}
    <motion.div
      className="max-w-6xl mx-auto flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#A62828] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Hindustan Olympiad 2025
      </h2>
      <div className="bg-black h-[2px] w-24 mt-4 mb-6 rounded-full" />
    </motion.div>

    {/* Videos with staggered fade-up */}
    <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
      {videoIds.map((id, idx) => (
        <motion.div
          key={id}
          className="bg-[#F3F3F3] rounded-xl overflow-hidden flex items-center justify-center w-full max-w-xs md:max-w-sm h-56 md:h-64"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: idx * 0.2, duration: 0.6 }}
          onClick={() => handleWidgetClick(`video_${idx + 1}`, "hindustanolympiad2025", `https://www.youtube.com/watch?v=${id}`)}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            title={`YouTube video ${idx + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  </section>
);

export default Panel7;
