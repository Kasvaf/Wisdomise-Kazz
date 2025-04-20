type IdFn<T, K> = (item: T) => K;

export const uniqueBy = <T, K>(array: T[], idFn: IdFn<T, K>): T[] => {
  const seen = new Set<K>();
  return array.filter(item => {
    const id = idFn(item);
    if (seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
};
