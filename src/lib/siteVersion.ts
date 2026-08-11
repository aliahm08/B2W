export function usesV3Branding(pathname: string) {
  const isV1 = pathname === '/v1' || pathname.startsWith('/v1/');
  const isV2 = pathname === '/v2' || pathname.startsWith('/v2/');

  return !isV1 && !isV2;
}
