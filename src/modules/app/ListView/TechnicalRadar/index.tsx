import { type FC } from 'react';
import { TechnicalRadarExpanded } from './TechnicalRadarExpanded';
import { TechnicalRadarCompact } from './TechnicalRadarCompact';

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
