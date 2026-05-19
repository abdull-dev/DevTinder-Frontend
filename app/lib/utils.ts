/**
 * Check if an image URL is a local/relative upload that can't be optimized by Next.js
 */
export function isLocalUpload(url: string): boolean {
  if (!url) return false;
  return url.includes("/uploads/") || url.startsWith("data:");
}

/**
 * Resolves a photo URL from the backend.
 * - Full URLs (https://...) are returned as-is
 * - Relative paths like `/uploads/abc.jpg` are prefixed with the API base URL
 * - Empty/undefined returns the default placeholder
 */
export function resolvePhotoUrl(url: string | undefined): string {
  if (!url) return "https://via.placeholder.com/150";
  // Already a full URL
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  // Relative path from backend — prefix with API base (read at call time, not module load)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  if (base) return `${base}${url}`;
  return url;
}
