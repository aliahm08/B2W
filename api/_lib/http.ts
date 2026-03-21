export function sendJson(res: any, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export async function readJsonBody<T>(req: any, maxBytes = 512_000): Promise<T> {
  if (req.body && typeof req.body === 'object') {
    return req.body as T;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;

    if (totalBytes > maxBytes) {
      throw new Error(`Request body too large. Max ${maxBytes} bytes.`);
    }

    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();

  if (!raw) {
    return {} as T;
  }

  return JSON.parse(raw) as T;
}

export function allowMethods(req: any, res: any, methods: string[]): boolean {
  if (methods.includes(req.method)) {
    return true;
  }

  res.setHeader('Allow', methods.join(', '));
  sendJson(res, 405, { error: `Method ${req.method} not allowed.` });
  return false;
}
