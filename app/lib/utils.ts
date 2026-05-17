const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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
  // Relative path from backend — prefix with API base
  if (API_BASE) return `${API_BASE}${url}`;
  return url;
}
