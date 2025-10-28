// components/Panel15.tsx
"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});

const PHOTOS = [
  "/images/panel15/mediapic1.jpeg",
  "/images/panel15/mediapic2.jpeg",
  "/images/panel15/mediapic3.jpeg",
  "/images/panel15/mediapic4.jpeg",
  "/images/panel15/mediapic5.jpeg",
  "/images/panel15/mediapic6.jpeg",
];

const Panel152: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section
      className={`${poppins.variable} w-full bg-[#f7f4f4] pb-12 flex flex-col items-center`}
    >
      {/* Two side-by-side cards */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-2 md:gap-4 px-4">
        {/* Photo Gallery Card */}
        <div className="flex-1 bg-[#eeae4c] rounded-lg p-4 md:p-6 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-full">
            {PHOTOS.map((src, i) => (
              <div
                key={i}
                className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-white cursor-pointer"
                onClick={() => setSelectedImage(src)}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            {/* Full-size image */}
            <img
              src={selectedImage}
              alt="Expanded"
              className="mx-auto max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Panel152;