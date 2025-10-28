import "./globals.css";
import type { Metadata } from "next";
import { Inter, Mulish } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/toast-provider";
import { ToastContainer } from "@/components/toast-container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from 'next/script';
import DataLayerEvents from "./dataLayer-files/dataLayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hindustan Olympiad",
  description: "Get ready for Hindustan Olympiad 2025! Register now and explore the syllabus, exam dates, and more.",
  keywords: [
    "Hindustan Olympiad",
    "Hindustan Olympiad 2025",
    "Hindustan Olympiad syllabus",
    "Hindustan Olympiad exam dates",
    "Hindustan Olympiad registration",
    "Hindustan Olympiad results",
    "Hindustan Olympiad online",
  ],
  authors: [{ name: "Prakash Jha" }],
  openGraph: {
    title: "Hindustan Olympiad – Ignite your competitive spirit!",
    description:
      "",
    url: "https://hindustanolympiad.in",
    siteName: "Hindustan Olympiad",
    images: [
      {
        url: "https://www.hindustanolympiad.in/wp-content/uploads/2024/07/cropped-Hindustan-Olympiad-logo_final-1.png",
        width: 1200,
        height: 630,
        alt: "Hindustan Olympiad – Ignite your competitive spirit!",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hindustan Olympiad – Ignite your competitive spirit!",
    description:
      "",
    images: ["https://www.hindustanolympiad.in/wp-content/uploads/2024/07/cropped-Hindustan-Olympiad-logo_final-1.png"],
    creator: "@HindustanOlympiad",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=GTM-MXGJR36"></script>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GTM-MXGJR36');
            `,
          }}
        />
        {/* GTM Script */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id=GTM-MXGJR36';
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MXGJR36');
          `}
        </Script>
      </head>
      <body
        suppressContentEditableWarning
        suppressHydrationWarning
        className={inter.className + " pt-[80px] p-0 m-0"}
      >
        {/* GTM NoScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MXGJR36"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ToastProvider>
          <Navbar />
          <DataLayerEvents  />
          {children}
          <ToastContainer />
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}