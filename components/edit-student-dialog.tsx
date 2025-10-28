"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Student } from "@/types/student"
import type { School } from "@/types/school"
import { useToast } from "@/hooks/use-toast"


interface EditStudentDialogProps {
  student: Student
  open: boolean
  onClose: () => void
  onSave: (student: Student) => void
}

export default function EditStudentDialog({ student, open, onClose, onSave }: EditStudentDialogProps) {
  const { error } = useToast()
  const [formData, setFormData] = useState(student)

  useEffect(() => {
    console.log(student)
    setFormData(student)
  }, [student])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate empty fields
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === "string" && value.trim() === "" && key !== "stream" && key !== "city") {
        error("All fields are required!", {
          duration: 3000,
          position: "top-right",
          description: `Please fill the ${key} field.`,
        });
        return;
      }
    }

    if (!formData.parentContact.match(/^[0-9]{10}$/)) {
      error("Invalid phone number!", {
        duration: 3000,
        position: "top-right",
        description: "Parent's phone number should be 10 digits.",
      });
      return;
    }

    onSave(formData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // const handleSchoolChange = (schoolId: string) => {
  //   // TODO: Fetch school from API
  //   const school = 
  //   if (school) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       schoolId: school._id,
  //       schoolName: school.schoolName,
  //       branch: school.branch,
  //       district: school.district,
  //       region: school.region,
  //     }))
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update the student information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Student Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-class">Class</Label>
              <Input
                id="edit-class"
                value={formData.class}
                onChange={(e) => handleInputChange("class", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-section">Section</Label>
              <Input
                id="edit-section"
                value={formData.section}
                onChange={(e) => handleInputChange("section", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gender">Gender</Label>
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

            { formData.class === "11" || formData.class === "12" && <div className="space-y-2">
              <Label htmlFor="edit-stream">Stream</Label>
              <Select value={formData.stream.toLowerCase()} onValueChange={(value) => handleInputChange("stream", value)}>
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

            {/* <div className="space-y-2">
              <Label htmlFor="edit-school">School</Label>
              <Select value={formData.schoolId} onValueChange={handleSchoolChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school._id} value={school._id}>
                      {school.schoolName} - {school.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="edit-parentName">Parent Name</Label>
              <Input
                id="edit-parentName"
                value={formData.parentName}
                onChange={(e) => handleInputChange("parentName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-parentContact">Parent Contact</Label>
              <Input
                id="edit-parentContact"
                value={formData.parentContact}
                onChange={(e) => handleInputChange("parentContact", e.target.value)}
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div> */}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
