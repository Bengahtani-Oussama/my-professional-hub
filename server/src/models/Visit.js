import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema(
  {
    path: { type: String, default: "/" },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

VisitSchema.index({ createdAt: -1 });

export default mongoose.model("Visit", VisitSchema);