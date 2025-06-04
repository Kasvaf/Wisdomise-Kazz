import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PositionsList from 'modules/autoTrader/Positions/PositionsList';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import Button from 'shared/Button';
import useIsMobile from 'utils/useIsMobile';
import useTraderDrawer from 'modules/autoTrader/BuySellTrader/useTraderDrawer';
import { useActiveWallet } from 'api/chains/wallet';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import useEnsureIsSupportedPair from 'modules/autoTrader/useEnsureIsSupportedPair';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

const PositionsExpandable = ({ expanded }: { expanded?: boolean }) => {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('position_slug');

  const [TraderDrawer, openTraderDrawer] = useTraderDrawer();
  const wallet = useActiveWallet();
  const { getUrl } = useDiscoveryRouteMeta();
  useEnsureIsSupportedPair({
    slug,
    nextPage: '/discovery?list=positions&view=list',
  });

  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4 flex flex-row-reverse flex-wrap justify-between gap-4">
        <ButtonSelect
          options={[
            { value: 'active', label: 'Active' },
            { value: 'history', label: 'History' },
          ]}
          value={filter}
          onChange={setFilter}
          className={clsx(!expanded && '!w-full', 'w-60 mobile:w-full')}
          surface={2}
        />

        <CoinSelect
          className={clsx(!expanded && '!w-full', 'w-80 mobile:w-full')}
          filterTokens={x => x !== 'tether'}
          value={slug}
          showPrice
          onChange={setSlug}
          emptyOption="All Tradable Coins & Tokens"
          mini={false}
          tradableCoinsOnly
        />
      </div>

      <PositionsList
        slug={slug}
        isOpen={filter === 'active'}
        grid={!isMobile && expanded}
      />

      {filter === 'active' && slug && (expanded || isMobile) && (
        <div
          className={clsx(
            isMobile ? 'fixed end-4 start-4 z-50' : 'mt-6 flex justify-center',
            isMobile && 'bottom-20',
          )}
        >
          <ActiveNetworkProvider base={slug} setOnLayout>
            {TraderDrawer}
          </ActiveNetworkProvider>
          <Button
            variant="brand"
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
          >
            Start Trading
          </Button>
        </div>
      )}
    </div>
  );
};

export default PositionsExpandable;
