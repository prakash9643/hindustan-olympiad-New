"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import type { School } from "@/types/school"
import type { Student } from "@/types/student"
import { SchoolCoordinator } from "@/types/school-coordinator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

export default function AddStudentForm() {
  const router = useRouter();
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState<School | null>(null)
  const [user, setUser] = useState<SchoolCoordinator | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    gender: "",
    stream: "",
    parentName: "",
    parentContact: "",
    schoolId: "",
    schoolName: "",
    branch: "",
    city: "",
    district: "",
    region: "",
    pincode: "",
  })

  // Get user ID safely
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user?._id || "";
    } catch {
      return "";
    }
  };

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.name || formData.name.length < 2) {
      errors.push("Student name must be at least 2 characters long.")
    }

    if (!formData.class) {
      errors.push("Class is required.")
    }

    if (!formData.section) {
      errors.push("Section is required.")
    }

    if (!["M", "F", "O"].includes(formData.gender)) {
      errors.push("Please select a valid gender.")
    }

    console.log("Stream Valid:", formData.class, formData.stream);
    if (!["PCB", "PCM", "COMM", "COMW", "ARTS"].includes(formData.stream)) {
      if (formData.class === "11" || formData.class === "12") {
        errors.push("Please select a valid stream.")
      }
    }

    if (!formData.parentName || formData.parentName.length < 2) {
      errors.push("Parent name must be at least 2 characters long.")
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.parentContact)) {
      errors.push("Parent contact must be a valid 10-digit Indian number.")
    }

    return errors
  }

  // Set user from localStorage - only runs once
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const type = localStorage.getItem("type");

    if (userData && userData !== "undefined" && type === "school-coordinator") {
      setUser(JSON.parse(userData));
    } else {
      router.push("/phone-login/school");
    }
  }, []);

  useEffect(() => {
    if (user && user !== null && user?.schoolId) {
      const userId = getUserId();
      fetch(`/api/schools/${user.schoolId}`, { 
        headers: { "authorization": userId } 
      })
        .then(res => res.json())
        .then(data => {
          setSchool(data);
        });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userId = getUserId();
    if (!userId) {
      error("User not authenticated!", { 
        duration: 3000, 
        position: "top-right", 
        description: "Please log in again." 
      });
      return;
    }

    if (school?.schoolId) {
      formData.schoolId = school.schoolId
      formData.schoolName = school.schoolName
      formData.branch = school.branch
      formData.city = school.city
      formData.district = Array.isArray(school.district) ? school.district[0] || "" : school.district || "";
      formData.region = school.region
      formData.pincode = school.pincode
    }

    if (!formData.schoolId) {
      alert("Please search and select a school first!")
      return
    }

    const errors = validateForm()
    if (errors.length > 0) {
      error("Validation Error", {
        description: errors.join("\n"),
        duration: 4000,
        position: "top-right"
      })
      return
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": userId,
      },
      body: JSON.stringify({
        ...formData,
        addedBy: user?._id || "", // Add addedBy field
      }),
    });

    const data = await res.json()
    if (data.error) {
      error("Something went wrong!", { 
        duration: 3000, 
        position: "top-right", 
        description: data.error 
      })
    } else {
      success('Student added!', { 
        position: "top-right", 
        duration: 2000, 
        description: "Your student has been added successfully." 
      })
    }

    if (!data.error) {
      // Reset form
      setFormData({
        name: "",
        class: "",
        section: "",
        gender: "",
        stream: "",
        parentName: "",
        parentContact: "",
        schoolId: "",
        schoolName: "",
        branch: "",
        city: "",
        district: "",
        region: "",
        pincode: "",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="p-0 border-none pb-12">
      <CardHeader className="p-0 py-4">
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>Fill in the details to add a new student to the system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
            Students Information
          </p>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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

            {(formData.class === "11" || formData.class === "12") && <div className="space-y-2">
              <Label htmlFor="stream">Stream</Label>
              <Select value={formData.stream} onValueChange={(value) => handleInputChange("stream", value)}>
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
            </div>}

            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              Parents Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => handleInputChange("parentName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentContact">Parent Contact</Label>
              <Input
                id="parentContact"
                value={formData.parentContact}
                onChange={(e) => handleInputChange("parentContact", e.target.value)}
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
  )
}