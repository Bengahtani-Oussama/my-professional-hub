import mongoose from "mongoose";
import { LocalizedString, LocalizedArray } from "./localized.js";
const EducationSchema = new mongoose.Schema({
  diploma: LocalizedString,
  institution: LocalizedString,
  duration: LocalizedString,
  location: LocalizedString,
  grade: LocalizedString,
  description: LocalizedString,
  achievements: LocalizedArray,
  subjects: LocalizedArray,
  order: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model("Education", EducationSchema);