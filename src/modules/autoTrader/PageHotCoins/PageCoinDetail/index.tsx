import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { bxEditAlt, bxLeftArrowAlt } from 'boxicons-quasar';
import { useCoinOverview, useTraderPositionsQuery } from 'api';
import { CoinSelect } from 'modules/account/PageAlerts/components/CoinSelect';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import empty from './empty.svg';
import CloseButton from './CloseButton';
import CancelButton from './CancelButton';

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
        <Button variant="alternative" to="/hot-coins" className="!px-3 !py-0">
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
        <div
          className="mb-3 rounded-3xl bg-v1-surface-l2 p-4 text-xs"
          key={position.key}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{position.pair}</span>
              <div className="rounded-full bg-v1-surface-l3 px-2 py-1 text-v1-content-secondary">
                Market
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CancelButton position={position} />
              <CloseButton position={position} />

              {position.status !== 'CLOSED' &&
                position.status !== 'CANCELED' &&
                (position.status !== 'DRAFT' ||
                  position.deposit_status !== 'PENDING') && (
                  <Button
                    variant="link"
                    className="ms-auto !p-0 !text-xs text-v1-content-link"
                    to={`/market/${slug}?pos=${position.key}`}
                  >
                    <Icon name={bxEditAlt} size={16} />
                    Edit
                  </Button>
                )}
            </div>
          </div>
          <hr className="my-4 border-white/10" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Status</span>
              <span>{position.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Deposit Status</span>
              <span>{position.deposit_status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Opened At</span>
              <span>
                {position.entry_time
                  ? dayjs(position.entry_time).fromNow()
                  : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Closed At</span>
              <span>
                {position.exit_time ? dayjs(position.exit_time).fromNow() : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">P / L</span>
              <span>{position.pnl ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">Size</span>
              <span>{position.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">
                Average Entry Prices
              </span>
              <span>{position.entry_price ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">
                Average Stop Losses
              </span>
              <span>{position.stop_loss ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-v1-content-secondary">
                Avg Take Profits
              </span>
              <span>{position.take_profit ?? '-'}</span>
            </div>
          </div>
        </div>
      ))}
      {/* {coinOverview.data?.symbol.abbreviation !== 'USDT' && ( */}
      {/*   <div> */}
      {/*     {coinOverview.data?.symbol.abbreviation && ( */}
      {/*       <AdvancedRealTimeChart */}
      {/*         hide_top_toolbar={true} */}
      {/*         hide_side_toolbar={true} */}
      {/*         symbol={`${String(coinOverview?.data.symbol.abbreviation)}USDT`} */}
      {/*         theme="dark" */}
      {/*         width="100%" */}
      {/*         height={360} */}
      {/*       /> */}
      {/*     )} */}
      <Button
        variant="brand"
        className="fixed bottom-20 end-4 start-4 mt-5"
        to={`/market/${slug}`}
      >
        Auto Trade
      </Button>
      {/*   </div> */}
      {/* )} */}
    </div>
  );
}
