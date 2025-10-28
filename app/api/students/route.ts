import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { School } from "@/utils/models/School";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { TeamMember } from "@/utils/models/team-members";
import { ActivityLog } from "@/utils/models/ActivityLogs";

connectDB().catch(console.error);

function generateStudentId(schoolId: string, rollNumber: string) {
  const schoolPart = schoolId.replace(/-/g, ""); // Remove dashes
  const rollStr = rollNumber.toString().padStart(4, "0");
  return `${schoolPart}${rollStr}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const headers = req.headers;
  const authorization = headers.get("authorization");
  var isTeamMember = false;
  if (!authorization) {
    return NextResponse.json({ error: "Authorization header required" }, { status: 400 });
  }

  const token = authorization.split(" ")[0];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized : No token provided" }, { status: 401 });
  }

  if (token.length !== 24) {
    return NextResponse.json({ error: "Unauthorized : Invalid token" }, { status: 401 });
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);

  if (!schoolCoordinator && !teamMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (teamMember) {
    isTeamMember = true;
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";

  const query: any = {};

  if (search) {
    const searchRegex = new RegExp(search, "i");

    const orQuery: any[] = [
      { name: searchRegex },
      { studentId: searchRegex },
      { schoolName: searchRegex }, // added this line
    ];

    query.$or = orQuery;
  }

  if (isTeamMember) {
    query.region = { $in: teamMember.region.split(",") };
  }
  if (schoolCoordinator) {
    query.schoolId = schoolCoordinator.school_id;
  }

  console.log(query);

  const students = await Student.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sortBy]: 1 });

  const total = await Student.countDocuments(query);

  return NextResponse.json({
    students,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const headers = req.headers;
  const authorization = headers.get("authorization") || "";

  if (!authorization) {
    return NextResponse.json({ error: "Authorization header required" }, { status: 400 });
  }

  const token = authorization.split(" ")[0];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized : No token provided" }, { status: 401 });
  }

  if (token.length !== 24) {

    return NextResponse.json({ error: "Unauthorized : Invalid token" }, { status: 401 });
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);

  if (!schoolCoordinator && !teamMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (teamMember) {
    if (teamMember.region.split(",").includes(data.region)) {
      console.log("Team member region matches");
    }
    else {
      return NextResponse.json({ error: "Unauthorized : Regions dont match" }, { status: 401 });
    }

  }

  if (schoolCoordinator) {
    if (schoolCoordinator.school_id !== data.schoolId) {
      return NextResponse.json({ error: "Unauthorized : you cant add students to other schools" }, { status: 401 });
    }
  }

  if (!data.schoolId) {
    return NextResponse.json({ error: "schoolId required" }, { status: 400 });
  }

  const school = await School.findOne({ schoolId: data.schoolId });
  if (!school) {
    return NextResponse.json({ error: "Invalid schoolId" }, { status: 400 });
  }

  // Find highest roll number for this school
  const lastStudent = await Student.find({ schoolId: data.schoolId })
    .sort({ studentId: -1 })
    .limit(1);

  let newRollNumberSuffix: string;

  if (lastStudent.length > 0) {
    const lastRoll = lastStudent[0].studentId; // e.g., "16500040001"
    const lastFour = parseInt(lastRoll.slice(-4)); // => 1
    const nextFour = (lastFour + 1).toString().padStart(4, "0"); // => "0002"
    console.log("lastRoll", lastRoll);
    console.log("lastFour", lastFour);
    console.log("nextFour", nextFour);
    newRollNumberSuffix = nextFour;
  } else {
    newRollNumberSuffix = "0001";
  }

  // Auto-fill school info
  data.rollNumber = newRollNumberSuffix;
  data.studentId = generateStudentId(data.schoolId, newRollNumberSuffix);
  data.schoolId = school.schoolId;
  data.schoolName = school.schoolName;
  data.branch = school.branch;
  data.city = school.city || data.city || "";
  data.district = data.district = Array.isArray(school.district) ? school.district[0] : school.district;
  data.region = school.region;
  data.pincode = school.pincode || "";

  const student = new Student(data);
  await student.save();
  // Increment the number of students in the School
  const updateResult = await School.updateOne(
    { schoolId: data.schoolId },
    { $inc: { studentsCount: 1 } }
  );

  console.log(updateResult);
  const userId = teamMember?._id.toString() || schoolCoordinator?._id.toString();
  console.log("userId for log:", userId);
  await ActivityLog.create({
    schoolId: school.schoolId,
    studentId: student?.studentId,
    userId: userId,
    action: "STUDENT_ADD",
    description: `New Student Added with name ${student.name} by ${teamMember?.name}`,
  });

  return NextResponse.json(student, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const student = await Student.findById(data.studentId);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  Object.assign(student, data);
  await student.save();

  return NextResponse.json(student);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const student = await Student.findById(id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Reduce count of students in the School


  await student.remove();
  await ActivityLog.create({
    schoolId: student.schoolId,
    action: "STUDENT_DELETE",
    description: `Deleted school ${student.name}`,
  });
  return NextResponse.json({ message: "Deleted" });
}
