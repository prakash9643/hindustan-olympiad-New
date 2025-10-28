"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { School } from "@/types/school";
import type { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import SchoolSearchSelect from "@/components/ui/schoolsearchselect";

/** ---------------- helpers ---------------- */

const emptyStudentFields = {
  name: "",
  class: "",
  section: "",
  gender: "",
  stream: "",
  parentName: "",
  parentContact: "",
};

type StudentFields = typeof emptyStudentFields;

type FormData = StudentFields & {
  // we keep school info here so payload is easy to build
  schoolId: string;
  schoolName: string;
  branch: string;
  city: string;
  district: string;
  region: string;
  pincode: string;
};

export default function AddStudentForm() {
  const { success, error } = useToast();

  // 👇 keep school and student state together (but reset smartly)
  const [formData, setFormData] = useState<FormData>({
    ...emptyStudentFields,
    schoolId: "",
    schoolName: "",
    branch: "",
    city: "",
    district: "",
    region: "",
    pincode: "",
  });

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleSchoolSearch = async (school: any) => {
    setSelectedSchool(school)
    if (school) {
      setFormData((prev) => ({
        ...prev,
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        branch: school.branch,
        district: school.district,
        region: school.region,
        city: school.city,
        pincode: school.pincode,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        schoolId: "",
        schoolName: "",
        branch: "",
        district: "",
        region: "",
        city: "",
        pincode: "",
      }))
    }
  }

  const resetOnlyStudentFields = () => {
    setFormData((prev) => ({
      ...prev,
      ...emptyStudentFields,
    }));
  };

  const clearEverything = () => {
    // optional: if you want a "Change" button to clear the school too
    setSelectedSchool(null);
    setFormData({
      ...emptyStudentFields,
      schoolId: "",
      schoolName: "",
      branch: "",
      city: "",
      district: "",
      region: "",
      pincode: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.schoolId) {
      error("School is required!", {
        duration: 3000,
        position: "top-right",
        description: "Please search and select a school first.",
      });
      return;
    }

    if (!formData.name) {
      error("Name is required!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a name.",
      });
      return;
    }
    if (!formData.class) {
      error("Class is required!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a class.",
      });
      return;
    }
    if (!formData.gender) {
      error("Gender is required!", {
        duration: 3000,
        position: "top-right",
        description: "Please select a gender.",
      });
      return;
    }
    if (!formData.parentName) {
      error("Parent Name is required!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a parent name.",
      });
      return;
    }
    if (!formData.parentContact) {
      error("Parent Contact is required!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a parent contact.",
      });
      return;
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${
          JSON.parse(localStorage.getItem("user") || "{}")._id || ""
        }`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.error) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: data.error,
      });
    } else {
      success("Student added!", {
        position: "top-right",
        duration: 2000,
        description: "Your student has been added successfully.",
      });

      // 👇 Only student fields reset — school stays selected so you can add again quickly
      resetOnlyStudentFields();

      // अगर हर बार school भी reset चाहिए, तो `clearEverything()` call करें
      // clearEverything();
    }
  };

  const handleInputChange = (field: keyof StudentFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-0 border-none pb-12">
      <CardHeader className="p-0 py-4">
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>
          Fill in the details to add a new student to the system
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* School Search Section */}
          <Card className="bg-muted/50 px-4 py-2">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">School Information</CardTitle>
              {formData.schoolId && (
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={clearEverything}
                >
                  Change
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-2">
              <div className="flex space-x-2 mb-4">
                <SchoolSearchSelect
                  onSchoolSelect={handleSchoolSearch}
                  selectedSchool={selectedSchool}
                />
              </div>

              {formData.schoolId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input value={formData.schoolName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Input value={formData.branch} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input value={formData.region} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input value={formData.district} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input value={formData.pincode} disabled />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              Students Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => handleInputChange("class", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => handleInputChange("section", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.class === "11" || formData.class === "12") && (
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                <Select
                  value={formData.stream}
                  onValueChange={(value) => handleInputChange("stream", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCB">PCB</SelectItem>
                    <SelectItem value="PCM">PCM</SelectItem>
                    <SelectItem value="COMM">Commerce with Maths</SelectItem>
                    <SelectItem value="COMW">Commerce without Maths</SelectItem>
                    <SelectItem value="ARTS">Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              Parents Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) =>
                  handleInputChange("parentName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentContact">Parent Contact</Label>
              <Input
                id="parentContact"
                value={formData.parentContact}
                onChange={(e) =>
                  handleInputChange("parentContact", e.target.value)
                }
                required
              />
            </div>
          </div>

          <Button type="submit" className="">
            Add Student
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
