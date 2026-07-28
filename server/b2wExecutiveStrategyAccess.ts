import { timingSafeEqual } from 'node:crypto';

export const DEFAULT_EXECUTIVE_STRATEGY_PASSWORD = 'B2W-AI-2026';

export function getB2WExecutiveStrategyPassword() {
  return String(
    process.env.B2W_EXECUTIVE_STRATEGY_PASSWORD ?? DEFAULT_EXECUTIVE_STRATEGY_PASSWORD,
  ).trim();
}

export function isB2WExecutiveStrategyPasswordValid(candidate: string) {
  const expected = getB2WExecutiveStrategyPassword();
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return (
    candidateBuffer.length === expectedBuffer.length
    && timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}
