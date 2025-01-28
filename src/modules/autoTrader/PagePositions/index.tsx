import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import { ButtonSelect } from 'shared/ButtonSelect';
import Button from 'shared/Button';
import PositionsList from '../PositionsList';

const PagePositions = () => {
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('slug');

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
        selectFirst
      />

      <PositionsList slug={slug} isOpen={filter === 'active'} />

      {filter === 'active' && (
        <Button
          variant="brand"
          className="fixed bottom-20 end-4 start-4 z-50"
          to={`/market/${slug || 'the-open-network'}`}
        >
          Start Auto Trading
        </Button>
      )}
    </div>
  );
};

export default PagePositions;
