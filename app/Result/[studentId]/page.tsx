"use client";

import { useEffect, useState } from "react";
import { regions, districts } from "@/utils/constants";
import Panel18 from "@/components/Panel18";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award } from "lucide-react";
import { url } from "inspector";
import Image from "next/image";
import { set } from "mongoose";

export default function ResultPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch("/api/result/get-student", {
          method: "POST",

        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Result not found");
        } else {
          setStudent(data.student);
          setResult(data.result);
        }
      } catch {
        setError("Failed to load result");
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, []);

  const handleDownload = async (url: string, filename: string) => {
    try {
      setDownloading(filename);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };


  if (loading) return <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg font-semibold">
          Loading Result...
        </div>
      </div>;
  if (error) return <div className="flex items-center justify-center h-screen px-6">
        <div className="md:text-2xl text-1xl font-bold text-red-600">
          {error}
        </div>
      </div>;

  // Get region and district names
  const getRegionName = (regionId: string | number) => {
    return regions.find(
      r => r.value === String(regionId)
    )?.label || "";
  };

  const getDistrictName = (
    regionId: string | number,
    districtId: string | number
  ) => {
    const districtList =
      districts[String(regionId) as keyof typeof districts] || [];

    return districtList.find(
      d => d.value === String(districtId)
    )?.label || "";
  };


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg font-semibold">
          Loading Result...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-medium">
        {error}
      </div>
    );

    // Subjects for Class 1–10
    const subjectsUpto10 = [
      "MATHEMATICS",
      "SCIENCE",
      "LOGICALREASONING",
      "ENGLISH",
      "GENERALKNOWLEDGE",
    ];

    // Stream wise subjects for 11–12
    const streamSubjects: Record<string, string[]> = {
      PCB: ["PHYSICS", "CHEMISTRY", "BIOLOGY", "ENGLISH"],
      PCM: ["PHYSICS", "CHEMISTRY", "MATHEMATICS", "ENGLISH"],
      Commerce: ["ACCOUNTS", "ECONOMICS", "BUSINESSSTUDIES", "MATHEMATICS", "ENGLISH"],
      Arts: ["HISTORY", "POLITICALSCIENCE", "ECONOMICS", "ENGLISH", "SOCIOLOGY"],
    };

    const studentClass = Number(result.class);
    const studentStream = result.stream;

    let subjects: string[] = [];

    if (studentClass >= 1 && studentClass <= 10) {
      subjects = subjectsUpto10;
    } else if (studentClass === 11 || studentClass === 12) {
      subjects = streamSubjects[studentStream] || [];
    }

    // Class 11–12 students also have the common subjects
    function formatClassWithOrdinal(classNumber: number | string) {
      const num = Number(classNumber);

      if (!num) return "";

      if (num % 100 >= 11 && num % 100 <= 13) {
        return num + "th";
      }

      switch (num % 10) {
        case 1:
          return num + "st";
        case 2:
          return num + "nd";
        case 3:
          return num + "rd";
        default:
          return num + "th";
      }
    }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-100 p-4 md:p-10" 
    style={{
      background:'url("/images/hero/bg-2.jpeg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top center',
      backgroundSize: 'cover',
    }}
    >
      {/* Header */}
      {/* <div className="p-6 text-base-100 mb-6">
        <h1 className="text-2xl md:text-[2.5rem] font-bold text-center">
          {student.name} !
        </h1>
        <p className="text-sm opacity-90">
          Roll Number: {student.studentId}
        </p>
      </div> */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow overflow-hidden">

        {/* Student Info */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-r from-[#7f2328] via-[#a22f35] to-[#d45a60] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
            <p className="text-sm text-gray-500 mt-1">Personal information & profile</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl mx-6 mt-2">
          <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:px-6 px-3 py-4 border-b">
            <Info label="Full Name" value={result.studentname} />
            <Info label="Class" value={formatClassWithOrdinal(result.class)} />
            <Info label="Roll Number" value={result.studentId} highlight />
            <Info label="Stream" value={result.stream || "Not Applicable"}  />
          </div>
          <div className="md:px-6 px-3 py-4 grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="md:col-span-2 border-r">
              <Info label="School Name" value={result.schoolname} />
            </div>
            <Info
              label="Region"
              value={result.region}
            />
            <Info
              label="District"
              value={result.district}
            />

          </div>
        </div>

        {/* Marks Info */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-r from-[#7f2328] via-[#a22f35] to-[#d45a60] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Marks</h2>
            <p className="text-sm text-gray-500 mt-1">Scores & performance metrics</p>
          </div>
        </div>
        <div className="rounded-xl shadow mx-6 mt-3">
          <div className="space-y-6 md:p-6 p-3 bg-gray-50">
            {subjects.map((subject) => (
              <div key={subject} className="md:flex block md:gap-4 gap-2 items-center">
                <p className="text-gray-600 w-24 truncate">
                  <strong>{subject}</strong>
                </p>
                <ProgressBar
                  label=""
                  value={Number(result[subject]) || 0}
                  max={20}
                />
              </div>
            ))}
          </div>

          {/* <div className="space-y-6 p-6 bg-gray-50">
            <div className="flex gap-4 flex-row items-center">
              <p className="text-gray-600">Section <strong>A</strong></p>
              <ProgressBar label="" value={18} max={20} />
            </div>
            <div className="flex gap-4 flex-row items-center">
              <p className="text-gray-600">Section <strong>B</strong></p>
              <ProgressBar label="Section B" value={16} max={20} />
            </div>
            <div className="flex gap-4 flex-row items-center">
              <p className="text-gray-600">Section <strong>C</strong></p>
              <ProgressBar label="Section C" value={19} max={20} />
            </div>
            <div className="flex gap-4 flex-row items-center">
              <p className="text-gray-600">Section <strong>D</strong></p>              
              <ProgressBar label="Section D" value={17} max={20} />
            </div>
            <div className="flex gap-4 flex-row items-center">
              <p className="text-gray-600">Section <strong>E</strong></p>
              <ProgressBar label="Section E" value={16} max={20} />
            </div>
          </div> */}
          <div className="p-6 bg-white md:flex block md:gap-4 gap-2 flex-row items-center">
            <p className="text-gray-600 w-24"><strong>Total Marks</strong></p>
            <ProgressBar label="Total Marks" value={result.fullmark} max={100} bold />
          </div>
        </div>



        {/* Rank */}
        <div className="bg-gradient-to-r mx-6 mt-8 mb-10 from-blue-50 to-purple-50 rounded-2xl md:p-6 p-3 shadow">
      
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-r from-[#7f2328] via-[#a22f35] to-[#d45a60] rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rank</h2>
              <p className="text-sm text-gray-500 mt-1">Current standings & positions</p>
            </div>
          </div>

          {/* Rank Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <RankCard
              title="National Rank"
              rank={result.nationalrank}
              icon={<Trophy size={20} />}
              gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
            />

            <RankCard
              title="Region Rank"
              rank={result.regionrank}
              icon={<Medal size={20} />}
              gradient="bg-gradient-to-r from-orange-400 to-orange-600"
            />

            <RankCard
              title="District Rank"
              rank={result.districtrank}
              icon={<Award size={20} />}
              gradient="bg-gradient-to-r from-gray-400 to-gray-600"
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-gray-100 rounded-2xl shadow-xl overflow-hidden mt-6">
        {/* Download Certificate & Performance Report */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-r from-[#7f2328] via-[#a22f35] to-[#d45a60] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="md:text-xl text-md font-bold text-gray-900">Download Your Certificate & Performance Report</h2>
            <p className="text-sm text-gray-500 mt-1">Get your official documents</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 mt-4">
          <Button
              className="h-12"
              disabled={downloading === "certificate.pdf"}
              onClick={() =>
                handleDownload("/api/result/download-certificate", "certificate.pdf")
              }
            >
              {downloading === "certificate.pdf"
                ? "Downloading..."
                : "Download Certificate PDF"}
            </Button>

          <Button
            className="bg-red-100 text-[#a22f35] font-bold px-4 py-2 h-12 rounded-lg hover:bg-red-200 transition"
            disabled={downloading === "performance.pdf"}
            onClick={() =>
              handleDownload("/api/result/download-performance", "performance.pdf")
            }
          >
            {downloading === "performance.pdf"
              ? "Downloading..."
              : "Download Performance Report"}
          </Button>

        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-red-50 rounded-2xl shadow-xl overflow-hidden mt-6">
        {/* Certificate Correction Request */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-r from-[#7f2328] via-[#a22f35] to-[#d45a60] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="md:text-xl text-md font-bold text-gray-900">Certificate Correction Request</h2>
            <p className="text-sm text-gray-500 mt-1">Request changes to your certificate</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4">
          <div className="text-sm text-gray-600 mb-2">
            <p>Found an error in your certificate details? Submit a correction request here.
            Button - Request Correction</p>
          </div>
          <div className="flex md:justify-end justify-center">
            <a href="https://forms.gle/GMegDtxsqTARLJUe8" target="_blank" className="h-10 block button bg-[#a22f35] text-[#fff] font-semibold px-6 py-2 rounded-lg transition">
              Request Correction
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-[#FFF9F4] rounded-2xl shadow-xl overflow-hidden mt-6">
        <div className="px-6 pt-3 mt-3">
          <h2 className="text-xl font-bold">Footer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 px-6 py-4">
          <ul className="text-sm text-black-600 flex flex-col gap-2">
            <li>
              1)  In case 2 or more students have a common score at an overall level, student with
                  higher marks in Section A will get higher rank. In case 2 or more students have
                  the same marks at an overall level as well as in Section A, student with higher
                  marks in Section B will get higher rank. Same process will be followed until we
                  get a unique rank for all the students. In case 2 or more students share same
                  marks at an overall level as well as in each of the 5 sections, younger student (by
                  DOB) will get a higher rank
            </li>            
            <li>
              2)  No student will be awarded more than 1 Prize
            </li>            
            <li>
              3)  Dates for the felicitation ceremony will be shared with you shortly
            </li>
          </ul>
        </div>
      </div>
    </div>
    {/* <Panel18 /> */}
    <Footer />
    </>
  );
}

function Info({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="border-r ml-2 last:border-r-0"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 text-center ${
        highlight
          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
          : "bg-gray-50"
      }`}
    >
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

// Progress bar
function ProgressBar({
  label,
  value,
  max,
  bold = false,
}: {
  label: string;
  value: number;
  max: number;
  bold?: boolean;
}) {
  const percent = Math.min((value / max) * 100, 100);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 200);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="space-y-1 md:w-[90%] flex items-center gap-1">
      {/* Progress bar */}
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="
            h-full rounded-full
           bg-gradient-to-r from-[#7f2328] via-[#a22f35] to-[#d45a60]
            transition-all duration-3000 ease-out
          "
          style={{ width: `${width}%` }}
        />
      </div>
      {/* Label row */}
      <div className="flex justify-between text-sm text-gray-700 md:w-[10%]">
        {/* <span className={bold ? "font-semibold" : ""}>{label}</span> */}
        <span className={bold ? "font-semibold" : ""}>
          <strong>{value}</strong>  / {max}
        </span>
      </div>

    </div>
  );
}

// Rank Card
function RankCard({
  title,
  rank,
  icon,
  gradient,
}: {
  title: string;
  rank: number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
      <div
        className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium ${gradient}`}
      >
        {icon}
        <p className="text-lg font-bold">{title}</p> 
      </div>

      <div className="flex items-center justify-center py-6">
        <span className="text-3xl font-bold text-gray-800">#{rank}</span>
      </div>
    </div>
  );
}

