import { kv } from '@vercel/kv';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;

type RateLimitOptions = {
  windowMs?: number;
  maxRequests?: number;
};

export function getClientIp(req: any): string {
  const forwarded = String(req.headers['x-forwarded-for'] ?? '').split(',')[0]?.trim();
  const realIp = String(req.headers['x-real-ip'] ?? '').trim();
  const socketIp = String(req.socket?.remoteAddress ?? '').trim();
  return forwarded || realIp || socketIp || 'unknown';
}

function hasKvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const now = Date.now();
  const windowMs = options.windowMs ?? WINDOW_MS;
  const maxRequests = options.maxRequests ?? MAX_REQUESTS;

  if (hasKvConfigured()) {
    try {
      const kvKey = `ratelimit:${key}`;
      const count = await kv.incr(kvKey);
      
      if (count === 1) {
        await kv.pexpire(kvKey, windowMs);
      } else {
        const ttl = await kv.pttl(kvKey);
        if (ttl === -1) {
          await kv.pexpire(kvKey, windowMs);
        }
      }

      if (count > maxRequests) {
        const ttl = await kv.pttl(kvKey);
        const retryAfterSeconds = Math.max(1, Math.ceil((ttl > 0 ? ttl : windowMs) / 1000));
        return { ok: false, retryAfterSeconds };
      }

      return { ok: true };
    } catch (error) {
      console.warn('[ratelimit] KV rate limit failed, falling back to memory', error);
      // Fall through to memory bucket
    }
  }

  // Fallback to memory map
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= maxRequests) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true };
}
