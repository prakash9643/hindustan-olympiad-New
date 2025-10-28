"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Banknote, Download, Edit, Info, Trash2, Users } from "lucide-react";

import type { School, SchoolsResponse } from "@/types/school";
import EditSchoolDialog from "@/components/ui/edit-school-dialog";
import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import Pagination from "@/components/pagination";
import SearchAndFilter from "@/components/search-and-filter";
import { useToast } from "@/hooks/use-toast";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { regions, districts } from "@/utils/constants";
import ActivityLogDialog from "@/components/ActivityLogs";
import MultiSelectDistrict, { OptionType } from "@/components/ui/multiSelectDistrict";

/* -------------------- local types -------------------- */
type RegionOption = { value: string; label: string };
type DistrictOption = { value: string; label: string };
type FilterOption = {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
};

/* -------------------- helpers -------------------- */

function normalizeRegion(regionStr: string) {
  const v = (regionStr || "").trim();
  if (!v) return v;
  const hit = regions.find(
    (r) => r.value === v || r.label.toLowerCase() === v.toLowerCase()
  );
  return hit ? hit.value : v;
}

// label निकालने के लिए – अगर region सही न भी हो, तब भी global fallback से label दे देता है
// function getDistrictLabelByRegion(regionStr: string, districtCode: string) {
//   if (!districtCode) return districtCode;
//   const regionKey = normalizeRegion(regionStr);

//   // 1) region के अंदर खोजो
//   const list: DistrictOption[] = (districts as any)[regionKey] || [];
//   const exact = list.find((d) => d.value === districtCode);
//   if (exact) return exact.label;

//   // 2) global fallback
//   for (const rk of Object.keys(districts)) {
//     const arr: DistrictOption[] = (districts as any)[rk] || [];
//     const m = arr.find((d) => d.value === districtCode);
//     if (m) return m.label;
//   }

//   return districtCode;
// }
// ✅ Add this helper function just below normalizeRegion or in the helpers section
// ✅ district labels string/array dono handle karega
function getDistrictLabels(regionStr: string, districtCodes: string | string[]): string {
  if (!districtCodes) return "";
  
  const codes = Array.isArray(districtCodes)
    ? districtCodes
    : districtCodes.split(",").map((d) => d.trim());

  const regionKey = normalizeRegion(regionStr);

  const labels = codes.map((code) => {
    const regionList: DistrictOption[] = (districts as any)[regionKey] || [];
    const foundInRegion = regionList.find((d) => d.value === code);
    if (foundInRegion) return foundInRegion.label;

    // fallback: search in all regions
    for (const rk of Object.keys(districts)) {
      const arr: DistrictOption[] = (districts as any)[rk] || [];
      const match = arr.find((d) => d.value === code);
      if (match) return match.label;
    }

    return code;
  });

  return labels.join(", ");
}

/* -------------------- component -------------------- */

