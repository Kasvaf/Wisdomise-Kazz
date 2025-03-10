import { clsx } from 'clsx';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import { useIsTrialBannerVisible } from 'modules/base/Container/TrialEndBanner';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PageWrapper from 'modules/base/PageWrapper';
import { ButtonSelect } from 'shared/ButtonSelect';
import Button from 'shared/Button';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import PositionsList from './PositionsList';

const PagePositions = () => {
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('slug');

  useEnsureIsSupportedPair({ slug, nextPage: '/trader-positions' });
  const isTrialBannerVisible = useIsTrialBannerVisible();

  return (
    <PageWrapper>
      <div className="mb-4 flex flex-row-reverse justify-between gap-4 mobile:flex-col">
        <ButtonSelect
          options={[
            { value: 'active', label: 'Active' },
            { value: 'history', label: 'History' },
          ]}
          value={filter}
          onChange={setFilter}
          className="mobile:w-full"
          itemsClassName="enabled:aria-checked:bg-v1-border-brand"
        />

        <CoinSelect
          className="mobile:w-full"
          filterTokens={x => x !== 'tether'}
          value={slug}
          priceExchange="auto"
          onChange={setSlug}
          emptyOption="All Tradable Coins & Tokens"
          mini={false}
          tradableCoinsOnly
        />
      </div>

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
          Start Trading
        </Button>
      )}
    </PageWrapper>
  );
};

export default PagePositions;
