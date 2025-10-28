"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Download, Edit, Trash2 } from "lucide-react"
import type { Student, StudentsResponse } from "@/types/student"
import type { School } from "@/types/school"
import EditStudentDialog from "@/components/edit-student-dialog"
import DeleteConfirmDialog from "@/components/delete-confirm-dialog"
import Pagination from "@/components/pagination"
import SearchAndFilter from "@/components/search-and-filter"
import { useToast } from "@/hooks/use-toast"
import { SchoolCoordinator } from "@/types/school-coordinator"
import { useRouter } from 'next/navigation';


export default function ViewStudents() {

    const router = useRouter();
    const { success, toast, error } = useToast()
    const [loading, setLoading] = useState(true)
    const [exportLoading, setExportLoading] = useState(false)
    const [school, setSchool] = useState<School | null>(null)
    const [user, setUser] = useState<SchoolCoordinator | null>(null)
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
    const [verifyPaymentStudent, setVerifyPaymentStudent] = useState<Student | null>(null)
    const [studentsData, setStudentsData] = useState<StudentsResponse>({
        students: [],
        total: 0,
        page: 1,
        totalPages: 0,
    })
    const [sortBy, setSortBy] = useState<string>("name");

    const { students, total, page, totalPages } = studentsData

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


    const [search, setSearch] = useState<string>("")

    const handleStudentSearchChange = (search: string) => {
        setSearch(search)
        onSearchChange(search)
    }

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
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
            success('Student updated!', { position: "top-right", duration: 2000, description: "Your student has been updated successfully." })
        }
    }

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
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
            success('Student deleted!', { position: "top-right", duration: 2000, description: "Your student has been deleted successfully." })
            fetchStudents(1, 10, search, sortBy)
        }
    }

    const onSearchChange = (search: string) => {
        setSearch(search)
    }
    const fetchStudents = async (page = 1, limit = 10, search = "", sortBy: string) => {
        setLoading(true)
        const response = await fetch(`/api/students?page=${page}&limit=${limit}&search=${search}&schoolId=${school?.schoolId}&sortBy=${sortBy}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
            },
        })
        const data = await response.json()
        console.log(data)
        setStudentsData(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchStudents(1, 10, search, sortBy)
    }, [search, school, user, sortBy])

    const onPageChange = (page: number) => {
        fetchStudents(page, 10, search, sortBy)
    }

    const sortOptions = [
        { key: "name", label: "Name" },
        { key: "studentId", label: "Student ID" },
    ]

    const verifyPayment = async (student: Student) => {
        const response = await fetch(`/api/students/${student._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...student,
                confirmPayment: true,
            }),
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        }
        else {
            success('Payment verified!', { position: "top-right", duration: 2000, description: "Your payment has been verified successfully." })
            fetchStudents(page, 10, search, sortBy)
        }
    }

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const res = await fetch(`/api/export/students?search=${search}&sortBy=${sortBy}`, {
                method: "GET",
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem("user") || "{}")._id}`,
                },
            });

            if (!res.ok) {
                throw new Error("Export failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "students.csv";
            a.click();
        } catch (e: any) {
            error("Something went wrong!", {
                duration: 3000,
                position: "top-right",
                description: "Failed to export students.",
            });
        } finally {
            setExportLoading(false);
        }
    };


    return (
        <Card className="p-0 border-none pb-12">
            <div className="flex justify-between items-center">
                <CardHeader className="p-0 py-4">
                    <CardTitle>Students List</CardTitle>
                    <CardDescription>View and manage all students in the system</CardDescription>
                </CardHeader>
                <Button onClick={handleExport} className="py-2 px-4" disabled={exportLoading}>
                    <Download className="h-4 w-4" />
                    { exportLoading ? "Exporting..." : "Export"}
                </Button>
            </div>
            <CardContent className="p-0">
                <SearchAndFilter
                    search={search}
                    onSearchChange={onSearchChange}
                    filters={{ gender: "", class: "", stream: "" }}
                    onFiltersChange={() => { }}
                    filterOptions={[]}
                    placeholder="Search students by name, parent name, school, or city..."
                    sortBy={sortBy}
                    sortOptions={[
                        { key: "name", label: "Name" },
                        { key: "studentId", label: "Roll Number" },
                        // { key: "studentId", label: "Student ID" },
                    ]}
                    onSortChange={(value) => { setSortBy(value) }}
                />
                {loading ? <div className="flex justify-center items-center mt-4 animate-pulse">Loading...</div> : <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Stream</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Roll Number</TableHead>
                                {/* <TableHead>Student ID</TableHead> */}
                                <TableHead>Contact</TableHead>
                                <TableHead>Payment </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student: any) => (
                                <TableRow key={student._id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>{student.section}</TableCell>
                                    <TableCell>{student.gender}</TableCell>
                                    <TableCell>{student.stream}</TableCell>
                                    <TableCell>{student.schoolName}</TableCell>
                                    <TableCell>{student.paymentVerified ? student.studentId : "XXXXX"}</TableCell>
                                    <TableCell>{student.parentContact}</TableCell>
                                    <TableCell className={`${student.paymentVerified ? 'text-green-500' : 'text-red-500 '} `}>
                                        {student.paymentVerified ? "Received" : "Pending"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button className="w-9 h-9" variant="outline" size="sm" title="Edit Student" onClick={() => setEditingStudent(student)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button className="w-9 h-9" variant="outline" size="sm" title="Delete Student" onClick={() => setDeletingStudent(student)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    total={total}
                    onPageChange={onPageChange}
                    itemsPerPage={10}
                />

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
                    />
                )}
            </CardContent>
        </Card>
    )
}