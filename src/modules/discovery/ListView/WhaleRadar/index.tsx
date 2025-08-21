import type { FC } from 'react';
import { WhaleRadarCompact } from './WhaleRadarCompact';
import { WhaleRadarExpanded } from './WhaleRadarExpanded';

export const WhaleRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return (
    <>
      {expanded ? <WhaleRadarExpanded /> : <WhaleRadarCompact focus={focus} />}
    </>
  );
};
