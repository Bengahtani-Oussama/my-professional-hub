import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export function crudRouter(Model, { listSort } = {}) {
  const r = Router();
  r.get("/", async (_req, res, next) => {
    try {
      const q = Model.find();
      if (listSort) q.sort(listSort);
      const docs = await q.lean();
      res.json(docs);
    } catch (e) { next(e); }
  });
  r.get("/:id", async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    } catch (e) { next(e); }
  });
  r.post("/", requireAuth, async (req, res, next) => {
    try { res.status(201).json(await Model.create(req.body)); } catch (e) { next(e); }
  });
  r.put("/:id", requireAuth, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    } catch (e) { next(e); }
  });
  r.delete("/:id", requireAuth, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });
  return r;
}