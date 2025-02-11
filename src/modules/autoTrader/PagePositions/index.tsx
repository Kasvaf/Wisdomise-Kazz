import { clsx } from 'clsx';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import { ButtonSelect } from 'shared/ButtonSelect';
import Button from 'shared/Button';
import { useIsTrialBannerVisible } from 'modules/base/Container/TrialEndBanner';
import PositionsList from '../PositionsList';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';

const PagePositions = () => {
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('slug');

  useEnsureIsSupportedPair({ slug, nextPage: '/trader-positions' });
  const isTrialBannerVisible = useIsTrialBannerVisible();

  return (
    <div>
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
      />

      <PositionsList slug={slug} isOpen={filter === 'active'} />

      {filter === 'active' && (
        <Button
          variant="brand"
          className={clsx(
            'fixed end-4 start-4 z-50',
            isTrialBannerVisible ? 'bottom-28' : 'bottom-20',
          )}
          to={`/auto-trader/${slug || 'the-open-network'}`}
        >
          Start Auto Trading
        </Button>
      )}
    </div>
  );
};

export default PagePositions;
