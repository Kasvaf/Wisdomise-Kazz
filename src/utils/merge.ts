export function deepMerge<T>(defaults: T, value?: Partial<T>): T {
  if (!value) return defaults;

  return {
    ...defaults,
    ...value,
    ...Object.keys(defaults as any).reduce<Partial<T>>((acc, key) => {
      const k = key as keyof T;
      if (
        typeof defaults[k] === 'object' &&
        defaults[k] !== null &&
        !Array.isArray(defaults[k])
      ) {
        acc[k] = deepMerge(defaults[k], (value as any)?.[k] ?? {}) as any;
      }
      return acc;
    }, {}),
  };
}
