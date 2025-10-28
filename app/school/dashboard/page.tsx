"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
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
import type { SchoolCoordinator } from "@/types/school-coordinator";
import { regions, districts } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SchoolDashboard() {
  const router = useRouter();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState<School | null>(null);
  const [user, setUser] = useState<SchoolCoordinator | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && user !== "undefined" && user !== null) {
      if (localStorage.getItem("type") === "school-coordinator") {
        setUser(JSON.parse(user));
      } else {
        router.push("/phone-login/school");
      }
    } else {
      router.push("/phone-login/school");
    }
  }, []);

  useEffect(() => {
    if (!user || !user.schoolId) {
      return;
    }
    fetch(`/api/schools/${user.schoolId}`, {
      headers: {
        authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSchool(data);
      });
  }, [user]);

  const [formData, setFormData] = useState({
    schoolName: "",
    branch: "",
    serialNumber: "",
    district: "",
    region: "",
    city: "",
    pincode: "",
    board: "",
    principalName: "",
    principalPhone: "",
    principalEmail: "",
    coordinatorName: "",
    coordinatorPhone: "",
    coordinatorEmail: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/phone-login/school");
      return;
    }

    // Validate empty fields
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === "string" && value.trim() === "" && key !== "city" && key !== "serialNumber") {
        error("All fields are required!", {
          duration: 3000,
          position: "top-right",
          description: `Please fill the ${key} field.`,
        });
        return;
      }
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.principalEmail)) {
      error("Invalid email!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a valid principal email.",
      });
      return;
    }

    if (!emailRegex.test(formData.coordinatorEmail)) {
      error("Invalid email!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a valid coordinator email.",
      });
      return;
    }

    // Validate phone numbers (10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.principalPhone)) {
      error("Invalid phone number!", {
        duration: 3000,
        position: "top-right",
        description: "Principal's phone number should be 10 digits.",
      });
      return;
    }

    if (!phoneRegex.test(formData.coordinatorPhone)) {
      error("Invalid phone number!", {
        duration: 3000,
        position: "top-right",
        description: "Coordinator's phone number should be 10 digits.",
      });
      return;
    }

    // Region and District check
    if (formData.region === "" || formData.district === "") {
      error("Please select a region and district!", {
        duration: 3000,
        position: "top-right",
        description: "Please select a region and district.",
      });
      return;
    }

    const newSchool: School = {
      ...formData,
      district: [formData.district] as [string],
      studentsCount: 0,
      paymentVerification: 0,
      addedBy: user?._id || "",
    };

    console.log(newSchool);

    const response = await fetch(`/api/schools/${user.schoolId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
      body: JSON.stringify(newSchool),
    });

    const data = await response.json();
    if (data.error) {
      error("Something went wrong!", {
        duration: 4000,
        position: "top-right",
        description: data.error,
      });
    } else {
      success("School updated successfully!", {
        position: "top-right",
        duration: 4000,
        description: "Your school has been added successfully.",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (school) {
      setFormData({
        ...school,
        district: Array.isArray(school.district) ? school.district[0] : school.district,
      });
    }
  }, [school]);

  // Safe function to get districts for a region
  const getDistrictsForRegion = (region: string) => {
    if (!region || !districts[region as keyof typeof districts]) {
      return [];
    }
    return districts[region as keyof typeof districts];
  };

  return (
    <Card className="w-full p-0 border-none pb-12 shadow-none">
      {!school ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : (
        <>
          <CardHeader className="p-0 pt-4 pb-2">
            <CardTitle>School Details</CardTitle>
            <CardDescription>
              Fill in the details to update school to the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
                  School information
                </p>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) =>
                      handleInputChange("schoolName", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) =>
                      handleInputChange("branch", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board">Board</Label>
                  <Select
                    value={formData.board}
                    onValueChange={(value) => handleInputChange("board", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
                  Region information
                </p>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select
                    disabled
                    value={formData.region}
                    onValueChange={(value) =>
                      handleInputChange("region", value)
                    }
                  >
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

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={formData.district}
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* FIXED: Safe district mapping */}
                      {getDistrictsForRegion(formData.region).map((district: { value: string; label: string }) => (
                        <SelectItem
                          key={district.value}
                          value={district.value}
                        >
                          {district.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    required
                    disabled
                  />
                </div>

                <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
                  Principal information
                </p>
                <div className="space-y-2">
                  <Label htmlFor="principalName">Principal Name</Label>
                  <Input
                    id="principalName"
                    value={formData.principalName}
                    onChange={(e) =>
                      handleInputChange("principalName", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principalPhone">Principal Phone</Label>
                  <Input
                    id="principalPhone"
                    value={formData.principalPhone}
                    onChange={(e) =>
                      handleInputChange("principalPhone", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principalEmail">Principal Email</Label>
                  <Input
                    id="principalEmail"
                    type="email"
                    value={formData.principalEmail}
                    onChange={(e) =>
                      handleInputChange("principalEmail", e.target.value)
                    }
                    required
                  />
                </div>
                <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
                  Coordinator information
                </p>
                <div className="space-y-2">
                  <Label htmlFor="coordinatorName">Coordinator Name</Label>
                  <Input
                    id="coordinatorName"
                    value={formData.coordinatorName}
                    onChange={(e) =>
                      handleInputChange("coordinatorName", e.target.value)
                    }
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coordinatorPhone">Coordinator Phone</Label>
                  <Input
                    id="coordinatorPhone"
                    value={formData.coordinatorPhone}
                    onChange={(e) =>
                      handleInputChange("coordinatorPhone", e.target.value)
                    }
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coordinatorEmail">Coordinator Email</Label>
                  <Input
                    id="coordinatorEmail"
                    type="email"
                    value={formData.coordinatorEmail}
                    onChange={(e) =>
                      handleInputChange("coordinatorEmail", e.target.value)
                    }
                    required
                    disabled
                  />
                </div>
              </div>

              <Button type="submit">Update School data</Button>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  );
}