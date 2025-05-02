import { useMemo, useState } from 'react';

type Listeners = Pick<
  JSX.IntrinsicElements['tr'],
  'onMouseEnter' | 'onMouseLeave'
>;

export const useHover = () => {
  const [value, setValue] = useState<string>();

  const listeners = useMemo<Listeners>(
    () => ({
      onMouseLeave: () => {
        setValue(undefined);
      },
      onMouseEnter: e => {
        setValue(e?.currentTarget?.getAttribute?.('data-key') ?? undefined);
      },
    }),
    [],
  );

  return [value, listeners] as const;
};
