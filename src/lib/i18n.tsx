import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Locale, LocalizedString, LocalizedArray } from "./types";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.projects": "Projects",
  "nav.skills": "Skills",
  "nav.education": "Education",
  "nav.contact": "Contact",
  "nav.admin": "Admin",
  "nav.downloadCV": "Download CV",
  "hero.greeting": "Hi, I'm",
  "hero.role": "Full-Stack Developer & Software Engineer",
  "hero.subtitle":
    "I craft polished, performant digital products with modern web technologies.",
  "hero.cta": "View my work",
  "hero.cta2": "Get in touch",
  "section.about": "About me",
  "section.experience": "Experience",
  "section.projects": "Featured Projects",
  "section.skills": "Skills & Technologies",
  "section.education": "Education",
  "section.contact": "Get in touch",
  "skills.frontend": "Frontend",
  "skills.backend": "Backend",
  "skills.tools": "Tools & Others",
  "contact.name": "Your name",
  "contact.email": "Your email",
  "contact.message": "Your message",
  "contact.send": "Send message",
  "contact.success": "Message sent — thanks for reaching out!",
  "contact.error": "Something went wrong. Please try again.",
  "footer.rights": "All rights reserved",
  "footer.visitors": "Visitors",
  "admin.dashboard": "Dashboard",
  "admin.experience": "Experience",
  "admin.projects": "Projects",
  "admin.skills": "Skills",
  "admin.education": "Education",
  "admin.messages": "Messages",
  "admin.settings": "Settings",
  "admin.logout": "Log out",
  "admin.welcome": "Welcome back",
  "admin.totalExperience": "Total Experience",
  "admin.currentWork": "Current Work",
  "admin.totalProjects": "Featured Projects",
  "admin.totalMessages": "Messages",
  "admin.years": "years",
  "admin.create": "Create",
  "admin.edit": "Edit",
  "admin.delete": "Delete",
  "admin.save": "Save",
  "admin.cancel": "Cancel",
  "admin.confirmDelete": "Are you sure you want to delete this?",
  "login.title": "Admin sign in",
  "login.email": "Email",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.failed": "Invalid credentials",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.about": "À propos",
  "nav.experience": "Expérience",
  "nav.projects": "Projets",
  "nav.skills": "Compétences",
  "nav.education": "Formation",
  "nav.contact": "Contact",
  "nav.admin": "Admin",
  "nav.downloadCV": "Télécharger CV",
  "hero.greeting": "Salut, je suis",
  "hero.role": "Développeur Full-Stack & Ingénieur Logiciel",
  "hero.subtitle":
    "Je crée des produits numériques élégants et performants avec des technologies web modernes.",
  "hero.cta": "Voir mes projets",
  "hero.cta2": "Me contacter",
  "section.about": "À propos de moi",
  "section.experience": "Expérience",
  "section.projects": "Projets phares",
  "section.skills": "Compétences & Technologies",
  "section.education": "Formation",
  "section.contact": "Restons en contact",
  "skills.frontend": "Frontend",
  "skills.backend": "Backend",
  "skills.tools": "Outils & Autres",
  "contact.name": "Votre nom",
  "contact.email": "Votre email",
  "contact.message": "Votre message",
  "contact.send": "Envoyer",
  "contact.success": "Message envoyé — merci !",
  "contact.error": "Une erreur est survenue. Réessayez.",
  "footer.rights": "Tous droits réservés",
  "footer.visitors": "Visiteurs",
  "admin.dashboard": "Tableau de bord",
  "admin.experience": "Expérience",
  "admin.projects": "Projets",
  "admin.skills": "Compétences",
  "admin.education": "Formation",
  "admin.messages": "Messages",
  "admin.settings": "Paramètres",
  "admin.logout": "Déconnexion",
  "admin.welcome": "Bon retour",
  "admin.totalExperience": "Expérience totale",
  "admin.currentWork": "Poste actuel",
  "admin.totalProjects": "Projets phares",
  "admin.totalMessages": "Messages",
  "admin.years": "ans",
  "admin.create": "Créer",
  "admin.edit": "Modifier",
  "admin.delete": "Supprimer",
  "admin.save": "Enregistrer",
  "admin.cancel": "Annuler",
  "admin.confirmDelete": "Confirmez-vous la suppression ?",
  "login.title": "Connexion admin",
  "login.email": "Email",
  "login.password": "Mot de passe",
  "login.submit": "Se connecter",
  "login.failed": "Identifiants invalides",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.about": "نبذة",
  "nav.experience": "الخبرة",
  "nav.projects": "المشاريع",
  "nav.skills": "المهارات",
  "nav.education": "التعليم",
  "nav.contact": "تواصل",
  "nav.admin": "الإدارة",
  "nav.downloadCV": "تنزيل السيرة",
  "hero.greeting": "مرحبًا، أنا",
  "hero.role": "مطوّر Full-Stack ومهندس برمجيات",
  "hero.subtitle":
    "أصمّم وأبني منتجات رقمية أنيقة وعالية الأداء بأحدث تقنيات الويب.",
  "hero.cta": "تصفّح أعمالي",
  "hero.cta2": "تواصل معي",
  "section.about": "نبذة عني",
  "section.experience": "الخبرة",
  "section.projects": "أبرز المشاريع",
  "section.skills": "المهارات والتقنيات",
  "section.education": "التعليم",
  "section.contact": "لنبقَ على تواصل",
  "skills.frontend": "واجهات أمامية",
  "skills.backend": "خلفيات",
  "skills.tools": "أدوات وأخرى",
  "contact.name": "اسمك",
  "contact.email": "بريدك الإلكتروني",
  "contact.message": "رسالتك",
  "contact.send": "إرسال",
  "contact.success": "تم إرسال الرسالة، شكرًا لتواصلك!",
  "contact.error": "حدث خطأ، يرجى المحاولة مجددًا.",
  "footer.rights": "جميع الحقوق محفوظة",
  "footer.visitors": "الزوار",
  "admin.dashboard": "لوحة التحكم",
  "admin.experience": "الخبرة",
  "admin.projects": "المشاريع",
  "admin.skills": "المهارات",
  "admin.education": "التعليم",
  "admin.messages": "الرسائل",
  "admin.settings": "الإعدادات",
  "admin.logout": "تسجيل الخروج",
  "admin.welcome": "مرحبًا بعودتك",
  "admin.totalExperience": "إجمالي الخبرة",
  "admin.currentWork": "العمل الحالي",
  "admin.totalProjects": "المشاريع المميزة",
  "admin.totalMessages": "الرسائل",
  "admin.years": "سنوات",
  "admin.create": "إضافة",
  "admin.edit": "تعديل",
  "admin.delete": "حذف",
  "admin.save": "حفظ",
  "admin.cancel": "إلغاء",
  "admin.confirmDelete": "هل أنت متأكد من الحذف؟",
  "login.title": "تسجيل دخول الإدارة",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.submit": "تسجيل الدخول",
  "login.failed": "بيانات غير صحيحة",
};

const dicts: Record<Locale, Dict> = {
  en, fr, ar, nl: en, it: en, es: en, tr: en,
};

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  pickLocalized: (v?: LocalizedString) => string;
  pickLocalizedArray: (v?: LocalizedArray) => string[];
}

const Ctx = createContext<I18nCtx | null>(null);

const RTL: Locale[] = ["ar"];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("locale")) as Locale | null;
    if (saved && saved in dicts) setLocaleState(saved);
  }, []);

  useEffect(() => {
    const dir = RTL.includes(locale) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("locale", l); } catch { /* noop */ }
  };

  const t = (key: string) => dicts[locale]?.[key] ?? dicts.en[key] ?? key;

  const pickLocalized = (v?: LocalizedString) => {
    if (!v) return "";
    return v[locale] || v.en || Object.values(v).find(Boolean) || "";
  };
  const pickLocalizedArray = (v?: LocalizedArray) => {
    if (!v) return [];
    return v[locale]?.length ? v[locale] : v.en?.length ? v.en : [];
  };

  return (
    <Ctx.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: RTL.includes(locale) ? "rtl" : "ltr",
        pickLocalized,
        pickLocalizedArray,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}