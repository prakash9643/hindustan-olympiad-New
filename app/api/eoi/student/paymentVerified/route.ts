import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { IndiviualStudent } from "@/utils/models/indiviualStudents";

connectDB().catch(console.error);

export async function POST(req: NextRequest) {
  try {
    const { orderId, transactionId } = await req.json();

    // student find + update
    const student = await IndiviualStudent.findOneAndUpdate(
      { orderId, transactionId },          // jiska payment match kare
      { $set: { paymentVerified: true } }, // update karo
      { new: true }                        // updated doc return karo
    );

    if (!student) {
      return NextResponse.json(
        { error: "Student not found or invalid payment" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Payment verified successfully",
      student,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}
