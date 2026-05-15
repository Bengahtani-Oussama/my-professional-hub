export type Locale = "en" | "fr" | "ar" | "nl" | "it" | "es" | "tr";
export const ALL_LOCALES: Locale[] = ["en", "fr", "ar", "nl", "it", "es", "tr"];
export const UI_LOCALES: Locale[] = ["en", "fr", "ar"];

export type LocalizedString = Record<Locale, string>;
export type LocalizedArray = Record<Locale, string[]>;

export const emptyLocalized = (): LocalizedString =>
  ({ en: "", fr: "", ar: "", nl: "", it: "", es: "", tr: "" });

export const emptyLocalizedArray = (): LocalizedArray =>
  ({ en: [], fr: [], ar: [], nl: [], it: [], es: [], tr: [] });

export interface Experience {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  tags: string[];
  images: string[];
  overview: LocalizedString;
  responsibilities: LocalizedArray;
  challenges: LocalizedArray;
  features: LocalizedArray;
  architecture: { title: LocalizedString; description: LocalizedString };
  stack: string[];
  skills: string[];
  repoUrl?: string;
  liveUrl?: string;
  featured: boolean;
  current?: boolean;
  startDate?: string;
  endDate?: string;
}

export type Project = Experience;

export type SkillCategory = "frontend" | "backend" | "tools";

export interface Skill {
  _id: string;
  category: LocalizedString;
  categoryKey: SkillCategory;
  name: LocalizedString;
  percentage: number;
  order: number;
}

export interface Education {
  _id: string;
  diploma: LocalizedString;
  institution: LocalizedString;
  duration: LocalizedString;
  location: LocalizedString;
  grade: LocalizedString;
  description: LocalizedString;
  achievements: LocalizedArray;
  subjects: LocalizedArray;
  order: number;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "replied";
  createdAt: string;
}

export interface Settings {
  siteTitle: LocalizedString;
  siteLogo: string;
  seoDescription: LocalizedString;
  resumeUrl: string;
  profileImage: string;
  email: string;
  phone: string;
  location: LocalizedString;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  visitorCount: number;
}

export interface AuthUser { id: string; email: string; name: string; }