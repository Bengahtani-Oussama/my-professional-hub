/**
 * REST API client for the external Express + MongoDB backend.
 *
 * Set VITE_API_BASE_URL to point at your API (e.g. https://api.yourdomain.com).
 * When unset (or when a request fails), the app falls back to mock data so the
 * UI is fully usable during development.
 */
import type {
  Experience, Project, Skill, Education, Message, Settings, AuthUser,
} from "./types";
import {
  mockExperience, mockProjects, mockSkills, mockEducation, mockMessages, mockSettings,
} from "./mock-data";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "portfolio_token";

export const api = {
  hasBackend: () => Boolean(BASE_URL),
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  setToken: (t: string | null) => {
    if (typeof window === "undefined") return;
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  },
};

/* --------------------------- Typed API errors -------------------------- */

export type FieldErrors = Record<string, string>;

/**
 * Normalised error thrown by every request. `.message` is always a
 * human-friendly sentence safe to show in a toast or alert. `.fieldErrors`
 * is populated when the backend returned per-field validation errors
 * (zod / mongoose style), keyed by field path.
 */
export class ApiError extends Error {
  status: number;
  fieldErrors: FieldErrors;
  isNetwork: boolean;
  raw?: unknown;
  constructor(opts: {
    message: string;
    status?: number;
    fieldErrors?: FieldErrors;
    isNetwork?: boolean;
    raw?: unknown;
  }) {
    super(opts.message);
    this.name = "ApiError";
    this.status = opts.status ?? 0;
    this.fieldErrors = opts.fieldErrors ?? {};
    this.isNetwork = Boolean(opts.isNetwork);
    this.raw = opts.raw;
  }
}

function friendlyFor(status: number, fallback?: string): string {
  switch (status) {
    case 400: return fallback || "Some fields are invalid. Please review and try again.";
    case 401: return "Your session has expired. Please sign in again.";
    case 403: return "You don't have permission to do that.";
    case 404: return "We couldn't find what you were looking for.";
    case 409: return fallback || "That conflicts with existing data.";
    case 413: return "The file is too large. Please upload a smaller one.";
    case 422: return fallback || "Some fields are invalid. Please review and try again.";
    case 429: return "Too many requests. Please slow down and try again in a moment.";
    case 500: case 502: case 503: case 504:
      return "Our server is having trouble right now. Please try again shortly.";
    default: return fallback || "Something went wrong. Please try again.";
  }
}

function extractFieldErrors(body: unknown): FieldErrors {
  if (!body || typeof body !== "object") return {};
  const out: FieldErrors = {};
  const b = body as Record<string, unknown>;
  // { errors: [{ path: ["email"], message: "..." }, ...] }  — zod-style
  if (Array.isArray(b.errors)) {
    for (const e of b.errors as Array<Record<string, unknown>>) {
      const path = Array.isArray(e.path) ? (e.path as Array<string | number>).join(".") : (e.path as string | undefined) ?? (e.field as string | undefined);
      const msg = (e.message as string | undefined) ?? "Invalid value";
      if (path && !out[path]) out[path] = msg;
    }
  }
  // { errors: { email: "...", name: "..." } }
  if (b.errors && !Array.isArray(b.errors) && typeof b.errors === "object") {
    for (const [k, v] of Object.entries(b.errors as Record<string, unknown>)) {
      if (typeof v === "string") out[k] = v;
      else if (v && typeof v === "object" && "message" in (v as object)) {
        out[k] = String((v as { message: unknown }).message);
      }
    }
  }
  return out;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = api.getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch (e) {
    throw new ApiError({
      message: "Couldn't reach the server. Check your internet connection and try again.",
      isNetwork: true,
      raw: e,
    });
  }
  if (!res.ok) {
    let body: unknown = null;
    let serverMsg: string | undefined;
    const text = await res.text();
    if (text) {
      try {
        body = JSON.parse(text);
        const b = body as Record<string, unknown>;
        serverMsg = (b.message as string | undefined) ?? (b.error as string | undefined);
      } catch {
        serverMsg = text;
      }
    }
    if (res.status === 401) api.setToken(null);
    throw new ApiError({
      status: res.status,
      message: friendlyFor(res.status, serverMsg),
      fieldErrors: extractFieldErrors(body),
      raw: body ?? text,
    });
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* ----------------------------- Mock helpers ----------------------------- */

const STORAGE_KEYS = {
  experience: "mock_experience",
  projects: "mock_projects",
  skills: "mock_skills",
  education: "mock_education",
  messages: "mock_messages",
  settings: "mock_settings",
  auth: "mock_auth_user",
};

function getMock<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (!v) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}
function setMock<T>(key: string, value: T): T {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
  return value;
}

const id = () => Math.random().toString(36).slice(2, 11);

/* --------------------------------- Auth -------------------------------- */

export const authApi = {
  async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    if (api.hasBackend()) {
      const res = await request<{ user: AuthUser; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      api.setToken(res.token);
      return res;
    }
    // Mock: any email + password "admin"
    if (password !== "admin") throw new Error("Invalid credentials");
    const user: AuthUser = { id: "mock-admin", email, name: "Admin" };
    api.setToken("mock-token");
    if (typeof window !== "undefined")
      localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(user));
    return { user, token: "mock-token" };
  },
  async me(): Promise<AuthUser | null> {
    if (!api.getToken()) return null;
    if (api.hasBackend()) {
      try { return await request<AuthUser>("/api/auth/me"); }
      catch { api.setToken(null); return null; }
    }
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(STORAGE_KEYS.auth);
    return v ? (JSON.parse(v) as AuthUser) : null;
  },
  logout() {
    api.setToken(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEYS.auth);
  },
};

