import { useMemo, useState } from 'react';

export const useMigrationMark = () => {
  const [_migratedAt, setMigratedAt] = useState<number>();

  const mark = useMemo(() => {
    return undefined;
  }, []);

  // const mark = useMemo(() => {
  //   if (migratedAt) {
  //     return {
  //       id: 'migration_mark',
  //       label: 'M',
  //       labelFontColor: 'white',
  //       minSize: 25,
  //       time: migratedAt,
  //       text: 'Migrated',
  //       color: 'blue',
  //     } as Mark;
  //   } else return undefined;
  // }, [migratedAt]);

  return { setMigratedAt, mark };
};
