import type { FC } from 'react';
import { NetworkRadarCompact } from './NetworkRadarCompact';
import { NetworkRadarExpanded } from './NetworkRadarExpanded';

export const NetworkRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return (
    <>
      {expanded ? (
        <NetworkRadarExpanded />
      ) : (
        <NetworkRadarCompact focus={focus} />
      )}
    </>
  );
};
