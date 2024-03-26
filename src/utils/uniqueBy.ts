export default function uniqueBy<T>(items: T[], getKey: (x: T) => string) {
  const seen: Record<string, boolean> = {};
  return items.filter(x => {
    const key = getKey(x);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}
