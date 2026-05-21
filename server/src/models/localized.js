import mongoose from "mongoose";

export const LocalizedString = {
  en: { type: String, default: "" }, fr: { type: String, default: "" },
  ar: { type: String, default: "" }, nl: { type: String, default: "" },
  it: { type: String, default: "" }, es: { type: String, default: "" },
  tr: { type: String, default: "" },
};

export const LocalizedArray = {
  en: { type: [String], default: [] }, fr: { type: [String], default: [] },
  ar: { type: [String], default: [] }, nl: { type: [String], default: [] },
  it: { type: [String], default: [] }, es: { type: [String], default: [] },
  tr: { type: [String], default: [] },
};

export const ExperienceLikeSchema = new mongoose.Schema({
  title: LocalizedString,
  description: LocalizedString,
  location: LocalizedString,
  imageUrl: { type: String, default: "" },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  overview: LocalizedString,
  responsibilities: LocalizedArray,
  challenges: LocalizedArray,
  features: LocalizedArray,
  architecture: { title: LocalizedString, description: LocalizedString },
  stack: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  repoUrl: { type: String, default: "" },
  liveUrl: { type: String, default: "" },
  featured: { type: Boolean, default: false },
  current: { type: Boolean, default: false },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
}, { timestamps: true });