import { useMemo, useState } from 'react';
import type { Mark } from '../../../../../public/charting_library';

export const useMigrationMark = ({
  deviceType,
}: {
  deviceType: 'mobile' | 'tablet' | 'desktop';
}) => {
  const [migratedAt, setMigratedAt] = useState<number>();

  // Use smaller mark size on mobile for better visibility and reduced overlap
  const markSize = deviceType === 'mobile' || deviceType === 'tablet' ? 16 : 25;

  const mark = useMemo(() => {
    if (migratedAt) {
      return {
        id: 'migration_mark',
        label: 'M',
        labelFontColor: 'white',
        minSize: markSize,
        time: migratedAt,
        text: 'Migrated',
        color: 'blue',
      } as Mark;
    } else return undefined;
  }, [migratedAt, markSize]);

  return { setMigratedAt, mark };
};
