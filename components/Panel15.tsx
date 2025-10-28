"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Poppins } from "next/font/google"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
})

const PHOTOS = [
  "/images/panel15/img1.jpg",
  "/images/panel15/img2.jpg",
  "/images/panel15/img3.jpg",
  "/images/panel15/img4.jpg",
  "/images/panel15/mediapic1.jpeg",
  "/images/panel15/mediapic2.jpeg",
  "/images/panel15/mediapic3.jpeg",
  "/images/panel15/mediapic4.jpeg",
  "/images/panel15/mediapic5.jpeg",
  "/images/panel15/mediapic6.jpeg",

]

const NEWS = [
  "/images/panel15/olympiadcoverage.jpeg",
  "/images/panel15/olympiadcoverage1.png",
  "/images/panel15/olympiadcoverage2.jpeg",
  "/images/panel15/olympiadcoverage3.jpeg",
]

const Panel15: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [currentGallery, setCurrentGallery] = useState<string[]>([])
  const [showAllPhotos, setShowAllPhotos] = useState<boolean>(false)

  const displayedPhotos = showAllPhotos ? PHOTOS : PHOTOS.slice(0, 4)

  const openLightbox = (imageSrc: string, gallery: string[]) => {
    const index = gallery.findIndex((src) => src === imageSrc)
    setCurrentImageIndex(index)
    setCurrentGallery(gallery)
    setSelectedImage(imageSrc)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (currentGallery.length === 0) return

    let newIndex
    if (direction === "prev") {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentGallery.length - 1
    } else {
      newIndex = currentImageIndex < currentGallery.length - 1 ? currentImageIndex + 1 : 0
    }

    setCurrentImageIndex(newIndex)
    setSelectedImage(currentGallery[newIndex])
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setCurrentGallery([])
    setCurrentImageIndex(0)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return

      if (e.key === "ArrowLeft") {
        navigateImage("prev")
      } else if (e.key === "ArrowRight") {
        navigateImage("next")
      } else if (e.key === "Escape") {
        closeLightbox()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, currentImageIndex, currentGallery])

  return (
    <section
      id="glimpses"
      className={`${poppins.variable} w-full bg-[#f7f4f4] py-10 md:py-16 md:pb-8 flex flex-col items-center`}
    >
      {/* Section Heading */}
      <h2 className="font-bold text-[2rem] md:text-[2.3rem] text-[#B2252A] text-center mb-2">Olympiad 2024</h2>
      <div className="h-[2px] w-24 bg-black mb-6" />

      {/* Two side-by-side cards */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4 px-4">
        {/* Photo Gallery Card */}
        <div className="flex-1 bg-[#eeae4c] rounded-lg p-4 md:p-6 flex flex-col items-center">
          <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Photo Gallery</h3>
          <div className="grid grid-cols-2 gap-2 md:gap-4 w-full mb-4">
            {displayedPhotos.map((src, i) => (
              <div
                key={i}
                className="relative w-full aspect-square rounded-lg overflow-hidden bg-white cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(src, PHOTOS)}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* View More Button */}
          {PHOTOS.length > 4 && (
            <Button
              onClick={() => openLightbox(PHOTOS[4], PHOTOS)}
              className="bg-white text-[#eeae4c] hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              View more 
            </Button>
          )}

        </div>

        {/* News Glimpses Card */}
        <div className="flex-1 bg-[#eeae4c] rounded-lg p-4 md:p-6 flex flex-col items-center">
          <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Newspaper Coverage</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
            {NEWS.map((src, i) => (
              <div
                key={i}
                className="relative w-full aspect-square rounded-lg overflow-hidden bg-white cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(src, NEWS)}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`News image ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 200px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox Overlay with Navigation */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            {/* Previous button */}
            {currentGallery.length > 1 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("prev")
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next button */}
            {currentGallery.length > 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("next")
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Image container */}
            <div
              className="relative w-full h-full flex items-center justify-center p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Expanded view"
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
            </div>

            {/* Image counter */}
            {currentGallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {currentGallery.length}
              </div>
            )}

          </div>

          {/* Thumbnail strip */}
          {currentGallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
              <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {currentGallery.map((src, index) => (
                  <div
                    key={index}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${index === currentImageIndex
                        ? "border-white shadow-lg "
                        : "border-transparent hover:border-gray-400 opacity-70 hover:opacity-100"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                      setSelectedImage(src)
                    }}
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && <div className="absolute inset-0 bg-white bg-opacity-20" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default Panel15