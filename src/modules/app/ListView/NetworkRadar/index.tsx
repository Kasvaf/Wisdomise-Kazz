import { type FC } from 'react';
import { NetworkRadarExpanded } from './NetworkRadarExpanded';
import { NetworkRadarCompact } from './NetworkRadarCompact';

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
