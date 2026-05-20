import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import experienceRoutes from "./routes/experience.js";
import projectsRoutes from "./routes/projects.js";
import skillsRoutes from "./routes/skills.js";
import educationRoutes from "./routes/education.js";
import messagesRoutes from "./routes/messages.js";
import settingsRoutes from "./routes/settings.js";

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// CORS
const allowedOrigins = ['http://localhost:3000','https://bengahtani-oussama.vercel.app/','https://porfolio-gray-zeta.vercel.app/'];
app.use(cors({
  origin: allowedOrigins
}));

// Rate limit (auth + write-heavy endpoints)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api/", limiter);

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/settings", settingsRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
});