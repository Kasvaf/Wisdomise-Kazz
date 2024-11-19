import { useNavigate, useParams } from 'react-router-dom';
import { bxLeftArrowAlt } from 'boxicons-quasar';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { useCoinOverview } from 'api';
import { CoinPriceWidget } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/CoinPriceWidget';
import { CoinStatsWidget } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/CoinStatsWidget';
import PositionsList from '../PositionsList';

export default function PageCoinDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  useCoinOverview({ slug });

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-3 flex gap-2">
        <Button
          variant="alternative"
          to="/trader-hot-coins"
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
          onChange={selectedSlug =>
            navigate(`/trader-hot-coins/${selectedSlug}`)
          }
        />
      </div>

      <CoinPriceWidget slug={slug} />
      <PositionsList slug={slug} isOpen />

      <CoinStatsWidget slug={slug} />

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
