export function hasAnyValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value !== 'object') return true;

  if (Array.isArray(value)) {
    return value.some(item => hasAnyValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some(v => hasAnyValue(v));
  }

  return false;
}
