"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Upload, Download, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import { Badge } from "@/components/ui/badge"
import { regions, districts } from "@/utils/constants"

export default function BulkAddSchoolForm() {
    
  const { success, error } = useToast()
  const [user, setUser] = useState<any>(null)
  const [bulkSchools, setBulkSchools] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) setUser(JSON.parse(userData))
  }, [])
useEffect(() => {
  console.log("Parsed Excel data:", bulkSchools)
}, [bulkSchools])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" })

        const schools = jsonData.map((row: any) => ({
            schoolName: row["School Name"]?.toString().trim() || "",
            branch: row["School Branch"]?.toString().trim() || "",
            board: row["Board"]?.toString().trim() || "",
            region: row["Region"]?.toString().trim() || "",
            district: row["District"]?.toString().trim() || "",
            pincode: row["Pincode"]?.toString().trim() || "",
            principalName: row["Principal Name"]?.toString().trim() || "",
            principalPhone: row["Principal Ph. No"]
            ? String(row["Principal Ph. No"]).replace(/\D/g, "").trim()
            : "",
            principalEmail: row["Principal Email ID"]?.toString().trim() || "",
            coordinatorName: row["School Coordinator Name"]?.toString().trim() || "",
            coordinatorPhone: row["School Coordinator Ph. No."]
            ? String(row["School Coordinator Ph. No."]).replace(/\D/g, "").trim()
            : "",
            coordinatorEmail: row["School Coordinator Email ID"]?.toString().trim() || "",
        }))
        //  .filter(
        //     (school) =>
        //     school.schoolName &&
        //     school.branch &&
        //     school.board &&
        //     school.region &&
        //     school.district &&
        //     school.principalName &&
        //     school.principalPhone &&
        //     school.coordinatorName &&
        //     school.coordinatorPhone
        // );

      console.log("Parsed & Filtered Data:", schools);
        setBulkSchools(schools)
      } catch (err) {
        console.log("Invalid Excel file format")
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const isSchoolValid = (school: any): boolean => {
    const required = [
      "schoolName", "branch", "board", "district", "region",
      "principalName", "principalPhone",
      "coordinatorName", "coordinatorPhone"
    ]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/

    return required.every(key =>
      typeof school[key] === 'string'
        ? school[key].trim() !== ""
        : !!school[key]
    ) &&
      phoneRegex.test(school.principalPhone) &&
      phoneRegex.test(school.coordinatorPhone) &&
    (school.principalEmail?.trim() === "" || emailRegex.test(school.principalEmail)) &&
    (school.coordinatorEmail?.trim() === "" || emailRegex.test(school.coordinatorEmail))
  }

  const removeSchool = (index: number) => {
    setBulkSchools((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBulkSave = async () => {
    const validSchools = bulkSchools.filter(isSchoolValid)

    if (validSchools.length === 0) {
      error("No valid schools to save", { position: "top-right" })
      return
    }
    // Add addedBy to each school
    const schoolsWithAddedBy = validSchools.map(school => ({
      ...school,
      addedBy: user?._id || "",
    }));

    const res = await fetch("/api/schools/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${JSON.parse(localStorage.getItem("user") || "{}")._id}`
      },
      body: JSON.stringify({ schools: schoolsWithAddedBy }),
    })

    const data = await res.json()
    if (data.error) {
      error("Error uploading schools", { description: data.error })
    } else {
      success("Schools uploaded successfully!", { position: "top-right" })
      setBulkSchools([])
    }
  }

  const isAllSchoolsValid = bulkSchools.every(isSchoolValid)

  return (
    <Card className="p-0 border-none pb-12">
      <CardHeader className="p-0 py-4">
        <CardTitle>Bulk Upload Schools</CardTitle>
        <CardDescription>Upload Excel to add multiple schools at once</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="flex-1">
            <a href="/school_template.xlsx" download>
              <Download className="w-4 h-4 mr-2" />
              Download Excel Template
            </a>
          </Button>
          <div className="flex-1">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
            />
            <Label htmlFor="excel-upload" className="cursor-pointer">
              <Button variant="outline" type="button" className="w-full" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Excel File
                </span>
              </Button>
            </Label>
          </div>
        </div>

        {bulkSchools.length > 0 && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Validate Schools</h3>
              <Button type="button" onClick={handleBulkSave} disabled={!isAllSchoolsValid}>
                <Save className="w-4 h-4 mr-2" />
                Save Valid Schools
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Board</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Pincode</TableHead> {/* ✅ NEW */}
                        <TableHead>Principal</TableHead>
                        <TableHead>Principal Phone</TableHead> {/* ✅ NEW */}
                        <TableHead>Principal Email</TableHead>
                        <TableHead>Coordinator</TableHead>
                        <TableHead>Coordinator Phone</TableHead> {/* ✅ NEW */}
                        <TableHead>Coordinator Email</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bulkSchools.map((school, index) => (
                    <TableRow key={index}>
                        <TableCell>
                        {isSchoolValid(school) ? (
                            <Badge className="bg-green-500 hover:bg-green-600">Valid</Badge>
                        ) : (
                            <Badge variant="destructive">Invalid</Badge>
                        )}
                        </TableCell>
                        <TableCell>{school.schoolName}</TableCell>
                        <TableCell>{school.branch}</TableCell>
                        <TableCell>{school.board}</TableCell>
                        <TableCell>{school.region}</TableCell>
                        <TableCell>{school.district}</TableCell>
                        <TableCell>{school.pincode || "-"}</TableCell> {/* ✅ NEW */}
                        <TableCell>{school.principalName}</TableCell>
                        <TableCell>{school.principalPhone || "-"}</TableCell> {/* ✅ NEW */}
                        <TableCell>{school.principalEmail || "-"}</TableCell>
                        <TableCell>{school.coordinatorName}</TableCell>
                        <TableCell>{school.coordinatorPhone || "-"}</TableCell> {/* ✅ NEW */}
                        <TableCell>{school.coordinatorEmail || "-"}</TableCell>
                        <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeSchool(index)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>

            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 text-sm text-muted-foreground">
        Please ensure 10-digit phone numbers for both Principal and Coordinator.
      </CardFooter>
    </Card>
  )
}
