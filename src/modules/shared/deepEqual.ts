const deepEqual = (a: any, b: any) => {
  if (a === b || typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
};

export default deepEqual;
