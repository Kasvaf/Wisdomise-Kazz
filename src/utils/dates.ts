export function ensureZ(date?: string) {
  if (!date) return '';
  return date.endsWith('Z') || /\+\d+$/.test(date) ? date : date + 'Z';
}
