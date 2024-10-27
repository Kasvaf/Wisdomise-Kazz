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
  // const { data } = useTraderPositionsQuery(
  //   coinOverview.data?.symbol
  //     ? `${coinOverview.data.symbol.abbreviation}USDT`
  //     : 'null',
  // );

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
          value={slug}
          onChange={selectedSlug => navigate(`/hot-coins/${selectedSlug}`)}
        />
      </div>
      {coinOverview.data?.symbol.abbreviation !== 'USDT' && (
        <div>
          {coinOverview.data?.symbol.abbreviation && (
            <AdvancedRealTimeChart
              key={coinOverview.data.symbol.abbreviation}
              symbol={coinOverview.data.symbol.abbreviation + 'USDT'}
              theme="dark"
              width="100%"
              height={400}
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
