import { useSupportedPairs } from 'api';
import { useAllWallets } from 'api/chains/wallet';
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
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
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
import { ReactComponent as UserIcon } from './user.svg';

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

const AssetSwapsStream: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const details = useUnifiedCoinDetails();
  const slug = details.symbol.slug;
  const { data: symbol } = useSymbolInfo(slug);
  const { settings, updateSwapsPartial } = useUserSettings();
  const wallets = useAllWallets();

  const { data: pairs, isPending } = useSupportedPairs(slug);

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === 'wrapped-solana');

  const totalSupply = details?.marketData.totalSupply ?? 0;
  const showAmountInUsd = hasSolanaPair ? settings.swaps.showAmountInUsd : true;
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
      ),
    [history, recent],
  );

  const { data: pausedData, isPaused } = usePausedData(
    updatedData,
    containerRef,
  );

  const maxAmount = pausedData.reduce((max, s) => {
    const dir = s.fromAsset === asset ? 'sell' : 'buy';
    const tokenAmount = +(dir === 'sell' ? s.fromAmount : s.toAmount);
    return Math.max(max, tokenAmount);
  }, 0);

  const now = useNow();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-1 py-6">
        <Spin /> Loading...
      </div>
    );
  }

  return (
    <div className="-mx-3 relative">
      <div
        className={clsx('h-80 overflow-auto pb-10 text-white/70 text-xs')}
        ref={containerRef}
      >
        <table className="w-full [&_td]:pl-3 [&_th]:pl-3">
          <thead className="sticky top-0 z-20 bg-v1-surface-l0 text-white/50 [&_th]:py-3">
            <tr>
              <th className="text-left font-normal">
                <div className="flex items-center gap-1">
                  Amount
                  <BtnConvertToUsd
                    disabled={!hasSolanaPair}
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
            </tr>
          </thead>
          <tbody>
            {pausedData?.map(row => {
              const dir = row.fromAsset === asset ? 'sell' : 'buy';
              const price =
                dir === 'sell' ? row.fromAssetPrice : row.toAssetPrice;

              const tokenAmount = +(dir === 'sell'
                ? row.fromAmount
                : row.toAmount);
              const solAmount = +(dir === 'sell'
                ? row.toAmount
                : row.fromAmount);
              const amount = showAmountInUsd
                ? tokenAmount * +(price ?? '0')
                : solAmount;
              const isUser = wallets.includes(row.wallet);

              return (
                <tr className="relative [&>td]:h-6" key={row.id}>
                  <td
                    className={clsx(
                      dir === 'sell'
                        ? 'text-v1-content-negative'
                        : 'text-v1-content-positive',
                    )}
                  >
                    <div className="flex items-center">
                      <div
                        className={clsx(
                          dir === 'sell'
                            ? 'bg-v1-background-negative/20'
                            : 'bg-v1-background-positive/20',
                          'absolute left-0 h-5 min-w-1',
                        )}
                        style={{ width: `${(tokenAmount / maxAmount) * 100}%` }}
                      ></div>
                      <div className="flex items-center gap-1">
                        {showAmountInUsd ? '$' : <SolanaCoin />}
                        {formatNumber(+amount, {
                          compactInteger: true,
                          decimalLength: 3,
                          separateByComma: false,
                          minifyDecimalRepeats: true,
                        })}
                      </div>
                    </div>
                  </td>
                  <td>
                    {price
                      ? '$ ' +
                        formatNumber(
                          +price * (showMarketCap ? totalSupply : 1),
                          {
                            compactInteger: true,
                            decimalLength: 2,
                            separateByComma: false,
                            minifyDecimalRepeats: true,
                          },
                        )
                      : ''}
                  </td>
                  <td
                    className="relative cursor-pointer hover:underline"
                    onClick={() => copy(row.wallet)}
                  >
                    <div className="flex items-center">
                      {isUser && (
                        <HoverTooltip className="mb-4" title="You">
                          <UserIcon className="-left-5 absolute size-4 text-v1-content-brand" />
                        </HoverTooltip>
                      )}
                      {row.wallet.slice(-3)}
                    </div>
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
        {notif}
      </div>
      <div
        className={clsx(
          'absolute right-0 bottom-0 left-0 z-20 mt-2 flex w-full items-center justify-center gap-1 border-white/10 border-t py-2 text-v1-content-brand opacity-0 backdrop-blur-sm',
          isPaused && 'opacity-100',
        )}
      >
        <Icon name={bxPause} />
        Paused
      </div>
    </div>
  );
};

export default AssetSwapsStream;
