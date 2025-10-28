import mongoose from "mongoose";

export interface IEoiStudent extends mongoose.Document {
    name: string;
    region: string;
    district: string;
    phoneNumber: string;
    schoolName: string;
    schoolCoordinatorContact: string;
    class: string;
}

const eoiStudentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        region: { type: String, required: true },
        district: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        schoolName: { type: String, required: true },
        schoolCoordinatorContact: { type: String, required: true },
        class: { type: String, required: true },
    },
    { timestamps: true }
);

export const EoiStudent =
    mongoose.models.EoiStudent || mongoose.model<IEoiStudent>("EoiStudent", eoiStudentSchema);