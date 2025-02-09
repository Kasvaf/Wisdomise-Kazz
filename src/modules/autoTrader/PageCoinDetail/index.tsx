import { useNavigate, useParams } from 'react-router-dom';
import { useHasFlag } from 'api';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import CoinChart from 'modules/insight/coinRadar/PageCoinRadarDetail/components/CoinChart';
import { CoinStatsWidget } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/CoinStatsWidget';
import { SocialRadarSentimentWidget } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/SocialRadarSentimentWidget';
import Button from 'shared/Button';
import BtnBack from '../../base/BtnBack';
import PositionsList from '../PositionsList';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import MiniCoinPriceWidget from './MiniCoinPriceWidget';

export default function PageCoinDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();
  const hasFlag = useHasFlag();
  // /trader-hot-coins/[slug]?chart

  useEnsureIsSupportedPair({ slug, nextPage: '/trader-hot-coins' });

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-3 flex gap-2">
        <BtnBack />

        <CoinSelect
          className="w-full"
          filterTokens={x => x !== 'tether'}
          value={slug}
          priceExchange="auto"
          onChange={selectedSlug =>
            navigate(`/trader-hot-coins/${selectedSlug}`)
          }
          mini={false}
        />
      </div>

      <MiniCoinPriceWidget slug={slug} />
      <PositionsList slug={slug} isOpen noEmptyState />

      <CoinStatsWidget slug={slug} />
      <SocialRadarSentimentWidget slug={slug} noEmptyState />

      {hasFlag('/trader-coin-chart') && (
        <div className="-mx-1">
          <CoinChart slug={slug} height={500} />
        </div>
      )}

      <Button
        variant="brand"
        className="fixed bottom-20 end-4 start-4 mt-5"
        to={`/auto-trader/${slug}`}
      >
        Auto Trade
      </Button>
    </div>
  );
}
