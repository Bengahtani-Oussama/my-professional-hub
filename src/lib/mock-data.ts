import type { Experience, Project, Skill, Education, Message, Settings } from "./types";
import { emptyLocalized, emptyLocalizedArray } from "./types";

const L = (en: string, fr = en, ar = en) => ({ ...emptyLocalized(), en, fr, ar });
const LA = (en: string[], fr = en, ar = en) => ({ ...emptyLocalizedArray(), en, fr, ar });

export const mockExperience: Experience[] = [
  {
    _id: "exp1",
    title: L("Senior Full-Stack Engineer", "Ingénieur Full-Stack Senior", "مهندس Full-Stack أول"),
    description: L(
      "Leading frontend architecture and design system at a fast-growing SaaS.",
      "Direction de l'architecture frontend et du design system d'un SaaS en croissance.",
      "قيادة هندسة الواجهة وتصميم النظام في شركة SaaS سريعة النمو.",
    ),
    imageUrl: "",
    tags: ["React", "TypeScript", "Node.js"],
    images: [],
    overview: L("Building modern web platforms with millions of users."),
    responsibilities: LA(["Lead frontend architecture", "Mentor 4 engineers", "Design API contracts"]),
    challenges: LA(["Scaling realtime features", "Migrating legacy code"]),
    features: LA(["Realtime collab", "AI-assisted workflows"]),
    architecture: { title: L("Microservices on AWS"), description: L("Event-driven, k8s, GraphQL gateway.") },
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
    skills: ["Architecture", "Mentoring"],
    repoUrl: "",
    liveUrl: "",
    featured: true,
    current: true,
    startDate: "2023-01",
  },
  {
    _id: "exp2",
    title: L("Frontend Engineer", "Développeur Frontend", "مطوّر واجهات"),
    description: L("Built interactive dashboards and data visualizations."),
    imageUrl: "",
    tags: ["Vue", "D3"],
    images: [],
    overview: L(""),
    responsibilities: LA(["Built analytics dashboards"]),
    challenges: LA([]),
    features: LA([]),
    architecture: { title: L(""), description: L("") },
    stack: ["Vue", "TypeScript"],
    skills: [],
    featured: false,
    startDate: "2021-03",
    endDate: "2022-12",
  },
];

export const mockProjects: Project[] = [
  {
    _id: "p1",
    title: L("Realtime Analytics Platform", "Plateforme analytique en temps réel", "منصة تحليلات لحظية"),
    description: L(
      "Self-serve analytics with sub-second queries on billions of rows.",
      "Analyse en libre-service avec des requêtes sous la seconde sur des milliards de lignes.",
      "تحليلات ذاتية الخدمة باستجابة دون الثانية لمليارات السجلات.",
    ),
    imageUrl: "",
    tags: ["React", "ClickHouse", "WebSockets"],
    images: [],
    overview: L(""),
    responsibilities: LA([]),
    challenges: LA([]),
    features: LA(["Live dashboards", "Custom SQL editor"]),
    architecture: { title: L(""), description: L("") },
    stack: ["React", "TypeScript", "Node.js"],
    skills: [],
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    _id: "p2",
    title: L("E-commerce Storefront", "Boutique e-commerce", "متجر إلكتروني"),
    description: L("Headless commerce with edge-rendered pages and instant search."),
    imageUrl: "",
    tags: ["Next.js", "Stripe", "Algolia"],
    images: [],
    overview: L(""),
    responsibilities: LA([]),
    challenges: LA([]),
    features: LA([]),
    architecture: { title: L(""), description: L("") },
    stack: ["Next.js", "Stripe"],
    skills: [],
    featured: true,
  },
  {
    _id: "p3",
    title: L("AI Copilot for Designers", "Copilote IA pour designers", "مساعد ذكي للمصممين"),
    description: L("AI-assisted design tooling that integrates with Figma."),
    imageUrl: "",
    tags: ["Python", "OpenAI", "Figma"],
    images: [],
    overview: L(""),
    responsibilities: LA([]),
    challenges: LA([]),
    features: LA([]),
    architecture: { title: L(""), description: L("") },
    stack: ["Python", "FastAPI"],
    skills: [],
    featured: true,
  },
];

export const mockSkills: Skill[] = [
  { _id: "s1", category: L("Frontend"), categoryKey: "frontend", name: L("React / Next.js"), percentage: 95, order: 1 },
  { _id: "s2", category: L("Frontend"), categoryKey: "frontend", name: L("TypeScript"), percentage: 92, order: 2 },
  { _id: "s3", category: L("Frontend"), categoryKey: "frontend", name: L("Tailwind CSS"), percentage: 90, order: 3 },
  { _id: "s4", category: L("Backend"), categoryKey: "backend", name: L("Node.js / Express"), percentage: 90, order: 1 },
  { _id: "s5", category: L("Backend"), categoryKey: "backend", name: L("MongoDB"), percentage: 85, order: 2 },
  { _id: "s6", category: L("Backend"), categoryKey: "backend", name: L("PostgreSQL"), percentage: 80, order: 3 },
  { _id: "s7", category: L("Tools & Others"), categoryKey: "tools", name: L("Docker"), percentage: 80, order: 1 },
  { _id: "s8", category: L("Tools & Others"), categoryKey: "tools", name: L("Git / CI/CD"), percentage: 88, order: 2 },
  { _id: "s9", category: L("Tools & Others"), categoryKey: "tools", name: L("AWS / Cloudflare"), percentage: 75, order: 3 },
];

export const mockEducation: Education[] = [
  {
    _id: "ed1",
    diploma: L("M.Sc. Computer Science", "Master en Informatique", "ماجستير علوم الحاسوب"),
    institution: L("Tech University"),
    duration: L("2019 — 2021"),
    location: L("Paris, France"),
    grade: L("With Honors"),
    description: L("Focus on distributed systems and machine learning."),
    achievements: LA(["Top of class", "Research published"]),
    subjects: LA(["Distributed Systems", "ML", "Algorithms"]),
    order: 1,
  },
  {
    _id: "ed2",
    diploma: L("B.Sc. Software Engineering", "Licence en Génie Logiciel", "بكالوريوس هندسة برمجيات"),
    institution: L("State University"),
    duration: L("2015 — 2019"),
    location: L("Casablanca, Morocco"),
    grade: L("First Class"),
    description: L(""),
    achievements: LA([]),
    subjects: LA(["Algorithms", "Databases", "Web Development"]),
    order: 2,
  },
];

export const mockMessages: Message[] = [
  { _id: "m1", name: "Jane Doe", email: "jane@example.com", message: "Hi, I'd love to collaborate on a project.", status: "unread", createdAt: new Date().toISOString() },
  { _id: "m2", name: "John Smith", email: "john@example.com", message: "Are you available for freelance work?", status: "replied", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockSettings: Settings = {
  siteTitle: L("Your Name — Portfolio"),
  siteLogo: "",
  seoDescription: L("Personal portfolio of a full-stack engineer."),
  resumeUrl: "",
  profileImage: "",
  email: "hello@example.com",
  phone: "+1 555 0123",
  location: L("Remote / Worldwide"),
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  visitorCount: 1247,
};