import mongoose from "mongoose";
import { LocalizedString } from "./localized.js";
const SkillSchema = new mongoose.Schema({
  category: LocalizedString,
  categoryKey: { type: String, enum: ["frontend", "backend", "tools"], default: "frontend" },
  name: LocalizedString,
  percentage: { type: Number, min: 0, max: 100, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model("Skill", SkillSchema);