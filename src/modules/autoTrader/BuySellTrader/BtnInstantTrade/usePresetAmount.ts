import { useState } from 'react';

export function usePresetAmount() {
  const [isPercentage, setIsPercentage] = useState(true);

  return {
    buyPreset: [0.01, 0.1, 1, 10],
    sellPreset: isPercentage ? [10, 25, 50, 100] : [0.01, 0.1, 1, 10],
    setIsPercentage,
    isPercentage,
  };
}
