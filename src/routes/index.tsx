import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { ExperienceSection } from "@/components/landing/ExperienceSection";
import { ProjectsSection } from "@/components/landing/ProjectsSection";
import { SkillsSection } from "@/components/landing/SkillsSection";
import { EducationSection } from "@/components/landing/EducationSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import {
  experienceApi, projectsApi, skillsApi, educationApi, settingsApi,
} from "@/lib/api";
import type {
  Experience, Project, Skill, Education, Settings,
} from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Full-Stack Developer" },
      { name: "description", content: "Personal portfolio of a full-stack engineer crafting modern web products." },
      { property: "og:title", content: "Portfolio — Full-Stack Developer" },
      { property: "og:description", content: "Personal portfolio of a full-stack engineer crafting modern web products." },
    ],
  }),
  component: Index,
});

function Index() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    Promise.all([
      experienceApi.list(),
      projectsApi.list(),
      skillsApi.list(),
      educationApi.list(),
      settingsApi.get(),
    ]).then(([e, p, s, ed, st]) => {
      setExperience(e);
      setProjects(p);
      setSkills(s);
      setEducation(ed);
      setSettings(st);
    });
    // increment visitor on first mount per session
    if (typeof window !== "undefined" && !sessionStorage.getItem("visited")) {
      sessionStorage.setItem("visited", "1");
      settingsApi.incrementVisitor().then((r) =>
        setSettings((cur) => (cur ? { ...cur, visitorCount: r.visitorCount } : cur)),
      );
    }
  }, []);

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <ExperienceSection items={experience} />
        <ProjectsSection items={projects} />
        <SkillsSection items={skills} />
        <EducationSection items={education} />
        <ContactSection settings={settings} />
      </main>
      <Footer visitors={settings.visitorCount} />
    </div>
  );
}