export default function ViewSchools() {
  const router = useRouter();
  const { success, error } = useToast();

  const [user, setUser] = useState<any>(null);

  // For dropdowns
  const [allSchools, setAllSchools] = useState<School[]>([]);

  // Paginated table data
  const [schoolData, setSchoolData] = useState<SchoolsResponse>({
    schools: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });

  // UI states
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [verifyPaymentSchool, setVerifyPaymentSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  // Query/filter/sort
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({
    region: "",
    district: "",
    board: "",
  });
  const [sortBy, setSortBy] = useState<string>("schoolName");
  const [showLogs, setShowLogs] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  /* --------------- Fetch helpers --------------- */

  const fetchAllSchools = async (userId: string) => {
    try {
      const res = await fetch(`/api/schools?all=true`, {
        headers: {
          "Content-Type": "application/json",
          authorization: userId,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch:", await res.text());
        return;
      }

      const data = await res.json();
      setAllSchools(data.schools || []);
      console.log("ALL schools for me:", (data.schools || []).length);
    } catch (err) {
      console.error("Error fetching all schools:", err);
    }
  };

  const fetchSchools = async (page?: number) => {
    if (!user?._id) return;
    setLoading(true);

    const p = page ?? schoolData.page ?? 1;

    try {
      const districtParam = filters.district || "";
      const response = await axios.get<SchoolsResponse>(
        `/api/schools?page=${p}&limit=10&query=${search}&region=${filters.region}&district=${districtParam}&board=${filters.board}&sortBy=${sortBy}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: user._id,
          },
        }
      );

      setSchoolData(response.data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };
const fetchActivityLogs = async (id: string) => {
    setShowLogs(true);
    try {
      const res = await fetch(
        `/api/activity-logs?id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch activity logs");
        console.log(!res);
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
  const onPageChange = (page: number) => fetchSchools(page);
  const onSearchChange = (value: string) => setSearch(value);
  const onFiltersChange = (value: Record<string, string>) => setFilters(value);

  /* --------------- Mutations --------------- */

  const onUpdateSchool = async (school: School) => {
    try {
      const response = await fetch(`/api/schools/${school.schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: user?._id || "",
        },
        body: JSON.stringify(school),
      });

      const data = await response.json();
      if (data.error) {
        error("Something went wrong!", {
          duration: 3000,
          position: "top-right",
          description: data.error,
        });
      } else {
        success("School updated!", {
          position: "top-right",
          duration: 2000,
          description: "Your school has been updated successfully.",
        });
        fetchSchools();
      }
    } catch (e: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: e?.message || "Update failed",
      });
    }
  };

  const onDeleteSchool = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: user?._id || "",
        },
      });

      const data = await response.json();
      if (data.error) {
        error("Something went wrong!", {
          duration: 3000,
          position: "top-right",
          description: data.error,
        });
      } else {
        success("School deleted!", {
          position: "top-right",
          duration: 2000,
          description: "Your school has been deleted successfully.",
        });
        fetchSchools();
        fetchAllSchools(user?._id);
      }
    } catch (e: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: e?.message || "Delete failed",
      });
    }
  };

  const verifyPayment = async (school: School) => {
    try {
      const response = await fetch(`/api/schools/${school.schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: user?._id || "",
        },
        body: JSON.stringify({
          ...school,
          confirmPayment: true,
        }),
      });

      const data = await response.json();
      if (data.error) {
        error("Something went wrong!", {
          duration: 3000,
          position: "top-right",
          description: data.error,
        });
      } else {
        success("Payment verified!", {
          position: "top-right",
          duration: 2000,
          description: "Your payment has been verified successfully.",
        });
        fetchSchools();
      }
    } catch (e: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: e?.message || "Verify failed",
      });
    }
  };

  const handleExport = async () => {
    if (!user?._id) return;
    setExportLoading(true);
    try {
      const res = await fetch(`/api/export/schools?search=${search}&sortBy=${sortBy}`, {
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
      a.download = "schools.csv";
      a.click();
    } catch (e: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: "Failed to export schools.",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const viewSchoolStudents = (school: School) => {
    router.push(`/team/view-students?search=${school.schoolId}`);
  };

  /* --------------- Effects --------------- */

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
    fetchAllSchools(user._id);
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    fetchSchools(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search, filters, sortBy]);

  /* --------------- Derived for filters --------------- */

  const { schools, total, page, totalPages } = schoolData;

  const uniqueSchoolNames = Array.from(new Set(allSchools.map((s) => s.schoolName)))
    .filter(Boolean)
    .sort();

  const uniqueRegions: RegionOption[] = regions.map((r) => ({
    value: r.value,
    label: r.label,
  }));


  // 👉 Districts अब तभी दिखेंगे जब region चुना गया हो
  const uniqueDistricts: DistrictOption[] =
    filters.region && filters.region !== ""
      ? ((districts as Record<string, DistrictOption[]>)[
          normalizeRegion(filters.region)
        ] || []).map((d) => ({ value: d.value, label: d.label }))
      : [];

  const schoolFilterOptions: FilterOption[] = [
    {
      key: "region",
      label: "Region",
      options: uniqueRegions,
    },
    {
      key: "district",
      label: "District",
      options: uniqueDistricts,
    },
    {
      key: "board",
      label: "Board",
      options: [
        { value: "board", label: "Board" },
        { value: "Board 2", label: "Board 2" },
        { value: "Board 3", label: "Board 3" },
      ],
    },
  ];

  /* --------------- Render --------------- */

  return (
    <Card className="p-0 border-none pb-12">
      <div className="flex justify-between items-center">
        <CardHeader className="p-0 py-4">
          <CardTitle>Schools List</CardTitle>
          <CardDescription>
            View and manage all schools in the system
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
          onSearchChange={onSearchChange}
          filters={filters}
          onFiltersChange={(f: Record<string, string>) => {
            // अगर region बदला तो district reset कर दो
            setFilters((prev) => ({
              ...prev,
              ...f,
              district: f.region !== prev.region ? "" : f.district,
            }));
          }}
          filterOptions={schoolFilterOptions}
          placeholder="Search schools by name, branch, principal, or serial number..."
          sortBy={sortBy}
          sortOptions={[
            { key: "schoolName", label: "School Name" },
            { key: "schoolId", label: "School ID" },
          ]}
          onSortChange={(value: string) => setSortBy(value)}
        />

        {loading && (
          <div className="flex justify-center items-center">Loading...</div>
        )}

        {!loading && (
          <div className="overflow-x-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <select
                      className="text-sm w-full bg-transparent outline-none"
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    >
                      <option value="">Schools</option>
                      {uniqueSchoolNames.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>School ID</TableHead>
                  <TableHead>
                    <select
                      className="text-sm w-full bg-transparent outline-none"
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          region: e.target.value,
                          district: "", // reset district
                        }))
                      }
                      value={filters.region}
                    >
                      <option value="">Regions</option>
                      {uniqueRegions.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </TableHead>
                  <TableHead>
                    <MultiSelectDistrict
                      value={
                        filters.district
                          ? filters.district.split(",").map(d => ({ label: d, value: d }))
                          : []
                      }
                      options={uniqueDistricts}
                      onChange={(selectedOptions: OptionType[]) => {
                        const values = selectedOptions.map(opt => opt.value);
                        setFilters(prev => ({
                          ...prev,
                          district: values.join(","), // backend ke liye string store
                        }));
                      }}
                      isDisabled={!filters.region}
                    />
                  </TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {schools?.length > 0 &&
                  schools.map((school) => (
                    <TableRow key={`school_${school.schoolId}`}>
                      <TableCell className="font-medium">
                        {school.schoolName}
                      </TableCell>
                      <TableCell>{school.branch}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {school.schoolId}
                          <CopyToClipboard text={school.schoolId || ""} />
                        </div>
                      </TableCell>
                      <TableCell>
                        {school.region
                          ?.split(",")
                          .map(
                            (r) =>
                              regions.find(
                                (region) =>
                                  region.value === normalizeRegion(r)
                              )?.label || r
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {getDistrictLabels(
                          school.region,
                          school.district
                        )}
                      </TableCell>
                      <TableCell>{school.principalName}</TableCell>
                      <TableCell>
                        {school.paymentVerification}/{school.studentsCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            className="w-9 h-9"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSchool(school)}
                            title="Edit School"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            className="w-9 h-9"
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingSchool(school)}
                            title="Delete School"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <Button
                            className="w-9 h-9"
                            variant="outline"
                            size="sm"
                            onClick={() => viewSchoolStudents(school)}
                            title="View students"
                          >
                            <Users className="h-4 w-4" />
                          </Button>

                          <Button
                            className="w-9 h-9"
                            variant="outline"
                            size="sm"
                            disabled={
                              school.paymentVerification === school.studentsCount || user?.role !== "finance"
                            }
                            onClick={() => setVerifyPaymentSchool(school)}
                            title="Verify payment for school"
                          >
                            <Banknote className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            className="w-9 h-9"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              fetchActivityLogs(String(school?.schoolId))
                            }
                            title="Activity Logs"
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          total={total}
          onPageChange={onPageChange}
        />

        {editingSchool && (
          <EditSchoolDialog
            school={editingSchool}
            open={!!editingSchool}
            onClose={() => setEditingSchool(null)}
            onSave={onUpdateSchool}
          />
        )}

        {deletingSchool && (
          <DeleteConfirmDialog
            open={!!deletingSchool}
            onClose={() => setDeletingSchool(null)}
            onConfirm={() => {
              onDeleteSchool(deletingSchool._id || "");
              setDeletingSchool(null);
            }}
            title="Delete School"
            description={`Are you sure you want to delete "${deletingSchool.schoolName}"? This action cannot be undone and will also remove all students associated with this school.`}
          />
        )}

        {user?.role === "finance" && verifyPaymentSchool && (
          <DeleteConfirmDialog
            open={!!verifyPaymentSchool}
            onClose={() => setVerifyPaymentSchool(null)}
            onConfirm={() => {
              if (user?.role === "finance") {
                verifyPayment(verifyPaymentSchool);
                setVerifyPaymentSchool(null);
              }
            }}
            title="Verify Payment"
            description={`Are you sure you want to verify payment for "${verifyPaymentSchool.schoolName}"? This action cannot be undone.`}
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
  );
}
