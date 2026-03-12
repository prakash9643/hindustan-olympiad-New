"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function QuickResultPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [message, setMessage] = useState("");

  const checkResult = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/quick-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId: rollNumber }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    setStudent(data.result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Hindustan Olympiad 2025
        </h1>

        {!student && (
          <>
            <label className="block mb-2 font-medium">
              Enter Roll Number / OMR Code
            </label>

            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="3XXXXX4XXX9"
            />

            <Button
              disabled={loading}
              onClick={checkResult}
              className="h-10 block md:inline"
            >
              {loading ? "Checking..." : "Submit"}
            </Button>
          </>
        )}

        {message && (
          <p className="text-center my-4 text-sm text-red-600">{message}</p>
        )}

        {student && (
          <>
            <div className="mt-4 border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <tbody>
                    <tr className="border-b">
                        <th className="px-4 py-3 bg-gray-100 font-semibold text-gray-700">
                        Name
                        </th>
                        <td className="px-4 py-3">{student.studentname}</td>
                    </tr>

                    <tr className="border-b">
                        <th className="px-4 py-3 bg-gray-100 font-semibold text-gray-700">
                        District
                        </th>
                        <td className="px-4 py-3">{student.district}</td>
                    </tr>

                    <tr>
                        <th className="px-4 py-3 bg-gray-100 font-semibold text-gray-700">
                        Full Marks
                        </th>
                        <td className="px-4 py-3">{student.fullmark}</td>
                    </tr>
                    </tbody>
                </table>
                </div>

            <div className="mt-4 text-center">
              <p className="text-lg">
                <a href="https://hindustan-olympiad-new.vercel.app/Result" target="_blank" className="text-red-600 hover:underline">
                  Click Here
                </a>
                &nbsp;
                To Know Detailed Result
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}