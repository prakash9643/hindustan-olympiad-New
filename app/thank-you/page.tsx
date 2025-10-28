"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ThankYouPage() {
  const params = useSearchParams();
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    // 1️⃣ URL से लेने की कोशिश
    const idFromUrl = params.get("studentId");
    if (idFromUrl) {
      setStudentId(idFromUrl);
      return;
    }

    // 2️⃣ LocalStorage से लेने की कोशिश
    const idFromStorage = localStorage.getItem("studentId");
    if (idFromStorage) {
      setStudentId(idFromStorage);
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader className="p-6">
            <CardDescription>
              <h1 className="text-2xl font-bold mb-4 text-[#B2252A] line-hight-1.5">
                Thank You for Registering in <br />Hindustan Olympiad 2025
              </h1>
              
              <h2 className="text-xl font-semibold mb-6">
                Your Roll No. is{" "}
                <span className="text-[#B2252A]">
                  {studentId || "Loading..."}
                </span>
              </h2>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="max-w-xl text-gray-700 space-y-4">
                <p>
                  Your Admit card along with exam center details and all the instructions related to the exam will be shared on your registered email ID/ Ph. Number, <br /> 7 days prior to the exam date
                </p>
                <p>
                  For any queries please contact us at:{" "}
                  <a
                    href="mailto:olympiadsupport@livehindustan.com"
                    className="text-[#B2252A]"
                  >
                    olympiadsupport@livehindustan.com
                  </a>
                </p>

                <div className="mb-6">
                  <Link href="/" className="h-10 block md:inline">
                    <Button>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// Note: The studentId is fetched from the URL query parameter first. If not found, it tries to get it from localStorage. If still not found, it shows "Loading...".