/**
 * Generates a canonical URL for a given path
 * Always uses https://www.thecustardscreams.com as the base
 */
export function getCanonicalUrl(pathname: string = ""): string {
  const base = "https://www.thecustardscreams.com";
  if (!pathname || pathname === "/") {
    return base;
  }
  return `${base}${pathname}`;
}
