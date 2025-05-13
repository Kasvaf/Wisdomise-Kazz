import { type FC } from 'react';
import { isMiniApp } from 'utils/version';
import { CoinRadarMiniApp } from './CoinRadarMiniApp';
import { CoinRadarExpanded } from './CoinRadarExpanded';
import { CoinRadarCompact } from './CoinRadarCompact';
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
