"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  const [studentId, setstudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpStep, setOtpStep] = useState(false);
	const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/result/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    setOtpStep(true);
    setMessage("OTP sent to registered mobile number");
  };

	// Verify OTP

	const verifyOtp = async () => {
		setLoading(true);
		setMessage("");

		const res = await fetch("/api/result/verify-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				studentId,
				otp,
			}),
		});

		const data = await res.json();
		console.log("OTP VERIFY RESPONSE:", data); // 👈 MUST CHECK
		setLoading(false);

		if (!res.ok) {
			setMessage(data.message);
			return;
		}
		if (data.success && data.studentId) {
			window.location.href = `/Result/${data.studentId}`;
		} else {
			alert("Student ID missing");
		};
	};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Hindustan Olympiad 2025 Result
        </h1>

        {!otpStep && (
          <>
            <label className="block mb-2 font-medium">
              Enter Roll Number
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setstudentId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="3XXXXX4XXX9"
            />

            {/* <button
              
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              
            </button> */}
						<Button disabled={loading} onClick={sendOtp} className="h-10 block md:inline">
							{loading ? "Sending OTP..." : "Get OTP"}
						</Button>
          </>
        )}

        {message && (
          <p className="text-center my-4 text-sm text-red-600">
            {message}
          </p>
        )}

        {otpStep && (
					<>
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
							className="h-10 block md:inline"
						>
							{loading ? "Verifying..." : "Verify OTP"}
						</Button>
					</>
				)}

      </div>
    </div>
  );
}
