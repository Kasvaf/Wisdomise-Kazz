import type { FC } from 'react';
import { isMiniApp } from 'utils/version';
import { CoinRadarCompact } from './CoinRadarCompact';
import { CoinRadarExpanded } from './CoinRadarExpanded';
import { CoinRadarMiniApp } from './CoinRadarMiniApp';
import { PageCoinRadarMeta } from './PageCoinRadarMeta';

export const CoinRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return (
    <>
      {focus && <PageCoinRadarMeta />}
      {isMiniApp ? (
        <CoinRadarMiniApp />
      ) : expanded ? (
        <CoinRadarExpanded />
      ) : (
        <CoinRadarCompact focus={focus} />
      )}
    </>
  );
};
