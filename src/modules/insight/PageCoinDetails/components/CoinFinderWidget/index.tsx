import { clsx } from 'clsx';
import { useCallback, type FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { type CoinFinderTab, CoinFinderTabs } from './CoinFinderTabs';
import { NetworkRadarTable } from './NetworkRadarTable';
import { SocialRadarTable } from './SocialRadarTable';
import { WhaleRadarTable } from './WhaleRadarTable';
import { TechnicalRadarTable } from './TechnicalRadarTable';

export const CoinFinderWidget: FC<{ className?: string }> = ({ className }) => {
  const [selectedTab, setSelectedTab] = useSearchParamAsState(
    'finderTab',
    'social-radar' as CoinFinderTab,
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleRowClick = useCallback(
    (slug: string) => {
      navigate(`/coin/${slug}?${searchParams.toString()}`, {
        preventScrollReset: true,
        replace: true,
      });
    },
    [navigate, searchParams],
  );
  return (
    <div
      className={clsx(
        'flex max-w-full flex-col items-stretch gap-1',
        className,
      )}
    >
      <CoinFinderTabs value={selectedTab} onChange={setSelectedTab} />
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
