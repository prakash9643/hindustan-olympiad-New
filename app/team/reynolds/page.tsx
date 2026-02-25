"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Link } from "lucide-react";

import Pagination from "@/components/pagination";
import SearchAndFilter from "@/components/search-and-filter";
import { useToast } from "@/hooks/use-toast";
import { regions, districts } from "@/utils/constants";

type EssaySchemaS = {
  _id: string;
  name: string,
  gender: string,
  age: number,
  school: string,
  class: string,
  phone: string,
  location: string,
  essayFile: string, // file path
  selfieFile: string, // file path
  agreed: boolean,
};

type StudentsResponse = {
  students: EssaySchemaS[];
  total: number;
  page: number;
  totalPages: number;
};


/* -------------------- component -------------------- */

export default function ViewReynolds() {
  const { success, error } = useToast();

  const [user, setUser] = useState<any>(null);

  const [studentData, setStudentData] = useState<StudentsResponse>({
    students: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({
    region: "",
    district: "",
  });

  /* ---------------- fetch ---------------- */
  const fetchStudents = async (page?: number) => {
    if (!user?._id) return;
    setLoading(true);

    const p = page ?? studentData.page ?? 1;

    try {
      const response = await axios.get<StudentsResponse>(
        `/api/reynolads/view-reynolds?page=${p}&limit=10&query=${search}&region=${filters.region}&district=${filters.district}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: user._id,
          },
        }
      );

      setStudentData(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!user?._id) return;
    setExportLoading(true);
    try {
      const res = await fetch(`/api/export/reynolds?search=${search}`, {
        method: "GET",
        headers: {
          authorization: user._id,
        },
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Reynolds.csv";
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

  /* ---------------- effects ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } catch {
      console.error("Invalid user in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    fetchStudents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search, filters]);

  /* ---------------- render ---------------- */
  const { students, total, page, totalPages } = studentData;

  return (
    <Card className="p-0 border-none pb-12">
      <div className="flex justify-between items-center">
        <CardHeader className="p-0 py-4">
          <CardTitle>Reynolds Students List</CardTitle>
          <CardDescription>
            View all Reynolds students in the system
          </CardDescription>
        </CardHeader>

        <Button
          onClick={handleExport}
          className="py-2 px-4"
          disabled={exportLoading || !user?._id}
        >
          <Download className="h-4 w-4" />
          {exportLoading ? "Exporting..." : "Export"}
        </Button>
      </div>

      <CardContent className="p-0">
        <SearchAndFilter
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFiltersChange={(f: Record<string, string>) => {
            setFilters((prev) => ({
              ...prev,
              ...f,
              district: f.region !== prev.region ? "" : f.district,
            }));
          }}
          filterOptions={[
            {
              key: "region",
              label: "Region",
              options: regions.map((r) => ({ value: r.value, label: r.label })),
            },
          ]}
          placeholder="Search students by name, school, or phone..."
          sortBy={"name"}
          sortOptions={[
            { key: "name", label: "Name" },
            { key: "schoolName", label: "School" },
          ]}
          onSortChange={() => {}}
        />

        {loading && <div className="flex justify-center items-center">Loading...</div>}

        {!loading && (
          <div className="overflow-x-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SR. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>School</TableHead>                  
                  <TableHead>Class</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>essayFile</TableHead>
                  <TableHead>selfieFile</TableHead>
                  <TableHead>Agreed</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students?.length > 0 &&
                  students.map((stu, idx) => (
                    <TableRow key={stu._id}>
                      <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                      <TableCell>{stu.name}</TableCell>
                      <TableCell>{stu.gender}</TableCell>
                      <TableCell>{stu.age}</TableCell>
                      <TableCell>{stu.school}</TableCell>
                      <TableCell>{stu.class}</TableCell>
                      <TableCell>{stu.phone}</TableCell>
                      <TableCell>{stu.location}</TableCell>
                      <TableCell>
                        <a href={stu.essayFile} target="_blank">
                          <Download className="h-4 w-4 inline" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={stu.selfieFile} target="_blank">
                          <Download className="h-4 w-4 inline" />
                        </a>
                      </TableCell>
                      <TableCell>{stu.agreed ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          total={total}
          onPageChange={(p) => fetchStudents(p)}
        />
      </CardContent>
    </Card>
  );
}
