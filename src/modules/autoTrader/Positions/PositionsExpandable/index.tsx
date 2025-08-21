import { useActiveWallet } from 'api/chains/wallet';
import { clsx } from 'clsx';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import useTraderDrawer from 'modules/autoTrader/BuySellTrader/useTraderDrawer';
import PositionsList from 'modules/autoTrader/Positions/PositionsList';
import useEnsureIsSupportedPair from 'modules/autoTrader/useEnsureIsSupportedPair';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'shared/Button';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import useIsMobile from 'utils/useIsMobile';

const PositionsExpandable = ({
  expanded,
  className,
}: {
  expanded?: boolean;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useState('');

  const [TraderDrawer, openTraderDrawer] = useTraderDrawer();
  const wallet = useActiveWallet();
  const { getUrl } = useDiscoveryRouteMeta();
  useEnsureIsSupportedPair({
    slug,
    nextPage: '/discovery?list=positions&view=list',
  });

  const navigate = useNavigate();

  return (
    <div className={className}>
      <div className="mb-4 flex flex-row-reverse flex-wrap justify-between gap-4">
        <ButtonSelect
          className={clsx(!expanded && '!w-full', 'mobile:w-full w-60')}
          onChange={setFilter}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'history', label: 'History' },
          ]}
          size="sm"
          surface={1}
          value={filter}
        />

        <CoinSelect
          className={clsx(!expanded && '!w-full', 'mobile:w-full w-80')}
          emptyOption="All Tradable Coins & Tokens"
          filterTokens={x => x !== 'tether'}
          mini={false}
          onChange={setSlug}
          showPrice
          tradableCoinsOnly
          value={slug}
        />
      </div>

      <PositionsList
        grid={!isMobile && expanded}
        isOpen={filter === 'active'}
        slug={slug}
      />

      {filter === 'active' && slug && (
        <div
          className={clsx(
            isMobile ? 'fixed start-4 end-4 z-50' : 'mt-6 flex justify-center',
            isMobile && 'bottom-20',
          )}
        >
          <ActiveNetworkProvider base={slug} setOnLayout>
            {TraderDrawer}
          </ActiveNetworkProvider>
          <Button
            className={clsx('block', isMobile ? 'w-full' : 'w-80')}
            onClick={async () => {
              if (wallet.connected || (await wallet.connect())) {
                if (isMobile) {
                  openTraderDrawer({ slug });
                } else {
                  navigate(getUrl({ view: 'both', slug }));
                }
              }
            }}
            variant="brand"
          >
            Start Trading
          </Button>
        </div>
      )}
    </div>
  );
};

export default PositionsExpandable;
