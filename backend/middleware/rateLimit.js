const buckets = new Map();

// Limiteur en mémoire par adresse IP : suffisant pour freiner les essais répétés sur une route publique.
export const rateLimit = ({ windowMs = 10 * 60 * 1000, max = 30, message = "Trop de tentatives. Réessayez dans quelques minutes." } = {}) => (req, res, next) => {
  const key = `${req.baseUrl}${req.path}:${req.ip}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return next();
  }

  entry.count += 1;
  if (entry.count > max) {
    res.set("Retry-After", String(Math.ceil((entry.reset - now) / 1000)));
    return res.status(429).json({ message });
  }
  next();
};

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) if (entry.reset <= now) buckets.delete(key);
}, 5 * 60 * 1000).unref();
