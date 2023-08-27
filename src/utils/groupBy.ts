export default function groupBy<T>(items: T[], getKey: (x: T) => string) {
  const result: Record<string, T[]> = {};
  for (const item of items) {
    const key = getKey(item);
    if (result[key]) result[key].push(item);
    else result[key] = [item];
  }
  return result;
}
