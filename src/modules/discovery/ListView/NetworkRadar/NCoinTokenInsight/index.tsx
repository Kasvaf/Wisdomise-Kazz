import { clsx } from 'clsx';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import {
  useBundleHolding,
  useDevHolding,
  useDexPaid,
  useHoldersNumber,
  useLpBurned,
  useRisks,
  useSniperHolding,
  useTop10Holding,
} from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight/useTokenInsight';
import { type FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Badge } from 'shared/v1-components/Badge';
import Skeleton from 'shared/v1-components/Skeleton';

export const NCoinTokenInsight: FC<{
  className?: string;
  value?: {
    top10Holding?: number;
    snipersHolding?: number;
    numberOfHolders?: number;
    insiderHolding?: number;
    devHolding?: number;
    boundleHolding?: number;
    dexPaid?: boolean;
  };
}> = memo(({ className, value }) => {
  const top10Holding = useTop10Holding(value?.top10Holding);
  const devHolding = useDevHolding(value?.devHolding);
  const sniperHolding = useSniperHolding(value?.snipersHolding);
  const bundleHolding = useBundleHolding(value?.boundleHolding);
  const dexPaid = useDexPaid(value?.dexPaid);

  const insight = useMemo(
    () => [
      top10Holding,
      devHolding,
      sniperHolding,
      bundleHolding,
      ...(value?.dexPaid ? [dexPaid] : []),
    ],
    [
      top10Holding,
      devHolding,
      sniperHolding,
      bundleHolding,
      dexPaid,
      value?.dexPaid,
    ],
  );

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-1',
        !value && 'animate-pulse',
        className,
      )}
    >
      {insight.map(item => (
        <HoverTooltip
          key={item.title}
          placement="bottom"
          title={item.fullTitle}
        >
          <Badge
            color={
              item.color === 'green'
                ? 'positive'
                : item.color === 'red'
                  ? 'negative'
                  : 'neutral'
            }
            variant="outline"
          >
            <item.icon />
            {item.value}
          </Badge>
        </HoverTooltip>
      ))}
    </div>
  );
});

export const TokenInfo: FC<{
  className?: string;
}> = memo(({ className }) => {
  const { t } = useTranslation('network-radar');

  const { validatedData, securityData, risks } = useUnifiedCoinDetails();
  const top10Holding = useTop10Holding(validatedData?.top10Holding);
  const bundleHolding = useBundleHolding(validatedData?.boundleHolding);
  const sniperHolding = useSniperHolding(validatedData?.snipersHolding);
  const devHolding = useDevHolding(validatedData?.devHolding);
  const lpBurned = useLpBurned(securityData?.lpBurned);
  const dexPaid = useDexPaid(securityData?.dexPaid);
  const risksStat = useRisks(risks ?? undefined);
  const holders = useHoldersNumber(validatedData?.numberOfHolders);

  const isLoading = !validatedData || !securityData;

  const insight = useMemo(
    () => [
      top10Holding,
      devHolding,
      sniperHolding,
      bundleHolding,
      lpBurned,
      dexPaid,
      risksStat,
      holders,
    ],
    [
      top10Holding,
      devHolding,
      sniperHolding,
      bundleHolding,
      lpBurned,
      dexPaid,
      risksStat,
      holders,
    ],
  );

  return (
    <div
      className={clsx('rounded-lg bg-v1-surface-l-next p-3 text-sm', className)}
    >
      <p className="mb-3 font-normal text-xs">
        {t('network-radar:token_insight.title')}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {insight.map(item => (
          <div
            className={clsx(
              'flex flex-col gap-2 rounded-lg border border-white/5 p-2 text-center',
            )}
            key={item.title}
          >
            <p className="text-v1-content-secondary text-xs">{item.title}</p>

            {isLoading ? (
              <Skeleton className="!bg-v1-surface-l2 h-5" />
            ) : (
              <div
                className={clsx(
                  'relative flex shrink-0 items-center justify-center gap-1',
                  item.color === 'green'
                    ? 'text-v1-content-positive'
                    : item.color === 'red'
                      ? 'text-v1-content-negative'
                      : 'text-v1-content-primary/70',
                )}
              >
                {'icon' in item && <item.icon className="size-5" />}
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
