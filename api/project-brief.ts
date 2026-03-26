import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { generateProjectBrief } from './_lib/projectBrief.js';
import {
  homeTestCapabilityLookup,
  homeTestExpertiseLookup,
  homeTestProjectAreaLookup,
  type HomeTestCapabilityId,
  type HomeTestExpertiseId,
  type HomeTestProjectAreaId,
} from '../src/content/homeTestTwo';
import type { ProjectBriefRequestPayload } from '../src/lib/projectBrief';

type ProjectBriefBody = Partial<ProjectBriefRequestPayload>;

function dedupe<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function isCapabilityId(value: string): value is HomeTestCapabilityId {
  return value in homeTestCapabilityLookup;
}

function isExpertiseId(value: string): value is HomeTestExpertiseId {
  return value in homeTestExpertiseLookup;
}

function isProjectAreaId(value: string): value is HomeTestProjectAreaId {
  return value in homeTestProjectAreaLookup;
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody<ProjectBriefBody>(req);
    const businessName = String(body.businessName ?? '').trim();
    const website = String(body.website ?? '').trim();
    const arr = String(body.arr ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const capabilityIds = dedupe(
      (Array.isArray(body.capabilityIds) ? body.capabilityIds : [])
        .map((value) => String(value ?? '').trim())
        .filter(isCapabilityId),
    );
    const expertiseIds = dedupe(
      (Array.isArray(body.expertiseIds) ? body.expertiseIds : [])
        .map((value) => String(value ?? '').trim())
        .filter(isExpertiseId),
    );
    const projectAreaId = String(body.projectAreaId ?? '').trim();

    if (!businessName || !website || !arr || !email) {
      sendJson(res, 400, { error: 'Business name, website, ARR, and email are required.' });
      return;
    }

    if (capabilityIds.length === 0) {
      sendJson(res, 400, { error: 'Select at least one capability input.' });
      return;
    }

    if (expertiseIds.length === 0) {
      sendJson(res, 400, { error: 'Select at least one expertise track.' });
      return;
    }

    if (!isProjectAreaId(projectAreaId)) {
      sendJson(res, 400, { error: 'Select a valid project area.' });
      return;
    }

    const result = await generateProjectBrief({
      businessName,
      website,
      arr,
      email,
      capabilityIds,
      expertiseIds,
      projectAreaId,
    });

    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unable to generate the project brief.',
    });
  }
}
