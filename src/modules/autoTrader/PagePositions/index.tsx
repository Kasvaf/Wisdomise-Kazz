import { useTraderPositionsQuery } from 'api';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Spinner from 'shared/Spinner';
import { ButtonSelect } from 'shared/ButtonSelect';
import PositionDetail from '../PositionDetail';

const PagePositions = () => {
  const [filter, setFilter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );
  const [slug, setSlug] = useSearchParamAsState('slug');

  const { data: positions, isLoading } = useTraderPositionsQuery(slug);
  const positionsRes =
    positions?.positions.filter(x =>
      (filter === 'active'
        ? ['DRAFT', 'PENDING', 'OPENING', 'OPEN']
        : ['CLOSED', 'CANCELED']
      ).includes(x.status),
    ) ?? [];

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

      {isLoading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : positionsRes.length > 0 ? (
        positionsRes.map(position => (
          <PositionDetail
            key={position.key}
            pairSlug={'slug'}
            position={position}
            className="mb-3"
          />
        ))
      ) : (
        <div className="my-8 flex w-full justify-center rounded-xl bg-v1-surface-l1 p-4">
          {filter === 'active'
            ? 'No active positions found.'
            : 'No closed positions found.'}
        </div>
      )}
    </div>
  );
};

export default PagePositions;
