import path from 'node:path';
import dotenv from 'dotenv';

let isLoaded = false;

export function ensureServerEnv() {
  if (isLoaded) {
    return;
  }

  dotenv.config({ path: path.join(process.cwd(), '.env.local') });
  dotenv.config({ path: path.join(process.cwd(), '.env.project-passwords.local'), override: true });
  isLoaded = true;
}

ensureServerEnv();
