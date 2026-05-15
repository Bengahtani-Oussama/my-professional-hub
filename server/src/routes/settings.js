import { Router } from "express";
import Settings from "../models/Settings.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

async function getOrCreate() {
  let s = await Settings.findOne({ _singleton: "settings" });
  if (!s) s = await Settings.create({ _singleton: "settings" });
  return s;
}

r.get("/", async (_req, res, next) => {
  try { res.json(await getOrCreate()); } catch (e) { next(e); }
});

r.put("/", requireAuth, async (req, res, next) => {
  try {
    const cur = await getOrCreate();
    const { _id, _singleton, ...patch } = req.body || {};
    cur.set(patch);
    await cur.save();
    res.json(cur);
  } catch (e) { next(e); }
});

r.post("/visit", async (_req, res, next) => {
  try {
    const cur = await getOrCreate();
    cur.visitorCount = (cur.visitorCount || 0) + 1;
    await cur.save();
    res.json({ visitorCount: cur.visitorCount });
  } catch (e) { next(e); }
});

export default r;