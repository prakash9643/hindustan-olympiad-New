"use client";

import { useEffect, useState } from "react";
import { regions, districts } from "@/utils/constants";
import Panel18 from "@/components/Panel18";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award } from "lucide-react";
import { url } from "inspector";
import Image from "next/image";

export default function ResultPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        }
      } catch {
        setError("Failed to load result");
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg font-semibold">
          Loading Result...
        </div>
      </div>;
  if (error) return <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-600">
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

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-100 p-4 md:p-10" 
    style={{
      background:'url("/images/hero/result-star-trophy.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 10%',
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
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow overflow-hidden">

        {/* Student Info */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
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
          <div className="gap-2 grid grid-cols-1 md:grid-cols-4 px-6 py-4 border-b">
            <Info label="Full Name" value={student.name} />
            <Info label="Class" value={student.class} />
            <Info label="Roll Number" value={student.studentId} highlight />
            <Info label="Stream" value={student.stream}  />
          </div>
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="md:col-span-2 border-r">
              <Info label="School Name" value={student.schoolName} />
            </div>
            <Info
              label="Region"
              value={getRegionName(student.region)}
            />
            <Info
              label="District"
              value={getDistrictName(student.region, student.district)}
            />

          </div>
        </div>

        {/* Marks Info */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
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
          <div className="space-y-6 p-6 bg-gray-50">
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
          </div>
          <div className="p-6 bg-white flex gap-4 flex-row items-center">
            <p className="text-gray-600 text-lg w-[15%]"><strong>Total Marks</strong></p>
            <ProgressBar label="Total Marks" value={86} max={100} bold />
          </div>
        </div>



        {/* Rank */}
        <div className="bg-gradient-to-r mx-6 mt-8 mb-10 from-blue-50 to-purple-50 rounded-2xl p-6 shadow">
      
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
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
              rank={1}
              icon={<Trophy size={20} />}
              gradient="bg-gradient-to-r from-green-500 to-emerald-400"
            />

            <RankCard
              title="Region Rank"
              rank={5}
              icon={<Medal size={20} />}
              gradient="bg-gradient-to-r from-blue-500 to-sky-400"
            />

            <RankCard
              title="District Rank"
              rank={2}
              icon={<Award size={20} />}
              gradient="bg-gradient-to-r from-orange-500 to-amber-400"
            />
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-2xl shadow-xl overflow-hidden mt-6">
        {/* Download Certificate & Performance Report */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
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
            <h2 className="text-xl font-bold text-gray-900">Download Your Certificate & Performance Report</h2>
            <p className="text-sm text-gray-500 mt-1">Get your official documents</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 px-6 py-4 mt-4">
          <Button
            className="h-12 block md:inline"
            onClick={() => window.open("/api/result/download-certificate", "_blank")}
          >
            Download Certificate PDF
          </Button>

          <Button
            className="bg-red-100 text-[#a22f35] font-bold px-4 py-2 h-12 rounded-lg hover:bg-red-200 transition"
            onClick={() => window.open("/api/result/download-performance", "_blank")}
          >
            Download Performance Report
          </Button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-red-50 rounded-2xl shadow-xl overflow-hidden mt-6">
        {/* Certificate Correction Request */}
        <div className="px-6 pt-6 flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
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
            <h2 className="text-xl font-bold text-gray-900">Certificate Correction Request</h2>
            <p className="text-sm text-gray-500 mt-1">Request changes to your certificate</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 px-6 py-4">
          <div className="text-sm text-gray-600 mb-2">
            <p>Found an error in your certificate details? Submit a correction request here.
            Button - Request Correction</p>
          </div>
          <div className="flex justify-end">
            <a href="https://forms.gle/GMegDtxsqTARLJUe8" target="_blank" className="h-10 block button bg-[#a22f35] text-[#fff] font-semibold px-6 py-2 rounded-lg transition">
              Request Correction
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-[#FFF9F4] rounded-2xl shadow-xl overflow-hidden mt-6">
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
    <div className="space-y-1 w-[90%] flex items-center gap-4">
      {/* Progress bar */}
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="
            h-full rounded-full
            bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300
            transition-all duration-3000 ease-out
          "
          style={{ width: `${width}%` }}
        />
      </div>
      {/* Label row */}
      <div className="flex justify-between text-sm text-gray-700 w-[10%]">
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

