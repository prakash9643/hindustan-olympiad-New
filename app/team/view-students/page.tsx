"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Download, Edit, Info, Trash2 } from "lucide-react"
import type { Student, StudentsResponse } from "@/types/student"
import type { School } from "@/types/school"
import EditStudentDialog from "@/components/edit-student-dialog"
import DeleteConfirmDialog from "@/components/delete-confirm-dialog"
import Pagination from "@/components/pagination"
import SearchAndFilter from "@/components/search-and-filter"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import ActivityLogDialog from "@/components/ActivityLogs";
import { Badge } from "@/components/ui/badge"

const constantFilters = [
  {
    key: "gender",
    label: "Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  {
    key: "class",
    label: "Class",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
    ],
  },
]

export default function ViewStudents() {
  const [user, setUser] = useState<{ role: string } | null>(null)
  const searchParams = useSearchParams()
  const { success, error } = useToast()

  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [verifyPaymentStudent, setVerifyPaymentStudent] = useState<Student | null>(null)
  const [filterOptions, setFilterOptions] = useState<any>({ key: "", label: "", options: [] })
  // Logs Activity
  const [showLogs, setShowLogs] = useState(false);
  const [studentsData, setStudentsData] = useState<StudentsResponse>({
    students: [],
    total: 0,
    page: 1,
    totalPages: 0,
  })

  const [sortBy, setSortBy] = useState<string>("name")
  const [activityLogs, setActivityLogs] = useState([]);
  const { students, total, page, totalPages } = studentsData

  const [search, setSearch] = useState<string>(searchParams.get("search") || "")
  const [filters, setFilters] = useState<Record<string, string>>({
    gender: "",
    class: "",
    stream: "",
    schoolId: "",
  })

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null")
    setUser(storedUser)
  }, [])

  // Fetch schools for filter dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      const res = await fetch("/api/schools", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
        },
      })
      const data = await res.json()
      const schoolData = data.schools.map((school: any) => ({
        label: `${school.schoolName} - ${school.branch}`,
        value: school._id,
      }))
      setFilterOptions({
        key: "schoolId",
        label: "School",
        options: schoolData,
      })
    }
    fetchSchools()
  }, [])

  const fetchActivityLogs = async (schoolId?: string, studentId?: string) => {
    setShowLogs(true);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    console.log("USERR ::", user);
    let id = user?._id.toString();
    console.log("USERR IDD::", id);

    const params = new URLSearchParams({ id });
    if (schoolId) params.append("schoolId", schoolId);
    if (studentId) params.append("studentId", studentId);
    try {
      const res = await fetch(`/api/activity-logs?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch activity logs");
      }

      const data = await res.json();

      const formattedLogs = data?.map((log: any) => {
        const date = new Date(log?.createdAt).toLocaleString();
        return `[${date}] ${log?.action} - ${log?.description}`;
      });

      setActivityLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };
  

  // **Reusable fetch function**
  const reloadStudents = async (pageNumber = page) => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/students?page=${pageNumber}&limit=10&search=${search}&filters=${JSON.stringify(filters)}&sortBy=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
          },
        }
      )
      const data = await res.json()
      setStudentsData(data)
    } catch (err) {
      error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadStudents()
  }, [search, filters, sortBy])

  // **Edit Student**
  const onUpdateStudent = async (student: Student) => {
    const response = await fetch(`/api/students/${student._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
      body: JSON.stringify(student),
    })
    const data = await response.json()
    if (data.error) {
      error("Something went wrong!", { description: data.error })
    } else {
      success("Student updated!", { description: "Student details updated successfully." })
      await reloadStudents()
    }
  }

  // **Delete Student**
  const onDeleteStudent = async (studentId: string) => {
    const response = await fetch(`/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
    })
    const data = await response.json()
    if (data.error) {
      error("Something went wrong!", { description: data.error })
    } else {
      success("Student deleted!", { description: "Student has been removed successfully." })
      await reloadStudents()
    }
  }

  // **Verify Payment**
  const verifyPayment = async (student: Student) => {
    const response = await fetch(`/api/students/${student._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
      body: JSON.stringify({
        ...student,
        confirmPayment: true,
      }),
    })
    const data = await response.json()
    if (data.error) {
      error("Something went wrong!", { description: data.error })
    } else {
      success("Payment verified!", { description: "Payment has been verified successfully." })
      await reloadStudents()
    }
  }

  const handleExport = () => {
    setExportLoading(true)
    fetch(`/api/export/students?search=${search}&sortBy=${sortBy}`, {
      method: "GET",
      headers: {
        authorization: `${JSON.parse(localStorage.getItem("user") || "{}")._id}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to export")
        return res.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "students.csv"
        a.click()
      })
      .catch(() => {
        error("Failed to export students.")
      })
      .finally(() => {
        setExportLoading(false)
      })
  }

  return (
    <Card className="p-0 border-none pb-12">
      <div className="flex justify-between items-center">
        <CardHeader className="p-0 py-4">
          <CardTitle>Students List</CardTitle>
          <CardDescription>View and manage all students in the system</CardDescription>
        </CardHeader>
        <Button onClick={handleExport} className="py-2 px-4" disabled={exportLoading}>
          <Download className="h-4 w-4" />
          {exportLoading ? "Exporting..." : "Export"}
        </Button>
      </div>
      <CardContent className="p-0">
        <SearchAndFilter
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFiltersChange={setFilters}
          filterOptions={[...constantFilters, filterOptions]}
          placeholder="Search students by name, parent name, school, or city..."
          sortBy={sortBy}
          sortOptions={[
            { key: "name", label: "Name" },
            { key: "studentId", label: "Roll Number" },
            { key: "schoolname", label: "School Name" }
          ]}
          onSortChange={setSortBy}
        />
        {loading ? (
          <div className="flex justify-center items-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SR. No.</TableHead> {/* Add this line */}
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: Student, idx: number) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                        {/* Serial No calculation: (current page - 1) * 10 + idx + 1 */}
                        {(page - 1) * 10 + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {/* <Badge variant="outline" className="border-transparent px-0 chota-font">System added student</Badge> */}
                      {student.name}
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.stream}</TableCell>
                    <TableCell>{student.schoolName}</TableCell>
                    <TableCell>{student.paymentVerified ? student.studentId : "XXXXX"}</TableCell>
                    <TableCell>{student.parentContact}</TableCell>
                    <TableCell className={student.paymentVerified ? "text-green-500" : "text-red-500"}>
                      {student.paymentVerified ? "Received" : "Pending"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          className="w-9 h-9"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingStudent(student)}
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="w-9 h-9"
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingStudent(student)}
                          title="Delete Student"
                          // disabled
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          className="w-9 h-9"
                          variant="outline"
                          size="sm"
                          onClick={() => setVerifyPaymentStudent(student)}
                          title="Verify Payment"
                          disabled={student.paymentVerified}
                        >
                          <Banknote className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          className="w-9 h-9"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchActivityLogs(
                              undefined,
                              String(student.studentId)
                            )
                          }
                          title="Activity Logs"
                          // disabled={student.paymentVerified}
                        >
                          <Info className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={(p) => reloadStudents(p)} />

        {editingStudent && (
          <EditStudentDialog
            student={editingStudent}
            open={!!editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={onUpdateStudent}
          />
        )}

        {deletingStudent && (
          <DeleteConfirmDialog
            open={!!deletingStudent}
            onClose={() => setDeletingStudent(null)}
            onConfirm={() => {
              onDeleteStudent(deletingStudent._id!)
              setDeletingStudent(null)
            }}
            title="Delete Student"
            description={`Are you sure you want to delete "${deletingStudent.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}

        {user?.role === "finance" && verifyPaymentStudent && (
          <DeleteConfirmDialog
            open={!!verifyPaymentStudent}
            onClose={() => setVerifyPaymentStudent(null)}
            onConfirm={() => {
              if (user?.role === "finance") verifyPayment(verifyPaymentStudent)
              setVerifyPaymentStudent(null)
            }}
            title="Verify Payment"
            description={`Are you sure you want to verify payment for "${verifyPaymentStudent.name}"?`}
            confirmText="Verify Payment"
            cancelText="Cancel"
          />
        )}
        {showLogs && (
          <ActivityLogDialog
            open={showLogs}
            onClose={() => setShowLogs(false)}
            logs={activityLogs}
          />
        )}
      </CardContent>
    </Card>
  )
}
