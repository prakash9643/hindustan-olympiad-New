import { connectDB } from "@/utils/config/dbConfig";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { Student } from "@/utils/models/Student";
import { School } from "@/utils/models/School";
import { TeamMember } from "@/utils/models/team-members";
import { regions } from "@/utils/constants";

connectDB().catch(console.error);

export const checkForAccessOfSchool = async (authorization: string, schoolId: string, method: string) => {
  // accept either "<id>" or "Bearer <id>"
  const token = (authorization || "").split(" ").pop() || "";
  if (!token || token.length !== 24) {
    return { access: false, message: "Invalid token" };
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);
  if (!schoolCoordinator && !teamMember) {
    return { access: false, message: "Unauthorized" };
  }

  const school =
    schoolId.length === 7
      ? await School.findOne({ schoolId })
      : await School.findById(schoolId);

  if (!school) {
    return { access: false, message: "School not found" };
  }

  // ----- TEAM MEMBER -----
  if (teamMember) {
    const roleLower = (teamMember.role || "").toLowerCase();
    const methodUpper = method.toUpperCase();

    // Decide allowed roles by method
    const allowedRoles =
      methodUpper === "DELETE" ? ["admin", "finance"] : ["admin", "finance", "viewer"];

    // If role itself is not allowed, block immediately
    if (!allowedRoles.includes(roleLower)) {
      return { access: false, message: "Role not allowed for this action" };
    }

    // 🚨 BYPASS REGION for admin/finance (global access)
    if (["admin","finance"].includes(roleLower)) {
      return {
        access: true,
        message: "Authorized",
        accessType: roleLower,
        user: teamMember,
        school,
      };
    }
    if (roleLower === "finance" || roleLower === "admin") {
      return {
        access: true,
        message: "Authorized",
        accessType: roleLower,
        user: teamMember,
        school,
      };
    }
    // Sirf apne add kiye school ka access (viewer role)
    if (school.addedBy.toString() !== teamMember._id.toString()) {
      return { access: false, message: "Unauthorized", user: teamMember, school: null };
    }

    // Otherwise (viewer etc) check region
    const teamRegions =
      teamMember.region?.split(",").map((r: string) => r.trim()) || [];
    const schoolRegion = school.region?.trim();

    const hasRegionAccess = teamRegions.includes(schoolRegion);
    if (!hasRegionAccess) {
      return { access: false, message: "This school is not accessible to you" };
    }

    return {
      access: true,
      message: "Authorized",
      accessType: roleLower,
      user: teamMember,
      school,
    };
  }

  // ----- SCHOOL COORDINATOR -----
  if (schoolCoordinator) {
    const same =
      schoolCoordinator.schoolId?.toString() === school._id?.toString() ||
      schoolCoordinator.school_id === school.schoolId;

    if (same) {
      return {
        access: true,
        message: "Authorized",
        accessType: "schoolCoordinator",
        user: schoolCoordinator,
        school,
      };
    }
    return { access: false, message: "This school is not accessible to you" };
  }

  return { access: false, message: "This school is not accessible to you" };
};


export const checkForAccessOfStudent = async (authorization: string, studentId: string, method: string) => {
  const token = (authorization || "").split(" ").pop() || "";
  if (!token || token.length !== 24) {
    return {
      access: false,
      message: "Invalid token",
      accessType: null,
      user: null,
      student: null,
    };
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);

  if (!schoolCoordinator && !teamMember) {
    return {
      access: false,
      message: "Unauthorized",
      accessType: null,
      user: null,
      student: null,
    };
  }

  const student =
    studentId.length === 11
      ? await Student.findOne({ studentId })
      : await Student.findById(studentId);

  if (!student) {
    return {
      access: false,
      message: "Student not found",
      accessType: null,
      user: null,
      student: null,
    };
  }

  // ----- TEAM MEMBER -----
  if (teamMember) {
    const roleLower = (teamMember.role || "").toLowerCase();
    const methodUpper = method.toUpperCase();

    const allowedRoles =
      methodUpper === "DELETE" ? ["admin", "finance"] : ["admin", "finance", "viewer"];

    if (!allowedRoles.includes(roleLower)) {
      return {
        access: false,
        message: "Role not allowed for this action",
        accessType: null,
        user: null,
        student: null,
      };
    }

    // 🚨 BYPASS REGION for admin/finance
    if (["admin", "finance"].includes(roleLower)) {
      return {
        access: true,
        message: "Authorized",
        accessType: roleLower,
        user: teamMember,
        student,
      };
    }

    const teamRegions =
      teamMember.region?.split(",").map((r: string) => r.trim()) || [];
    const studentRegion = student.region?.trim();

    const hasRegionAccess = teamRegions.includes(studentRegion);
    if (!hasRegionAccess) {
      return {
        access: false,
        message: "This student is not accessible to you",
        accessType: null,
        user: null,
        student: null,
      };
    }

    return {
      access: true,
      message: "Authorized",
      accessType: roleLower,
      user: teamMember,
      student,
    };
  }

  // ----- SCHOOL COORDINATOR -----
  if (schoolCoordinator) {
    if (
      schoolCoordinator.schoolId === student.schoolId ||
      schoolCoordinator.school_id === student.schoolId
    ) {
      return {
        access: true,
        message: "Authorized",
        accessType: "schoolCoordinator",
        user: schoolCoordinator,
        student,
      };
    } else {
      return {
        access: false,
        message: "This student is not accessible to you",
        accessType: null,
        user: null,
        student: null,
      };
    }
  }

  return {
    access: false,
    message: "This student is not accessible to you",
    accessType: null,
    user: null,
    student: null,
  };
};

