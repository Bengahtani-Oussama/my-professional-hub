import mongoose from "mongoose";
import { LocalizedString } from "./localized.js";
const SettingsSchema = new mongoose.Schema({
  _singleton: { type: String, default: "settings", unique: true },
  siteTitle: LocalizedString,
  siteLogo: { type: String, default: "" },
  seoDescription: LocalizedString,
  aboutMeTitle: LocalizedString,
  aboutMeDescription: LocalizedString,
  resumeUrl: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  availableToWork: { type: Boolean, default: false },
  location: LocalizedString,
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
  visitorCount: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model("Settings", SettingsSchema);