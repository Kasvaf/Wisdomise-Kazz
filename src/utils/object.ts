export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toCamelCaseObject<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseObject) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      result[camelKey] = toCamelCaseObject(value);
    }
    return result as T;
  }

  return obj;
}
