import { clsx } from 'clsx';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import { useIsTrialBannerVisible } from 'modules/base/Container/TrialEndBanner';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PageWrapper from 'modules/base/PageWrapper';
import { ButtonSelect } from 'shared/ButtonSelect';
import Button from 'shared/Button';
import useIsMobile from 'utils/useIsMobile';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import PageNoDesktop from '../PageNoDesktop';
import PositionsList from './PositionsList';

const PagePositions = () => {
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('slug');

  useEnsureIsSupportedPair({ slug, nextPage: '/trader-positions' });
  const isTrialBannerVisible = useIsTrialBannerVisible();

  if (!useIsMobile()) {
    return <PageNoDesktop />;
  }
  return (
    <PageWrapper>
      <ButtonSelect
        options={[
          { value: 'active', label: 'Active' },
          { value: 'history', label: 'History' },
        ]}
        value={filter}
        onChange={setFilter}
        className="w-full"
        itemsClassName="enabled:aria-checked:bg-v1-border-brand"
      />

      <CoinSelect
        className="my-4 w-full"
        filterTokens={x => x !== 'tether'}
        value={slug}
        priceExchange="auto"
        onChange={setSlug}
        emptyOption="All Coins & Tokens"
        mini={false}
        tradableCoinsOnly
      />

      <PositionsList slug={slug} isOpen={filter === 'active'} />

      {filter === 'active' && slug && (
        <Button
          variant="brand"
          className={clsx(
            'fixed end-4 start-4 z-50',
            isTrialBannerVisible ? 'bottom-28' : 'bottom-20',
          )}
          to={`/auto-trader/${slug}`}
        >
          Start Auto Trading
        </Button>
      )}
    </PageWrapper>
  );
};

export default PagePositions;
