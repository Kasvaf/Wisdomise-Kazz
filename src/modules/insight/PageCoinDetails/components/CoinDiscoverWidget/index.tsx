import { clsx } from 'clsx';
import { useCallback, type FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { type CoinDiscoverTab, CoinDiscoverTabs } from './CoinDiscoverTabs';
import { NetworkRadarTable } from './NetworkRadarTable';
import { SocialRadarTable } from './SocialRadarTable';
import { WhaleRadarTable } from './WhaleRadarTable';
import { TechnicalRadarTable } from './TechnicalRadarTable';
import { CoinRadarTable } from './CoinRadarTable';

export const CoinDiscoverWidget: FC<{ className?: string }> = ({
  className,
}) => {
  const [selectedTab, setSelectedTab] = useSearchParamAsState(
    'discoverTab',
    'social-radar' as CoinDiscoverTab,
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleRowClick = useCallback(
    (slug: string) => {
      navigate(`/coin/${slug}?${searchParams.toString()}`);
    },
    [navigate, searchParams],
  );
  return (
    <div className={clsx('flex max-w-full flex-col items-stretch', className)}>
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-v1-surface-l1 py-2">
        <CoinDiscoverTabs value={selectedTab} onChange={setSelectedTab} />
      </div>

      {selectedTab === 'coin-radar' && (
        <CoinRadarTable onClick={row => handleRowClick(row.symbol.slug)} />
      )}
      {selectedTab === 'network-radar' && (
        <NetworkRadarTable
          onClick={row => handleRowClick(row.base_symbol.slug)}
        />
      )}
      {selectedTab === 'social-radar' && (
        <SocialRadarTable onClick={row => handleRowClick(row.symbol.slug)} />
      )}
      {selectedTab === 'technical-radar' && (
        <TechnicalRadarTable onClick={row => handleRowClick(row.symbol.slug)} />
      )}
      {selectedTab === 'whale-radar' && (
        <WhaleRadarTable onClick={row => handleRowClick(row.symbol.slug)} />
      )}
    </div>
  );
};
