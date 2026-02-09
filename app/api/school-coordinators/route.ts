import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";

connectDB().catch(console.error);

export async function GET() {
  const coordinators = await SchoolCoordinator.find();
  return NextResponse.json(coordinators);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const headers = req.headers;
  const coordinator = new SchoolCoordinator(data);
  await coordinator.save();
  return NextResponse.json(coordinator, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data._id) return NextResponse.json({ error: "_id required" }, { status: 400 });

  const updated = await SchoolCoordinator.findByIdAndUpdate(data._id, data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const deleted = await SchoolCoordinator.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
