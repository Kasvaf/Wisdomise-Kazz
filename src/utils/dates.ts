export const convertDate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export function ensureZ(date?: string) {
  if (!date) return '';
  return date.endsWith('Z') || /\+\d+$/.test(date) ? date : date + 'Z';
}
