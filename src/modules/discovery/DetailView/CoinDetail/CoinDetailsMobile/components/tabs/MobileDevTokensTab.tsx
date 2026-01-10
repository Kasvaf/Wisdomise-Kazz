import { bxChevronDown, bxChevronUp, bxSortAlt2 } from 'boxicons-quasar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { useMemo, useState } from 'react';
import { useDevTokensQuery } from 'services/rest/dev-tokens';
import { formatNumber } from 'utils/numbers';
import { useUnifiedCoinDetails } from '../../../lib';

dayjs.extend(relativeTime);

export function MobileDevTokensTab() {
  const [mcSortOrder, setMcSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showDevStats, setShowDevStats] = useState(false);

  const { developer } = useUnifiedCoinDetails();
  const { data: devTokens, isPending: devTokensLoading } = useDevTokensQuery({
    devAddress: developer?.address,
  });

  // Dev Tokens computed values
  const migratedCount = devTokens?.migrated_count ?? 0;
  const totalCount = devTokens?.total_count ?? 0;
  const migratedPercentage = totalCount
    ? (migratedCount / totalCount) * 100
    : 0;

  const topMCToken = useMemo(() => {
    return devTokens?.tokens?.reduce((current, token) => {
      return +current.market_cap_usd > +token.market_cap_usd ? current : token;
    });
  }, [devTokens?.tokens]);

  const lastLaunchedToken = useMemo(() => {
    return devTokens?.tokens?.reduce((latest, token) => {
      return new Date(token.created_at) > new Date(latest.created_at)
        ? token
        : latest;
    });
  }, [devTokens?.tokens]);

  const sortedTokens = useMemo(() => {
    if (!devTokens?.tokens) return [];
    const sorted = [...devTokens.tokens];
    if (mcSortOrder) {
      sorted.sort((a, b) => {
        const mcA = +a.market_cap_usd;
        const mcB = +b.market_cap_usd;
        return mcSortOrder === 'asc' ? mcA - mcB : mcB - mcA;
      });
    }
    return sorted;
  }, [devTokens?.tokens, mcSortOrder]);

  const handleMCSort = () => {
    if (mcSortOrder === null) {
      setMcSortOrder('desc');
    } else if (mcSortOrder === 'desc') {
      setMcSortOrder('asc');
    } else {
      setMcSortOrder(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[400px]">
        {/* Stats Header */}
        <div
          className="sticky top-0 z-20 cursor-pointer border-v1-border-tertiary border-b bg-v1-surface-l1 px-3 py-2"
          onClick={() => setShowDevStats(!showDevStats)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[10px] text-white">
                Migration: {migratedCount}/{totalCount} (
                {formatNumber(migratedPercentage, {
                  compactInteger: false,
                  separateByComma: false,
                  decimalLength: 2,
                  minifyDecimalRepeats: false,
                })}
                %)
              </span>
              <Icon
                className="text-neutral-600"
                name={showDevStats ? bxChevronUp : bxChevronDown}
                size={12}
              />
            </div>
          </div>

          {showDevStats && (
            <div className="mt-2 space-y-1 text-[9px] text-neutral-600">
              <div className="flex items-center gap-1">
                <span className="inline-block size-1.5 rounded-full bg-v1-content-positive" />
                <span>Migrated: {migratedCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block size-1.5 rounded-full bg-v1-content-negative" />
                <span>Non-migrated: {totalCount - migratedCount}</span>
              </div>
              {topMCToken && (
                <div className="mt-1 border-v1-border-tertiary border-t pt-1">
                  <span>
                    Top MC: {topMCToken.name} ($
                    {formatNumber(+topMCToken.market_cap_usd, {
                      compactInteger: true,
                      separateByComma: false,
                      decimalLength: 2,
                      minifyDecimalRepeats: false,
                    })}
                    )
                  </span>
                </div>
              )}
              {lastLaunchedToken && (
                <div>
                  <span>
                    Last Launch: {dayjs(lastLaunchedToken.created_at).fromNow()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table Header */}
        <div className="sticky top-[36px] z-10 grid grid-cols-[minmax(120px,140px)_60px_minmax(70px,85px)_minmax(70px,85px)] gap-1 border-v1-border-tertiary border-b bg-v1-background-primary px-2 py-1.5 font-medium text-[9px] text-neutral-600">
          <div>Token</div>
          <div className="text-center">Migr</div>
          <Button
            className="!p-0 !text-neutral-600 hover:!text-white flex items-center justify-end gap-0.5"
            onClick={handleMCSort}
            size="3xs"
            variant="ghost"
          >
            <span>MC</span>
            <Icon name={bxSortAlt2} size={10} />
          </Button>
          <div className="text-right">1h Vol</div>
        </div>

        {/* Loading State */}
        {devTokensLoading && (
          <div className="flex items-center justify-center py-8">
            <span className="text-[10px] text-neutral-600">Loading...</span>
          </div>
        )}

        {/* Empty State - No Developer */}
        {!developer?.address && !devTokensLoading && (
          <div className="flex items-center justify-center py-8">
            <span className="text-[10px] text-neutral-600">
              Developer information not available
            </span>
          </div>
        )}

        {/* Empty State - No Tokens */}
        {developer?.address &&
          !devTokensLoading &&
          sortedTokens.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <span className="text-[10px] text-neutral-600">
                No dev tokens found
              </span>
            </div>
          )}

        {/* Tokens List */}
        {!devTokensLoading &&
          sortedTokens.map(token => (
            <div
              className="grid grid-cols-[minmax(120px,140px)_60px_minmax(70px,85px)_minmax(70px,85px)] items-center gap-1 border-v1-background-primary border-b px-2 py-1.5 transition-colors hover:bg-v1-background-primary"
              key={token.contract_address}
            >
              {/* Token */}
              <div className="flex items-center gap-1.5">
                {token.image_uri ? (
                  <img
                    alt={token.symbol}
                    className="h-6 w-6 rounded-full object-cover"
                    src={token.image_uri}
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-v1-surface-l2">
                    <span className="font-bold text-[8px] text-white">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-[10px] text-white">
                    {token.symbol}
                  </span>
                  <span className="truncate text-[8px] text-neutral-600">
                    {token.name}
                  </span>
                </div>
              </div>

              {/* Migrated */}
              <div className="flex items-center justify-center gap-0.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    token.is_migrated
                      ? 'bg-v1-content-positive'
                      : 'bg-v1-content-negative'
                  }`}
                />
                <span
                  className={`text-[9px] ${
                    token.is_migrated
                      ? 'text-v1-content-positive'
                      : 'text-v1-content-negative'
                  }`}
                >
                  {token.is_migrated ? 'Y' : 'N'}
                </span>
              </div>

              {/* Market Cap */}
              <div className="text-right">
                <span className="font-mono text-[10px] text-white">
                  $
                  {formatNumber(+token.market_cap_usd, {
                    compactInteger: true,
                    separateByComma: false,
                    decimalLength: 2,
                    minifyDecimalRepeats: false,
                  })}
                </span>
              </div>

              {/* 1h Volume */}
              <div className="text-right">
                <span className="font-mono text-[10px] text-neutral-600">
                  $
                  {formatNumber(+token.volume_1h_usd, {
                    compactInteger: true,
                    separateByComma: false,
                    decimalLength: 2,
                    minifyDecimalRepeats: false,
                  })}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
