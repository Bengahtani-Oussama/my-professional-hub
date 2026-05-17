import { Router } from "express";
import Settings from "../models/Settings.js";
import Visit from "../models/Visit.js";
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
    // Record an individual visit doc so we can chart visits over time.
    try {
      await Visit.create({
        path: _req.body?.path || _req.originalUrl || "/",
        referrer: _req.get("referer") || "",
        userAgent: _req.get("user-agent") || "",
      });
    } catch (e) {
      // Non-fatal: keep the counter even if the time-series insert fails.
      console.error("Visit log failed:", e?.message);
    }
    res.json({ visitorCount: cur.visitorCount });
  } catch (e) { next(e); }
});

/**
 * GET /api/settings/visits/stats?days=30
 * Returns a dense daily series: [{ date: "YYYY-MM-DD", visitors: n }]
 * including days with zero visits so charts render a continuous line.
 */
r.get("/visits/stats", async (req, res, next) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

    const rows = await Visit.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          visitors: { $sum: 1 },
        },
      },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.visitors]));

    const series = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      series.push({ date: key, visitors: map.get(key) || 0 });
    }
    res.json({ days, series });
  } catch (e) { next(e); }
});

export default r;