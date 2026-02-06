"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Save, Trash2, Upload } from "lucide-react"
import type { School } from "@/types/school"
import type { Student } from "@/types/student"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BulkAddStudentForm() {
  const { success, error } = useToast()
  const [bulkStudents, setBulkStudents] = useState<Student[]>([])
  const [schoolsMap, setSchoolsMap] = useState<Map<string, School>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VALID" | "INVALID">("ALL");

  // Get user ID for addedBy field
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      return user?._id || ""
    } catch {
      return ""
    }
  }

  // Fetch all schools and cache them
  const fetchAllSchools = async (): Promise<School[]> => {
    try {
      const userId = getUserId()
      const response = await fetch(`/api/schools`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": userId,
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Different possible response formats handle karein
        let schools: School[] = []
        
        if (Array.isArray(data)) {
          schools = data
        } else if (data.data && Array.isArray(data.data)) {
          schools = data.data
        } else if (data.schools && Array.isArray(data.schools)) {
          schools = data.schools
        } else {
          console.log("Unknown API response format:", data)
          return []
        }
        
        console.log("Fetched schools:", schools.length)
        
        // Cache all schools in the map
        const newSchoolsMap = new Map<string, School>()
        schools.forEach(school => {
          if (school && school.schoolId) {
            newSchoolsMap.set(school.schoolId, school)
          }
        })
        
        setSchoolsMap(newSchoolsMap)
        console.log("SchoolsMap updated with", newSchoolsMap.size, "schools")
        
        return schools
      }
      return []
    } catch (err) {
      console.error("Error fetching schools:", err)
      return []
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)

        console.log("📊 Processing Excel file with", jsonData.length, "rows")

        // Pehle saare schools fetch karein
        console.log("🔄 Fetching all schools...")
        const allSchools = await fetchAllSchools()
        
        const studentsWithSchoolData: Student[] = []

        // Process each student
        for (const row of jsonData) {
          const student: any = {
            name: String(row["Student Name"] || "").trim(),
            class: String(row["Class"] || "").trim(),
            section: String(row["Section"] || "").trim(),
            gender: String(row["Gender"] || "").trim(),
            stream: String(row["Stream"] || "").trim(),
            parentName: String(row["Parent Name"] || "").trim(),
            parentContact: String(row["Parent Contact"] || "").trim(),
            schoolId: String(row["School"] || row["School ID"] || "").trim(),
            // Source_code: String(row["Source_code"] || "").trim(),
            studentId: String(row["Student ID"] || "").trim(),
          }

          console.log("Processing student:", student.name, "with school ID:", student.schoolId)

          // School data attach karein
          if (student.schoolId) {
            const school = allSchools.find(s => s.schoolId === student.schoolId)
            if (school) {
              student.schoolName = school.schoolName
              student.branch = school.branch
              student.district = school.district
              student.region = school.region
              student.city = school.city
              student.pincode = school.pincode
              // student.Source_code = student.Source_code 
              console.log("✅ School found:", school.schoolName)
            } else {
              console.log("❌ School not found for ID:", student.schoolId)
              // Available school IDs show karein for debugging
              console.log("Available school IDs:", allSchools.map(s => s.schoolId))
            }
          }

          studentsWithSchoolData.push(student)
        }

        setBulkStudents(studentsWithSchoolData)
        console.log("✅ Students processing completed")
        
      } catch (err) {
        console.error("❌ Error reading Excel file:", err)
        error("Error reading Excel file", { 
          duration: 3000, 
          position: "top-right", 
          description: "Please check the file format and try again." 
        })
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleBulkSave = async () => {
    const validStudents = bulkStudents.filter((student) => {
      return isStudentValid(student)
    })

    if (validStudents.length === 0) {
      error("No valid students to save!", { 
        duration: 3000, 
        position: "top-right", 
        description: "Please check the student data in your Excel file." 
      })
      return
    }

    const userId = getUserId()
    if (!userId) {
      error("User not authenticated!", { 
        duration: 3000, 
        position: "top-right", 
        description: "Please log in again." 
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/students/multi-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": userId,
        },
        body: JSON.stringify({
          students: validStudents.map(student => ({
            name: student.name,
            class: student.class,
            section: student.section,
            gender: student.gender,
            stream: student.stream,
            parentName: student.parentName,
            parentContact: student.parentContact,
            addedBy: userId,
            schoolId: student.schoolId,
            studentId: student.studentId,
            // Source_code: student.Source_code,
            paymentVerified: student.paymentVerified || false,
          }))
        }),
      })

      const data = await response.json()
      console.log("Bulk save response:", data || data.SourceCode)
      
      if (data.error) {
        error("Bulk upload failed!", { 
          duration: 4000, 
          position: "top-right", 
          description: data.error 
        })
      } else {
        success('Students added successfully!', { 
          position: "top-right", 
          duration: 3000, 
          description: `${data.summary.totalInserted} students added successfully` 
        })
        
        setBulkStudents([])
        setSchoolsMap(new Map())
      }
    } catch (err) {
      error("Network error!", { 
        duration: 3000, 
        position: "top-right", 
        description: "Please check your connection and try again." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeBulkStudent = (index: number) => {
    setBulkStudents((prev) => prev.filter((_, i) => i !== index))
  }

  const isStreamValid = ({class: studentClass, stream} : {class: string, stream: string}): boolean => {
    if(studentClass === "11" || studentClass === "12") {
      return stream ? ["PCB", "PCM", "COMMERCE WITH MATH", "COMMERCE W/O MATHS", "COMMERCE W/O MATH", "COMMERCE WITH MATHS", "COMMERCE WITHOUT MATH", "HUMANITIES", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(stream.trim().toUpperCase()) : false;
    } else {
      return stream === "" || stream === "null" || stream === "NOT FILLED";
    }
  }

  const isStudentValid = (student: Student): boolean => {
    const requiredFields = [
      student.name,
      student.class,
      // student.section,
      // student.gender,
      student.parentName || "N/A",
      // student.parentContact || "",
      student.schoolId,
    ];

    const allFieldsFilled = requiredFields.every((value) => {
      return value.toString().trim() !== "";
    });

    // const genderValid = ["M", "F"].includes(student.gender.toUpperCase());
    // const streamValid : boolean = isStreamValid({class: student.class+ "", stream: student.stream});
    // const contactValid =
    // student.parentContact.trim() === "" ||
    // /^[0-9]{9,10}$/.test(student.parentContact);

    return allFieldsFilled ;
  }

  const isAllStudentsValid = bulkStudents.every(isStudentValid);

  // Get school name for display - SIMPLE version
  const getSchoolName = (schoolId: string) => {
    if (!schoolId) return "No School ID"
    
    const school = schoolsMap.get(schoolId)
    return school ? school.schoolName : "School ID"
  }
  const filteredStudents = bulkStudents.filter(student => {
    if (statusFilter === "VALID") return isStudentValid(student);
    if (statusFilter === "INVALID") return !isStudentValid(student);
    return true; // ALL
  });

  return (
    <Card className="p-0 border-none pb-12">
      <CardHeader className="p-0 py-4">
        <CardTitle>Bulk Multi Add Students</CardTitle>
        <CardDescription>
          Upload an Excel file with student data including School ID to add multiple students at once
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Upload Section */}
          <Card className="bg-muted/50 px-4 py-6">
            <CardContent className="p-0">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Excel File Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Your Excel file must include these columns: <strong>Student Name, Class, Section, Gender, Stream, Parent Name, Parent Contact, School</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <Button asChild variant="outline" className="flex-1">
                  <a href="/multi-students.xlsx" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </a>
                </Button>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="excel-upload"
                    disabled={isLoading}
                  />
                  <Label htmlFor="excel-upload" className="cursor-pointer">
                    <Button variant="outline" type="button" className="w-full" asChild disabled={isLoading}>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {isLoading ? "Processing..." : "Upload Excel File"}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          {bulkStudents.length > 0 && (
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Students Preview ({bulkStudents.length} students)
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    {bulkStudents.filter(isStudentValid).length} valid / {bulkStudents.length} total
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="ALL">All</option>
                      <option value="VALID">Valid Only</option>
                      <option value="INVALID">Invalid Only</option>
                    </select>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleBulkSave} 
                    disabled={!isAllStudentsValid || isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save All Students"}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Stream</TableHead>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Parent Contact</TableHead>
                        <TableHead>School</TableHead>
                        {/* <TableHead>Source_code</TableHead> */}
                        <TableHead>Student ID</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {isStudentValid(student) ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Invalid</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.stream || "-"}</TableCell>
                          <TableCell>{student.parentName}</TableCell>
                          <TableCell>{student.parentContact}</TableCell>
                          <TableCell>
                            <div className="max-w-[150px]">
                              <div className={`text-sm font-medium truncate ${
                                getSchoolName(student.schoolId) === "School Not Found" ? "text-red-500" : "text-green-600"
                              }`}>
                                {getSchoolName(student.schoolId)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {student.schoolId}
                              </div>
                            </div>
                          </TableCell>
                          {/* <TableCell>{student.Source_code}</TableCell> */}
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeBulkStudent(index)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}