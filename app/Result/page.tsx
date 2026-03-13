"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ResultPage() {

  const [searchType, setSearchType] = useState("roll"); // roll | omr
  const [studentId, setstudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileLast4, setMobileLast4] = useState("");

  const sendOtp = async () => {

    if (!studentId) {
      setMessage("Please enter value");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/result/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        value: studentId,
        type: searchType
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    if (data.mobile) {
      setMobileLast4(data.mobile.slice(-4));
    }

    setOtpStep(true);
  };

  const verifyOtp = async () => {

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/result/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
	  credentials: "include",
      body: JSON.stringify({
        studentId: studentId,
        otp: otp,
        type: searchType
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    if (data.success && data.studentId) {
      window.location.href = `/Result/${data.studentId}`;
    } else {
      alert("Roll Number / OMR code missing");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-4">
          Hindustan Olympiad 2025 Result
        </h1>

        {!otpStep && (
          <>
          
          {/* RADIO OPTIONS */}

          <div className="flex gap-6 mb-4">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="roll"
                checked={searchType === "roll"}
                onChange={() => setSearchType("roll")}
              />
              Roll Number
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="omr"
                checked={searchType === "omr"}
                onChange={() => setSearchType("omr")}
              />
              OMR Code
            </label>

          </div>

          <label className="block mb-2 font-medium">

            {searchType === "roll"
              ? "Enter Roll Number"
              : "Enter OMR Code"}

          </label>

          <input
            type="text"
            value={studentId}
            onChange={(e) => setstudentId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
            placeholder={
              searchType === "roll"
                ? "Enter Roll Number"
                : "Enter OMR Code"
            }
          />

          <Button
            disabled={loading}
            onClick={sendOtp}
            className="h-10 w-full"
          >
            {loading ? "Sending OTP..." : "Get OTP"}
          </Button>

          <p className="mt-4 text-sm">
            Can’t See Your Result?{" "}
            <a
              href="/resultnotfound"
              target="_blank"
              className="text-red-600 hover:underline"
            >
              Click Here
            </a>
          </p>

          </>
        )}

        {message && (
          <p className="text-center my-4 text-sm text-red-600">
            {message}
          </p>
        )}

        {otpStep && (
          <>
            <p className="text-sm text-red-600 mb-3 text-center">
              OTP sent to the mobile number mentioned in the student OMR sheet
              ending with ****{mobileLast4}
            </p>

            <label className="block mb-2 font-medium">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="6-digit OTP"
            />

            <Button
              onClick={verifyOtp}
              disabled={loading}
              className="h-10 w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}

      </div>
    </div>
  );
}