import { delphinusGrpc } from 'api/grpc';
import type { Swap } from 'api/proto/delphinus';
import { useSymbolInfo } from 'api/symbol';
import { bxPause, bxTransfer } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  BtnConvertToUsd,
  SolanaCoin,
} from 'modules/autoTrader/CoinSwapActivity';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/useUnifiedCoinDetails';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { timeAgo } from 'utils/date';
import { formatNumber } from 'utils/numbers';
import { uniqueBy } from 'utils/uniqueBy';
import useNow from 'utils/useNow';

const usePausedData = <V,>(
  dataSource: V[],
  hoverElementRef: RefObject<HTMLElement>,
) => {
  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState<V[]>(dataSource);

  useEffect(() => {
    const el = hoverElementRef.current;
    if (!el) return;

    const handleEnter = () => setIsPaused(true);
    const handleLeave = () => setIsPaused(false);

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [hoverElementRef.current]);

  useEffect(() => {
    if (!isPaused) {
      setData(dataSource);
    }
  }, [dataSource, isPaused]);

  return { data, isPaused };
};

const AssetSwapsStream: React.FC<{ slug: string }> = ({ slug }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: symbol } = useSymbolInfo(slug);
  const { data: coin } = useUnifiedCoinDetails({ slug });
  const { settings, updateSwapsPartial } = useUserSettings();

  const totalSupply = coin?.marketData.total_supply ?? 0;
  const showAmountInUsd = settings.swaps.showAmountInUsd;
  const showMarketCap = settings.swaps.showMarketCap;

  const network = useActiveNetwork();
  const asset = symbol?.networks.find(
    x => x.network.slug === network,
  )?.contract_address;

  const enabled = !!network && !!asset;
  const { data: history, isLoading } = delphinusGrpc.useSwapsHistoryQuery(
    {
      network,
      asset,
    },
    { enabled },
  );

  const { data: recent } = delphinusGrpc.useSwapsStreamAllValues(
    {
      network,
      asset,
    },
    { enabled },
  );

  const [copy, notif] = useShare('copy');

  const updatedData = useMemo(
    () =>
      uniqueBy(
        [...(recent?.map(x => x.swap) ?? []), ...(history?.swaps ?? [])]
          .filter((x): x is Swap => !!x)
          .sort((a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt)),
        x => x.id,
      ).slice(0, 20),
    [history, recent],
  );

  const { data: pausedData, isPaused } = usePausedData(
    updatedData,
    containerRef,
  );

  const now = useNow();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-1 py-6">
        <Spin /> Loading...
      </div>
    );
  }

  return (
    <div
      className={clsx(
        '-mx-3 p-3 text-white/70 text-xs',
        isPaused && 'bg-v1-surface-l1',
      )}
      ref={containerRef}
    >
      <table className="w-full">
        <thead className="text-white/50 [&>th]:pb-2">
          <th className="text-left font-normal">
            <div className="flex items-center gap-1">
              Amount
              <BtnConvertToUsd
                isUsd={showAmountInUsd}
                onChange={() =>
                  updateSwapsPartial({ showAmountInUsd: !showAmountInUsd })
                }
              />
            </div>
          </th>
          <th className="flex items-center gap-1 text-left font-normal">
            {showMarketCap ? 'MC' : 'Price'}
            <Button
              className="text-white/50"
              fab
              onClick={() =>
                updateSwapsPartial({ showMarketCap: !showMarketCap })
              }
              size="3xs"
              variant="ghost"
            >
              <Icon className="[&>svg]:!size-3" name={bxTransfer} />
            </Button>
          </th>
          <th className="text-left font-normal">Trader</th>
          <th className="text-left font-normal">Age</th>
        </thead>
        <tbody>
          {pausedData?.map(row => {
            const dir = row.fromAsset === asset ? 'sell' : 'buy';
            const price =
              dir === 'sell' ? row.fromAssetPrice : row.toAssetPrice;

            const tokenAmount = +(dir === 'sell'
              ? row.fromAmount
              : row.toAmount);
            const solAmount = +(dir === 'sell' ? row.toAmount : row.fromAmount);
            const amount = showAmountInUsd
              ? tokenAmount * +(price ?? '0')
              : solAmount;

            return (
              <tr className="[&>td]:pb-1" key={row.id}>
                <td
                  className={clsx(
                    dir === 'sell'
                      ? 'text-v1-content-negative'
                      : 'text-v1-content-positive',
                    'flex items-center gap-1',
                  )}
                >
                  {showAmountInUsd ? '$' : <SolanaCoin />}
                  {formatNumber(+amount, {
                    compactInteger: true,
                    decimalLength: 3,
                    separateByComma: false,
                    minifyDecimalRepeats: true,
                  })}
                </td>
                <td>
                  {price
                    ? '$ ' +
                      formatNumber(+price * (showMarketCap ? totalSupply : 1), {
                        compactInteger: true,
                        decimalLength: 2,
                        separateByComma: false,
                        minifyDecimalRepeats: true,
                      })
                    : ''}
                </td>
                <td
                  className="cursor-pointer hover:underline"
                  onClick={() => copy(row.wallet)}
                >
                  {row.wallet.slice(-3)}
                </td>
                <td
                  className="cursor-pointer text-v1-content-secondary hover:underline"
                  onClick={() => openInScan('solana', { tx: row.txId })}
                >
                  <HoverTooltip title="Open TX in Solscan">
                    {timeAgo(new Date(row.relatedAt), new Date(now))}
                  </HoverTooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        className={clsx(
          'mt-2 flex w-full items-center justify-center gap-1 text-v1-content-brand opacity-0',
          isPaused && 'opacity-100',
        )}
      >
        <Icon name={bxPause} />
        Paused
      </div>
      {notif}
    </div>
  );
};

export default AssetSwapsStream;
