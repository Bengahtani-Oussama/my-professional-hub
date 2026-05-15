import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ["unread", "replied"], default: "unread" },
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model("Message", MessageSchema);