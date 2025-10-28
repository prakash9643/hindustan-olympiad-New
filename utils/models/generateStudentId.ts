// utils/generateStudentId.ts
import { IndiviualStudent } from "@/utils/models/indiviualStudents";

// const regionCodes: Record<string, string> = {
//   "East UP": "6",
//   "West UP": "7",
//   "Bihar": "8",
//   "Jharkhand": "9",
//   "Uttarakhand": "10",
// };

const districtCodes: Record<string, string> = {
   kanpur: "601", 
   lucknow: "602", 
   gorakhpur: "603", 
   allahabad: "604", 
   varanasi: "605", 
   agra: "701", 
   aligarh: "702", 
   bareilly: "703", 
   meerut: "704", 
   moradabad: "705",
   patna: "801", 
   bhagalpur: "802", 
   muzaffarpur: "803", 
   gaya: "804", 
   purnea: "805",
   ranchi: "901", 
   dhanbad: "902", 
   jamshedpur: "903",
   haldwani: "101", 
   dehradun: "102",
};

export async function generateStudentId(district: string) {
  // const regionCode = regionCodes[region] || "9";
  const districtCode = districtCodes[district] || "99";

  const lastStudent = await IndiviualStudent.findOne().sort({ createdAt: -1 });
  let uniqueNumber = "00000001";

  if (lastStudent?.studentId) {
    const lastUnique = parseInt(lastStudent.studentId.slice(-8), 10);
    uniqueNumber = (lastUnique + 1).toString().padStart(8, "0");
  }

  // return `${regionCode}${districtCode}${uniqueNumber}`;
   return `${districtCode}${uniqueNumber}`;
}
