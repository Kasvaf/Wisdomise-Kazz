import { useNavigate, useParams } from 'react-router-dom';
import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useCoinOverview, useTraderPositionsQuery } from 'api';
import { CoinSelect } from 'modules/account/PageAlerts/components/CoinSelect';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import PositionDetail from '../PositionDetail';
import empty from './empty.svg';

export default function PageCoinDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  const coinOverview = useCoinOverview({ slug });
  const { data: positionsRes } = useTraderPositionsQuery(
    coinOverview?.data?.symbol.abbreviation
      ? `${coinOverview?.data?.symbol.abbreviation}USDT`
      : undefined,
  );

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <Button
          variant="alternative"
          to="/hot-coins"
          className="flex items-center justify-center !px-3 !py-0"
        >
          <Icon name={bxLeftArrowAlt} />
        </Button>

        <CoinSelect
          networkName="ton"
          className="w-full"
          filterTokens={x => x !== 'tether'}
          value={slug}
          showPrice
          onChange={selectedSlug => navigate(`/hot-coins/${selectedSlug}`)}
        />
      </div>

      {!positionsRes?.positions.length && (
        <div className="flex flex-col items-center justify-center pb-5 text-center">
          <img src={empty} alt="" className="my-8" />
          <h1 className="mt-3 font-semibold">No Active Position Yet!</h1>
          <p className="mt-3 w-3/4 text-xs">
            Get started by creating your first position. Your active trades will
            appear here!
          </p>
        </div>
      )}

      {positionsRes?.positions.map(position => (
        <PositionDetail
          key={position.key}
          pairSlug={slug}
          position={position}
          className="mb-3"
        />
      ))}

      <Button
        variant="brand"
        className="fixed bottom-20 end-4 start-4 mt-5"
        to={`/market/${slug}`}
      >
        Auto Trade
      </Button>
    </div>
  );
}
