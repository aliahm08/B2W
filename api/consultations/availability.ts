import { getAvailability, isGoogleBookingConfigured } from '../_lib/google';
import { allowMethods, sendJson } from '../_lib/http';
import { config } from '../_lib/config';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET'])) {
    return;
  }

  try {
    if (!isGoogleBookingConfigured()) {
      sendJson(res, 200, {
        configured: false,
        timezone: config.google.timezone,
        slots: [],
      });
      return;
    }

    const slots = await getAvailability();
    sendJson(res, 200, {
      configured: true,
      timezone: config.google.timezone,
      slots,
    });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected availability failure.',
    });
  }
}
