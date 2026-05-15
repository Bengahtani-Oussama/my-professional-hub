import { Router } from "express";
import { z } from "zod";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import rateLimit from "express-rate-limit";

const r = Router();
const sendLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

const sendSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
});

r.get("/", requireAuth, async (_req, res, next) => {
  try { res.json(await Message.find().sort({ createdAt: -1 }).lean()); } catch (e) { next(e); }
});

r.post("/", sendLimiter, validate(sendSchema), async (req, res, next) => {
  try { res.status(201).json(await Message.create(req.body)); } catch (e) { next(e); }
});

r.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const doc = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) { next(e); }
});

r.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const doc = await Message.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;