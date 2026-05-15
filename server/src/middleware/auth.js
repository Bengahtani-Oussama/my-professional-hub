import jwt from "jsonwebtoken";

export function requireAuth(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(Object.assign(new Error("Invalid token"), { status: 401 }));
  }
}