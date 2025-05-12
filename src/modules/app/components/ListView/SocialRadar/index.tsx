import { type FC } from 'react';
import { SocialRadarExpanded } from './SocialRadarExpanded';
import { SocialRadarCompact } from './SocialRadarCompact';

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
