import { useMemo } from 'react';

const rounder = (val: number) => {
  if (val < 10) {
    return val
      .toFixed(val > -1 && val < 1 ? 18 : 2)
      .replace(/(\.0*\d{2})\d*/, '$1')
      .replaceAll(/\.?0+$/g, '');
  } else if (val < 100) {
    return Math.round(val);
  } else {
    return Math.round(val / 10) * 10;
  }
};

const useSensibleSteps = (balance?: number | null) => {
  return useMemo(() => {
    if (!balance) return [];
    return [0.1, 0.25, 0.5, 0.75, 1].map(p => {
      const value = String(p === 1 ? balance : rounder(p * balance));
      return {
        value,
        label: p === 1 ? 'MAX' : String(value),
      };
    });
  }, [balance]);
};

export default useSensibleSteps;
