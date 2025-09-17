const store = new Map<string, { count: number; expires: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expires <= now) {
    store.set(key, { count: 1, expires: now + windowMs });
    return { ok: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetIn: entry.expires - now };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, resetIn: entry.expires - now };
}
