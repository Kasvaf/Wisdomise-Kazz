import type { FC } from 'react';
import { SocialRadarCompact } from './SocialRadarCompact';
import { SocialRadarExpanded } from './SocialRadarExpanded';

export const SocialRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return (
    <>
      {expanded ? (
        <SocialRadarExpanded />
      ) : (
        <SocialRadarCompact focus={focus} />
      )}
    </>
  );
};
