import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Settings from "./models/Settings.js";

const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const name = process.env.ADMIN_NAME || "Admin";

await connectDB(process.env.MONGODB_URI);

const existing = await User.findOne({ email });
if (existing) {
  console.log(`Admin already exists: ${email}`);
} else {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, name });
  console.log(`Admin created: ${email} / ${password}`);
}

const s = await Settings.findOne({ _singleton: "settings" });
if (!s) { await Settings.create({ _singleton: "settings" }); console.log("Settings initialized"); }

process.exit(0);