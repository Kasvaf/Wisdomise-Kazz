import { useMemo, useState } from 'react';
import type { Mark } from '../../../../../public/charting_library';

export const useMigrationMark = () => {
  const [migratedAt, setMigratedAt] = useState<number>();

  const mark = useMemo(() => {
    if (migratedAt) {
      return {
        id: 'migration_mark',
        label: 'M',
        labelFontColor: 'white',
        minSize: 25,
        time: migratedAt,
        text: 'Migrated',
        color: 'blue',
      } as Mark;
    } else return undefined;
  }, [migratedAt]);

  return { setMigratedAt, mark };
};
