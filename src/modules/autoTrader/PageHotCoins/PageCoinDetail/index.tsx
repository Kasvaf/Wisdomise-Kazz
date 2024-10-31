import { useNavigate, useParams } from 'react-router-dom';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useCoinOverview } from 'api';
import Button from 'shared/Button';
import { CoinSelect } from 'modules/account/PageAlerts/components/CoinSelect';
import Icon from 'shared/Icon';

export default function PageCoinDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  const coinOverview = useCoinOverview({ slug });

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <Button
          variant="alternative"
          onClick={() => navigate('/hot-coins')}
          className="!px-3 !py-0"
        >
          <Icon name={bxLeftArrowAlt} />
        </Button>
        <CoinSelect
          networkName="ton"
          className="w-full"
          filterTokens={x => x !== 'tether'}
          value={slug}
          onChange={selectedSlug => navigate(`/hot-coins/${selectedSlug}`)}
        />
      </div>
      {coinOverview.data?.symbol.abbreviation !== 'USDT' && (
        <div>
          {coinOverview.data?.symbol.abbreviation && (
            <AdvancedRealTimeChart
              hide_top_toolbar={true}
              hide_side_toolbar={true}
              symbol={`${String(coinOverview?.data.symbol.abbreviation)}USDT`}
              theme="dark"
              width="100%"
              height={360}
            />
          )}
          <Button
            variant="brand"
            className="w-full"
            onClick={() => navigate(`/market/${slug}`)}
          >
            Auto Trade
          </Button>
        </div>
      )}
    </div>
  );
}
