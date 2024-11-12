import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinSelect } from 'modules/account/PageAlerts/components/CoinSelect';
import { ButtonSelect } from 'shared/ButtonSelect';
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
        networkName="ton"
        className="my-4 w-full"
        filterTokens={x => x !== 'tether'}
        value={slug}
        showPrice
        onChange={setSlug}
        emptyOption="All Coins & Tokens"
      />

      <PositionsList slug={slug} isOpen={filter === 'active'} />
    </div>
  );
};

export default PagePositions;
