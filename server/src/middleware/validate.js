export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(Object.assign(new Error(result.error.issues[0]?.message || "Invalid input"), { status: 400 }));
  }
  req.body = result.data;
  next();
};