// src/utils/urlHelpers.js
// Pure helper functions for URL formatting. No React imports allowed here.

/**
 * Ensures a URL string has an http/https protocol prefix.
 * Falls back to https:// when the user typed a bare domain.
 */
export const ensureHttpProtocol = (url) => {
  if (!url || typeof url !== 'string') return url;
  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
};
