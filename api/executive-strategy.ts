import b2wExecutiveStrategyHandler from './_lib/b2wExecutiveStrategyHandler.js';
import jasonAiExecutiveStrategyHandler from './_lib/jasonAiExecutiveStrategyHandler.js';
import { sendJson } from './_lib/http.js';

export default async function handler(req: any, res: any) {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const scope = String(url.searchParams.get('scope') ?? '').trim().toLowerCase();

  if (scope === 'b2w') {
    await b2wExecutiveStrategyHandler(req, res);
    return;
  }

  if (scope === 'jasonai') {
    await jasonAiExecutiveStrategyHandler(req, res);
    return;
  }

  sendJson(res, 400, { ok: false, error: 'Unsupported executive strategy scope.' });
}
