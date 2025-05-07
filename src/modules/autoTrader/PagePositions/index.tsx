import { clsx } from 'clsx';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PageWrapper from 'modules/base/PageWrapper';
import { ButtonSelect } from 'shared/ButtonSelect';
import Button from 'shared/Button';
import useIsMobile from 'utils/useIsMobile';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { useActiveWallet } from 'api/chains';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import useTraderDrawer from '../BuySellTrader/useTraderDrawer';
import PositionsList from './PositionsList';

const PagePositions = () => {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('slug');

  useEnsureIsSupportedPair({ slug, nextPage: '/trader/positions' });
  const [TraderDrawer, openTraderDrawer] = useTraderDrawer();
  const wallet = useActiveWallet();

  return (
    <PageWrapper hasBack extension={!isMobile && <CoinExtensionsGroup />}>
      <div className="mb-4 flex flex-row-reverse justify-between gap-4 mobile:flex-col">
        <ButtonSelect
          options={[
            { value: 'active', label: 'Active' },
            { value: 'history', label: 'History' },
          ]}
          value={filter}
          onChange={setFilter}
          className="w-60 mobile:w-full"
          itemsClassName="enabled:aria-checked:!bg-v1-content-brand"
        />

        <CoinSelect
          className="w-80 mobile:w-full"
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
        grid={!isMobile}
      />

      {filter === 'active' && slug && (
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
                openTraderDrawer({ slug });
              }
            }}
          >
            Start Trading
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default PagePositions;
