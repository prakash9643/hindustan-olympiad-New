import mongoose, { Document, Schema } from "mongoose"

export interface IActivityLog extends Document {
  schoolId?: string   // optional
  studentId?: string  // optional
  userId: string
  action: string
  description: string
  createdAt: Date
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    schoolId: { type: String, required: false },
    studentId: { type: String, required: false },
    userId: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // sirf createdAt
  }
)

export const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema)
