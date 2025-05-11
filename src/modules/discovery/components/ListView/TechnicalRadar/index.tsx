import { type FC } from 'react';

export const TechnicalRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return <>{JSON.stringify({ radar: 'technical-radar', focus, expanded })}</>;
};
