import type { FC } from 'react';
import { TechnicalRadarCompact } from './TechnicalRadarCompact';
import { TechnicalRadarExpanded } from './TechnicalRadarExpanded';

export const TechnicalRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return (
    <>
      {expanded ? (
        <TechnicalRadarExpanded />
      ) : (
        <TechnicalRadarCompact focus={focus} />
      )}
    </>
  );
};
