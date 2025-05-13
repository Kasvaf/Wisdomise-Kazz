import { type FC } from 'react';
import { WhaleRadarExpanded } from './WhaleRadarExpanded';
import { WhaleRadarCompact } from './WhaleRadarCompact';

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
