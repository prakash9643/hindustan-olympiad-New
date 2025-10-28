import mongoose from "mongoose";

export interface IndiviualStudentS extends mongoose.Document {
    studentId: string; // नया field
    name: string;
    district: string;
    // phoneNumber: string;
    schoolName: string;
    class: string;
    section: string;
    gender: string;
    stream: string;
    parentName: string;
    parentContact: string;
    parentEmail: String,
    schoolBranch: string;
    schoolAddress: string;
    region: string;
    paymentVerified: boolean;
    orderId: string;
    transactionId: string;
    dateOfBirth: Date; // optional field
    schoolDistrict: string;
    relationshipWithStudent: string; // optional field
}

const IndiviualStudentSchema = new mongoose.Schema(
    {
        studentId: { type: String, unique: true }, // auto generate होगा
        name: { type: String, required: true },
        district: { type: String, required: true },
        // phoneNumber: { type: String, required: true },
        schoolName: { type: String, required: true },
        class: { type: String, required: true },
        section: { type: String, required: true },
        gender: { type: String, required: true },
        stream: { type: String, required: false }, // required only for 11/12
        parentName: { type: String, required: true },
        parentContact: { type: String, required: true },
        parentEmail: { type: String, required: true },
        schoolBranch: { type: String, required: true },
        schoolAddress: { type: String, required: true },
        region: { type: String, required: true },
        schoolDistrict: { type: String, required: true },
        paymentVerified: { type: Boolean, default: false },
        orderId: { type: String, required: true },
        transactionId: { type: String, required: true },
        dateOfBirth: { type: Date, required: true }, // optional field
        relationshipWithStudent: { type: String, required: true }, // optional field
    },
    { timestamps: true }
);

delete mongoose.models.IndiviualStudent;
export const IndiviualStudent =
    mongoose.models.IndiviualStudent || mongoose.model<IndiviualStudentS>("IndiviualStudent", IndiviualStudentSchema);