export function timeAgo(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return '0s';

  const units = [
    { label: 'Y', ms: 365.25 * 24 * 60 * 60 * 1000 },
    { label: 'M', ms: 30.44 * 24 * 60 * 60 * 1000 },
    { label: 'D', ms: 24 * 60 * 60 * 1000 },
    { label: 'h', ms: 60 * 60 * 1000 },
    { label: 'm', ms: 60 * 1000 },
    { label: 's', ms: 1000 },
  ];

  for (let i = 0; i < units.length; i++) {
    const value = Math.floor(diffMs / units[i].ms);

    if (value >= 1) {
      const remaining = diffMs % units[i].ms;
      const result = `${value}${units[i].label}`;

      // Try to add a second unit for more precision
      for (let j = i + 1; j < units.length; j++) {
        const nextValue = Math.floor(remaining / units[j].ms);
        if (nextValue >= 1) {
          return `${result} ${nextValue}${units[j].label}`;
        }
      }

      return result;
    }
  }

  return '0s';
}
