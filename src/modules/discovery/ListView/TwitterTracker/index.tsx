import { type FC } from 'react';

export const TwitterTracker: FC<{ focus?: boolean }> = ({ focus }) => {
  return (
    <>
      {'X Tracker'}
      {focus && 'F'}
    </>
  );
};
