"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export default function SchoolResultPage() {
  const [schoolId, setSchoolId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [mobileLast4, setMobileLast4] = useState("");

  // Send OTP
  const sendOtp = async () => {
    if (!schoolId) {
        setMessage("Please enter value");
        return;
    }
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/coordinator-result/send-otp", {
      method: "POST",
      body: JSON.stringify({ schoolId }),
    });

    const data = await res.json();
    // console.log("API RESPONSE:", data);
    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }
    if (data.mobile) {
         setMobileLast4(data.mobile.slice(-4));
    }
    console.log(data.otp)
    if (data.otp){
        setServerOtp(data.otp);
    }

    setStep(2);
  };

  // Verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/coordinator-result/verify-otp", {
      method: "POST",
      body: JSON.stringify({ schoolId, otp }),
    });

    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      alert(data.message);
      return;
    }

    fetchStudents();
  };

  // Fetch Students
  const fetchStudents = async () => {
    const res = await fetch("/api/coordinator-result/fetch-student", {
      method: "POST",
      body: JSON.stringify({ schoolId }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setStudents(data.students);
    setStep(3);
  };

  return (
    <>
    
        {/* STEP 1 */}
        {step === 1 && (
            <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-4 text-primary">
            Hindustan Olympiad 2025 Result
            </h1>
            <div className="flex gap-2 mb-4 flex-col">
                <label className="block mb-2 font-medium">
                    Enter SchoolId
                </label>
                <input
                    placeholder="Enter School ID"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                />
                <Button 
                    onClick={sendOtp} 
                    disabled={loading}
                    className="h-10 w-full">
                     {loading ? "Sending OTP..." : "Send OTP"}                    
                </Button>
            </div>
            </div>
            </div>
            </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
            <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-4 text-primary">
            Hindustan Olympiad 2025 Result
            </h1>
            <p className="text-sm text-red-600 mb-3 text-center">
				Enter this OTP to get student result 
				{serverOtp && ` (${serverOtp})`}
            </p>
            <p className="text-sm text-red-600 mb-3 text-center">
              OTP sent to the mobile number Register in school Id ****{mobileLast4}
            </p>
            <div className="flex gap-2 mb-4 flex-col">
                <label className="block mb-2 font-medium">
                    Enter OTP
                </label>
            <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-2"
            />
            <Button 
                onClick={verifyOtp} 
                disabled={loading}
                className="h-10 w-full">
                {loading ? "Verifying..." : "Verify OTP"}                 
            </Button>
            </div>
            </div>
            </div>
            </>
        )}

        {/* STEP 3 TABLE */}
        {step === 3 && (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-10" 
            style={{
            background:'url("/images/hero/bg-2.jpeg")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            }}
            >
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
                    <h2 className="text-[30px] font-bold mb-4 text-primary px-6 pt-6">
                    Student Results
                    </h2>

                    <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                        
                        {/* HEADER */}
                        <thead className="bg-primary text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">S.No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Stream</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Marks</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">District Rank</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Regional Rank</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">National Rank</th>
                        </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-200">
                        {students.map((s: any, index) => (
                            <tr
                            key={s._id}
                            className={`hover:bg-blue-50 transition ${
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                            >
                            <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                {index + 1}
                            </td>

                            <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                                {s.rollNo}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-800">
                                {s.studentname}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                                {s.class}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                                {s.stream || "-"}
                            </td>

                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                {s.marks}
                            </td>

                            <td className="px-4 py-3 text-sm text-purple-600 font-medium">
                                {s.districtrank || "N/A" }
                            </td>

                            <td className="px-4 py-3 text-sm text-indigo-600 font-medium">
                                {s.regionrank || "N/A" }
                            </td>

                            <td className="px-4 py-3 text-sm text-red-600 font-bold">
                                {s.nationalrank || "N/A" }
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        )}
    </>
  );
}