/* --------------------------- Generic CRUD factory ---------------------- */

function crud<T extends { _id: string }>(path: string, key: string, seed: T[]) {
  return {
    async list(): Promise<T[]> {
      if (api.hasBackend()) {
        try { return await request<T[]>(path); }
        catch { return getMock(key, seed); }
      }
      return getMock(key, seed);
    },
    async create(data: Omit<T, "_id">): Promise<T> {
      if (api.hasBackend()) {
        return request<T>(path, { method: "POST", body: JSON.stringify(data) });
      }
      const created = { ...(data as object), _id: id() } as T;
      const list = getMock(key, seed);
      return setMock(key, [created, ...list])[0];
    },
    async update(_id: string, data: Partial<T>): Promise<T> {
      if (api.hasBackend()) {
        return request<T>(`${path}/${_id}`, { method: "PUT", body: JSON.stringify(data) });
      }
      const list = getMock(key, seed).map((x) => (x._id === _id ? { ...x, ...data } : x));
      setMock(key, list);
      return list.find((x) => x._id === _id) as T;
    },
    async remove(_id: string): Promise<void> {
      if (api.hasBackend()) {
        await request(`${path}/${_id}`, { method: "DELETE" });
        return;
      }
      setMock(key, getMock(key, seed).filter((x) => x._id !== _id));
    },
  };
}

export const experienceApi = crud<Experience>("/api/experience", STORAGE_KEYS.experience, mockExperience);
export const projectsApi = crud<Project>("/api/projects", STORAGE_KEYS.projects, mockProjects);
export const skillsApi = crud<Skill>("/api/skills", STORAGE_KEYS.skills, mockSkills);
export const educationApi = crud<Education>("/api/education", STORAGE_KEYS.education, mockEducation);

/* --------------------------------- Messages ---------------------------- */

export const messagesApi = {
  async list(): Promise<Message[]> {
    if (api.hasBackend()) {
      try { return await request<Message[]>("/api/messages"); }
      catch { return getMock(STORAGE_KEYS.messages, mockMessages); }
    }
    return getMock(STORAGE_KEYS.messages, mockMessages);
  },
  async send(data: { name: string; email: string; message: string }): Promise<Message> {
    if (api.hasBackend()) {
      return request<Message>("/api/messages", { method: "POST", body: JSON.stringify(data) });
    }
    const msg: Message = {
      _id: id(),
      ...data,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    const list = getMock(STORAGE_KEYS.messages, mockMessages);
    setMock(STORAGE_KEYS.messages, [msg, ...list]);
    return msg;
  },
  async setStatus(_id: string, status: Message["status"]): Promise<Message> {
    if (api.hasBackend()) {
      return request<Message>(`/api/messages/${_id}`, {
        method: "PUT", body: JSON.stringify({ status }),
      });
    }
    const list = getMock(STORAGE_KEYS.messages, mockMessages).map((x) =>
      x._id === _id ? { ...x, status } : x);
    setMock(STORAGE_KEYS.messages, list);
    return list.find((x) => x._id === _id) as Message;
  },
  async remove(_id: string): Promise<void> {
    if (api.hasBackend()) {
      await request(`/api/messages/${_id}`, { method: "DELETE" });
      return;
    }
    setMock(STORAGE_KEYS.messages, getMock(STORAGE_KEYS.messages, mockMessages).filter((x) => x._id !== _id));
  },
};

/* --------------------------------- Settings ---------------------------- */

export const settingsApi = {
  async get(): Promise<Settings> {
    if (api.hasBackend()) {
      try { return await request<Settings>("/api/settings"); }
      catch { return getMock(STORAGE_KEYS.settings, mockSettings); }
    }
    return getMock(STORAGE_KEYS.settings, mockSettings);
  },
  async update(data: Partial<Settings>): Promise<Settings> {
    if (api.hasBackend()) {
      return request<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(data) });
    }
    const next = { ...getMock(STORAGE_KEYS.settings, mockSettings), ...data } as Settings;
    return setMock(STORAGE_KEYS.settings, next);
  },
  async incrementVisitor(): Promise<{ visitorCount: number }> {
    if (api.hasBackend()) {
      try {
        return await request<{ visitorCount: number }>("/api/settings/visit", { method: "POST" });
      } catch { /* fall through */ }
    }
    const cur = getMock(STORAGE_KEYS.settings, mockSettings);
    const next = { ...cur, visitorCount: (cur.visitorCount ?? 0) + 1 };
    setMock(STORAGE_KEYS.settings, next);
    return { visitorCount: next.visitorCount };
  },
};