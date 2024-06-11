export function ensureZ(date?: string | null) {
  if (!date) return '';
  return date.endsWith('Z') || /\+\d+$/.test(date) ? date : date + 'Z';
}
