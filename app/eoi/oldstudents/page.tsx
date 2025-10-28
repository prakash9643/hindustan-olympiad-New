"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { regions, districts } from "@/utils/constants";

interface StudentFormData {
  name: string;
  phoneNumber: string;
  schoolName: string;
  schoolCoordinatorContact: string;
  region: string;
  district: string;
  class: string;
}

export default function StudentRegistrationPage() {
  const [studentForm, setStudentForm] = useState<StudentFormData>({
    name: "",
    phoneNumber: "",
    schoolName: "",
    schoolCoordinatorContact: "",
    region: "",
    district: "",
    class: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, phoneNumber, schoolName, schoolCoordinatorContact, region, district, class: studentClass } = studentForm;

    if (!name || !phoneNumber || !schoolName || !schoolCoordinatorContact || !region || !district || !studentClass) {
      error("All fields are required!", {
        duration: 3000,
        position: "top-right",
        description: "Please fill all the fields.",
      });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      error("Invalid student phone number!", {
        duration: 3000,
        position: "top-right",
        description: "Enter a valid 10-digit phone number.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!phoneRegex.test(schoolCoordinatorContact)) {
      error("Invalid school contact number!", {
        duration: 3000,
        position: "top-right",
        description: "Enter a valid 10-digit phone number.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/eoi/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentForm),
      });

      if (response.ok) {
        success("We have got your message!", {
          position: "top-right",
          duration: 2000,
          description: "We will get back to you soon.",
        });

        setStudentForm({
          name: "",
          phoneNumber: "",
          schoolName: "",
          schoolCoordinatorContact: "",
          region: "",
          district: "",
          class: "",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegionChange = (region: string) => {
    setStudentForm((prev) => ({
      ...prev,
      region,
      district: "",
    }));
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardDescription className="text-base font-medium text-black">
              Registrations will only happen through schools. Please share your school’s details so we can initiate the onboarding process.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Your Contact Number</Label>
                <Input
                  id="phone"
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="9XXXXXXXXX"
                  required
                />
              </div>

              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  value={studentForm.schoolName}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, schoolName: e.target.value }))}
                  placeholder="Enter school name"
                  required
                />
              </div>

              {/* School Contact */}
              <div className="space-y-2">
                <Label htmlFor="school-contact">School Coordinator Contact Number</Label>
                <Input
                  id="school-contact"
                  value={studentForm.schoolCoordinatorContact}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, schoolCoordinatorContact: e.target.value }))}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={studentForm.class}
                  onChange={(e) => setStudentForm((prev) => ({ ...prev, class: e.target.value }))}
                  placeholder="Enter class (e.g., 9, 10, 11, 12)"
                  required
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={studentForm.region} onValueChange={handleRegionChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={studentForm.district}
                  onValueChange={(value) => setStudentForm((prev) => ({ ...prev, district: value }))}
                  disabled={!studentForm.region}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentForm.region &&
                      districts[studentForm.region as keyof typeof districts]?.map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}