export function base64UrlDecode(encoded: string) {
  // restore padding if missing
  const padLength = (4 - (encoded.length % 4)) % 4;
  const padded = encoded + '='.repeat(padLength);

  // replace URL-safe chars back to standard Base64
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');

  return atob(base64);
}
