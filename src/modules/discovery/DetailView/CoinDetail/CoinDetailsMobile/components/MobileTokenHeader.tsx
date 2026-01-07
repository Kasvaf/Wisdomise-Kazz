import { bxShow } from 'boxicons-quasar';
import { NCoinAge } from 'modules/discovery/ListView/NetworkRadar/NCoinAge';
import {
  useBundleHolding,
  useDevHolding,
  useDexPaid,
  useLpBurned,
  useTop10Holding,
} from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight/useTokenInsight';
import { useMediaDialog } from 'modules/discovery/ListView/XTracker/useMediaDialog';
import Icon from 'modules/shared/Icon';
import { TokenSocials } from 'modules/shared/TokenSocials';
import { useMemo } from 'react';
import { useCopyToClipboard } from 'utils/useCopyToClipboard';
import { useUnifiedCoinDetails } from '../../lib';

interface MobileTokenHeaderProps {
  viewers?: number;
  platform?: string;
}

export function MobileTokenHeader({
  viewers = 0,
  platform = 'pump',
}: MobileTokenHeaderProps) {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { symbol, createdAt, socials, meta, validatedData, securityData } =
    useUnifiedCoinDetails();
  const { dialog, openMedia } = useMediaDialog();

  // Use meta.id as viewers count if available, otherwise use prop
  const viewersCount = meta?.id ?? viewers;

  // Format viewers to show max 3 digits with 'k' suffix
  const formatViewers = (count: number): string => {
    if (count >= 1000) {
      const thousands = count / 1000;
      // Show max 3 digits total (e.g., "1.2k", "12k", "123k")
      if (thousands >= 100) {
        return `${Math.floor(thousands)}k`;
      }
      if (thousands >= 10) {
        return `${Math.floor(thousands)}k`;
      }
      return `${thousands.toFixed(1)}k`;
    }
    return count.toString();
  };

  // Get formatted data using the same hooks as TokenInfoDrawer
  const devHolding = useDevHolding(validatedData?.devHolding);
  const bundleHolding = useBundleHolding(validatedData?.boundleHolding);
  const top10Holding = useTop10Holding(validatedData?.top10Holding);
  const lpBurned = useLpBurned(securityData?.lpBurned);
  const dexPaid = useDexPaid(securityData?.dexPaid);

  // Determine which risk indicators to show based on thresholds
  const riskIndicators = useMemo(() => {
    const indicators = [];

    // Dev holder > 4%
    if (
      typeof validatedData?.devHolding === 'number' &&
      validatedData.devHolding > 4
    ) {
      indicators.push({
        key: 'dev',
        label: 'Dev',
        value: `${validatedData.devHolding.toFixed(1)}%`,
        Icon: devHolding.icon,
      });
    }

    // Bundle holder > 20%
    if (
      typeof validatedData?.boundleHolding === 'number' &&
      validatedData.boundleHolding > 20
    ) {
      indicators.push({
        key: 'bundle',
        label: 'Bundle',
        value: `${validatedData.boundleHolding.toFixed(1)}%`,
        Icon: bundleHolding.icon,
      });
    }

    // Top 10% holder > 25%
    if (
      typeof validatedData?.top10Holding === 'number' &&
      validatedData.top10Holding > 25
    ) {
      indicators.push({
        key: 'top10',
        label: 'Top10',
        value: `${validatedData.top10Holding.toFixed(1)}%`,
        Icon: top10Holding.icon,
      });
    }

    // LP not burnt
    if (securityData?.lpBurned === false) {
      indicators.push({
        key: 'lp',
        label: 'LP',
        value: 'Not Burnt',
        Icon: lpBurned.icon,
      });
    }

    // Dex not paid
    if (securityData?.dexPaid === false) {
      indicators.push({
        key: 'dex',
        label: 'Dex',
        value: 'Unpaid',
        Icon: dexPaid.icon,
      });
    }

    return indicators;
  }, [
    validatedData?.devHolding,
    validatedData?.boundleHolding,
    validatedData?.top10Holding,
    securityData?.lpBurned,
    securityData?.dexPaid,
    devHolding.icon,
    bundleHolding.icon,
    top10Holding.icon,
    lpBurned.icon,
    dexPaid.icon,
  ]);

  return (
    <div className="flex items-center justify-between gap-3 bg-v1-background-primary px-3 py-2.5">
      {/* Token Icon with Platform Badge */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-v1-border-tertiary bg-gradient-to-br from-yellow-500 to-orange-600">
          {symbol.logo ? (
            <img
              alt={symbol.abbreviation || 'Token'}
              className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
              onClick={() => openMedia(symbol.logo || '')}
              src={symbol.logo}
            />
          ) : (
            <span className="font-bold text-lg text-white">
              {symbol.abbreviation?.[0] || '?'}
            </span>
          )}
        </div>
        {/* Platform Badge */}
        <div className="-bottom-0.5 -right-0.5 absolute flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-v1-background-primary bg-v1-background-positive">
          {validatedData?.protocol?.logo ? (
            <img
              alt={validatedData.protocol.name || 'Platform'}
              className="h-full w-full object-cover"
              src={validatedData.protocol.logo}
            />
          ) : (
            <span className="font-bold text-[9px] text-white">
              {platform[0].toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Token Info - Center */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Token Name & Symbol */}
        <div className="flex min-w-0 items-center gap-1">
          <div className="flex shrink-0 items-center gap-1.5">
            <h1 className="font-bold text-lg text-white leading-tight">
              {symbol.abbreviation}
            </h1>
            {/* Copy Address Button - Inline */}
            <button
              className="group flex shrink-0 items-center justify-center rounded-md p-0.5 transition-all hover:bg-v1-surface-l1 active:scale-95"
              onClick={() => copyToClipboard(symbol.contractAddress || '')}
              type="button"
            >
              {copied ? (
                <svg
                  className="h-3.5 w-3.5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="h-3.5 w-3.5 text-neutral-500 transition-colors group-hover:text-neutral-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <span className="truncate text-neutral-400 text-sm leading-tight">
            {symbol.name}
          </span>
        </div>

        {/* Meta Row: Socials, Age, Viewers */}
        <div className="flex min-w-0 items-center gap-2">
          {/* Social Icons */}
          <TokenSocials
            abbreviation={symbol.abbreviation}
            contractAddress={symbol.contractAddress}
            hideSearch={false}
            name={symbol.name}
            size="xs"
            value={socials}
          />

          {/* Age */}
          {createdAt && (
            <>
              <span className="text-neutral-700">·</span>
              <NCoinAge
                className="shrink-0 text-neutral-500 text-xs"
                imgClassName="size-3"
                inline
                value={createdAt}
              />
            </>
          )}

          {/* Viewers */}
          {viewersCount > 0 && (
            <>
              <span className="text-neutral-700">·</span>
              <div className="flex shrink-0 items-center gap-1 text-neutral-500">
                <Icon name={bxShow} size={13} />
                <span className="font-medium text-[11px]">
                  {formatViewers(viewersCount)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Risk Indicators - Right (Single Row, Max 3) */}
      {riskIndicators.length > 0 && (
        <div className="flex shrink-0 items-center gap-1">
          {riskIndicators.slice(0, 3).map(indicator => (
            <div
              className="flex h-[44px] w-[38px] flex-col items-center justify-center gap-0.5"
              key={indicator.key}
            >
              <div className="flex items-center gap-0.5">
                <indicator.Icon className="h-2.5 w-2.5 shrink-0 text-red-500" />
                <span className="font-medium text-[7px] text-red-500 leading-none">
                  {indicator.label}
                </span>
              </div>
              <span className="font-bold text-[9px] text-red-500 leading-none">
                {indicator.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Logo Expansion Dialog */}
      {dialog}
    </div>
  );
}
