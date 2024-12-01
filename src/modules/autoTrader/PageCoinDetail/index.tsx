import { useNavigate, useParams } from 'react-router-dom';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import Button from 'shared/Button';
import { useCoinOverview } from 'api';
import { CoinSocialSentimentWidget } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/CoinSocialSentimentWidget';
import { CoinStatsWidget } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/CoinStatsWidget';
import PositionsList from '../PositionsList';
import BtnBack from '../BtnBack';
import MiniCoinPriceWidget from './MiniCoinPriceWidget';

export default function PageCoinDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  useCoinOverview({ slug });

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-3 flex gap-2">
        <BtnBack />

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

      <MiniCoinPriceWidget slug={slug} />
      <PositionsList slug={slug} isOpen noEmptyState />

      <CoinStatsWidget slug={slug} />
      <CoinSocialSentimentWidget slug={slug} noEmptyState />

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
