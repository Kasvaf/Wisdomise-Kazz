import { useMetaDetailsQuery } from 'api/meta';
import type { TrenchStreamResponseResult } from 'api/proto/network_radar';
import { bxGroup, bxPauseCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import NCoinTransactions from 'modules/discovery/ListView/NetworkRadar/NCoinTransactions';
import { MetaNarrative } from 'modules/discovery/PageMeta/MetaList';
import {
  type FC,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';
import Spin from 'shared/v1-components/Spin';
import { Token, TokenLink } from 'shared/v1-components/Token';
import { useInterval, useSessionStorage } from 'usehooks-ts';
import {
  calcNCoinBCurveColor,
  calcNCoinMarketCapColor,
  type NetworkRadarTab,
} from './lib';
import { ReactComponent as MetaIcon } from './meta.svg';
import { NCoinAge } from './NCoinAge';
import { NCoinSecurity } from './NCoinSecurity';
import { NCoinTokenInsight } from './NCoinTokenInsight';

const NCoinMarketDataCol: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
  row?: boolean;
}> = memo(
  ({ className, value, row }) => (
    <div
      className={clsx(
        'flex gap-1',
        !row && 'flex-col items-end justify-center',
        row && 'flex-row-reverse items-center justify-start',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <div className="flex items-center" title="Volume">
          <span className="mr-1 align-middle text-[0.9em] text-v1-content-secondary">
            {'V'}
          </span>
          <ReadableNumber
            className="align-middle"
            format={{
              decimalLength: 1,
            }}
            label="$"
            popup="never"
            value={+(value.networkData?.volume ?? '0') || 0}
          />
        </div>
        <div
          style={{
            color: calcNCoinMarketCapColor(
              +(value.networkData?.marketCap ?? '0') || 0,
            ),
          }}
          title="Market Cap"
        >
          <span className="me-1 align-middle text-[0.9em] text-v1-content-secondary">
            {'MC'}
          </span>
          <ReadableNumber
            className="align-middle font-medium text-base"
            format={{
              decimalLength: 1,
            }}
            label="$"
            popup="never"
            value={+(value.networkData?.marketCap ?? '0') || 0}
          />
        </div>
      </div>
      {!row && (
        <div className="flex items-center gap-1">
          <div className="flex items-center" title="Transactions">
            <span className="me-1 align-middle text-[0.9em] text-v1-content-secondary">
              {'TX'}
            </span>
            <NCoinTransactions
              value={{
                buys: value.networkData?.totalBuy,
                sells: value.networkData?.totalSell,
              }}
            />
          </div>
          <div title="Number of Holders">
            <Icon
              className="me-1 inline-block align-middle text-v1-content-secondary"
              name={bxGroup}
              size={16}
              strokeWidth={0.1}
            />
            <ReadableNumber
              className="align-middle"
              popup="never"
              value={value.validatedData?.numberOfHolders}
            />
          </div>
        </div>
      )}
    </div>
  ),
  (prev, current) => {
    if (
      prev.value.networkData?.volume !== current.value.networkData?.volume ||
      prev.value.networkData?.marketCap !==
        current.value.networkData?.marketCap ||
      prev.value.networkData?.totalBuy !==
        current.value.networkData?.totalBuy ||
      prev.value.networkData?.totalSell !==
        current.value.networkData?.totalSell ||
      prev.value.validatedData?.numberOfHolders !==
        current.value.validatedData?.numberOfHolders ||
      prev.value.validatedData?.numberOfHolders !==
        current.value.validatedData?.numberOfHolders ||
      prev.className !== current.className
    )
      return false;
    return true;
  },
);

export const NCoinBCurve: FC<{
  value?: number;
  className?: string;
}> = memo(
  ({ value, className }) => {
    return (
      <div
        className={className}
        style={{
          color: calcNCoinBCurveColor({
            bCurvePercent: (value ?? 0) * 100,
          }),
        }}
        title="Bonding Curve"
      >
        <ReadableNumber
          className="font-medium"
          format={{
            decimalLength: 0,
          }}
          label="%"
          popup="never"
          value={(value ?? 0) * 100}
        />
      </div>
    );
  },
  (prev, current) =>
    !(prev.value !== current.value || prev.className !== current.className),
);

const NCoinAgeAndSecurity: FC<{ lpBurned?: boolean; createdAt?: string }> =
  memo(({ lpBurned, createdAt }) => (
    <>
      <NCoinSecurity
        imgClassName="size-4"
        type="row"
        value={{
          lpBurned: lpBurned ?? false,
        }}
      />
      <NCoinAge
        className="text-xs"
        imgClassName="hidden"
        inline
        value={createdAt}
      />
    </>
  ));

export const NCoinList: FC<{
  dataSource: TrenchStreamResponseResult[];
  title?: ReactNode;
  titleSuffix?: ReactNode;
  className?: string;
  loading?: boolean;
  mini?: boolean;
  source: 'new_pairs' | 'final_stretch' | 'migrated';
}> = ({
  dataSource: _dataSource,
  title,
  titleSuffix,
  loading,
  className,
  mini,
  source,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [, setTab] = useSessionStorage<NetworkRadarTab | null>(
    'last-trench-tab',
    null,
  );

  const [dataSource, setDataSource] = useState(_dataSource);
  const [shown, setShown] = useState<Set<string>>(
    new Set(dataSource.map(x => x.symbol?.slug ?? '')),
  );
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

  const autoSetHovered = useCallback(() => {
    setHovered(listRef.current?.matches?.(':hover') ?? false);
  }, []);

  useInterval(autoSetHovered, 5000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (hovered) {
      setDataSource(p => {
        let ret: typeof p = [...p];
        const seen = new Set<string>(p.map(x => x.symbol?.slug ?? ''));
        for (const element of _dataSource) {
          const key = element.symbol?.slug ?? '';
          if (seen.has(key)) {
            const idx = ret.findIndex(x => x.symbol?.slug === key);
            ret = [...ret.slice(0, idx), element, ...ret.slice(idx + 1)];
          }
        }
        return ret;
      });
    } else {
      setDataSource(() => {
        const ret: TrenchStreamResponseResult[] = [];
        const seen = new Set<string>();
        for (const element of _dataSource) {
          const key = element.symbol?.slug ?? '';
          if (!seen.has(key)) {
            ret.push(element);
            seen.add(key);
          }
        }
        return ret;
      });
    }
  }, [_dataSource, dataSource.length, hovered]);

  useEffect(() => {
    setShown(new Set(dataSource.map(x => x.symbol?.slug ?? '')));
  }, [dataSource]);

  return (
    <div
      className={clsx(
        'scrollbar-none flex flex-col gap-3 overflow-auto rounded-lg',
        className,
      )}
    >
      {title && (
        <div
          className="scrollbar-none sticky top-0 z-10 flex shrink-0 items-center gap-2 overflow-auto whitespace-nowrap rounded-lg bg-v1-surface-l-next px-3 py-2 text-sm shadow-xl"
          onMouseEnter={autoSetHovered}
          onMouseLeave={autoSetHovered}
        >
          <div
            className={clsx(
              hovered ? 'pointer-events-none opacity-100' : 'opacity-0',
              'absolute inset-0 size-full bg-v1-background-brand/10 transition-all',
            )}
          />
          <h3 className="relative">{title}</h3>
          {loading && <Spin />}
          <div
            className={clsx(
              'flex items-center gap-1 text-v1-content-brand text-xs transition-all',
              !hovered && 'hidden',
            )}
          >
            <Icon name={bxPauseCircle} size={18} />
          </div>
          {titleSuffix && (
            <div className="relative flex w-auto shrink-0 grow items-center justify-end gap-2">
              {titleSuffix}
            </div>
          )}
        </div>
      )}
      {dataSource.length === 0 && !loading ? (
        <p className="p-3 text-center text-v1-content-secondary text-xs leading-relaxed">
          {t('common:nothing-to-show')}
        </p>
      ) : (
        <div
          className="flex flex-col gap-3"
          onMouseEnter={autoSetHovered}
          onMouseLeave={autoSetHovered}
          ref={listRef}
        >
          {dataSource.map(row => {
            const ageAndSecurity = (
              <NCoinAgeAndSecurity
                createdAt={row.symbol?.createdAt}
                lpBurned={row.securityData?.lpBurned}
              />
            );

            const bCurve = (
              <>
                {source !== 'migrated' && (
                  <NCoinBCurve
                    className="pe-1 text-xs"
                    value={row.networkData?.boundingCurve}
                  />
                )}
              </>
            );

            return (
              <div key={row.symbol?.slug ?? ''} onClick={() => setTab(source)}>
                <TokenLink
                  address={row.symbol?.base}
                  className={clsx(
                    'group relative flex max-w-full cursor-pointer rounded-lg bg-v1-surface-l-next p-2 transition-all hover:brightness-110',
                    mini
                      ? 'flex-col justify-start gap-2'
                      : 'items-center justify-between',
                    shown.has(row.symbol?.slug ?? '')
                      ? 'translate-y-0 opacity-100'
                      : '-translate-y-14 opacity-0',
                  )}
                >
                  {source === 'final_stretch' &&
                    row.networkData?.boundingCurve === 1 && (
                      <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                        <div className="-mt-14 h-36 w-64 rounded-b-3xl bg-gradient-to-b from-v1-background-brand to-transparent opacity-20 blur-2xl" />
                      </div>
                    )}
                  <div className="relative flex flex-col gap-1">
                    <Token
                      abbreviation={row.symbol?.abbreviation}
                      address={row.symbol?.base}
                      extra={
                        !mini && (
                          <div className="flex flex-col justify-end gap-1">
                            <div className="flex h-6 items-center gap-2">
                              {!mini && bCurve}
                              {row.meta && (
                                <MetaTag
                                  id={row.meta.id}
                                  mini={mini}
                                  title={row.meta.title}
                                />
                              )}
                            </div>
                            <NCoinTokenInsight
                              value={{
                                ...row.validatedData,
                                ...row.securityData,
                              }}
                            />
                          </div>
                        )
                      }
                      header={ageAndSecurity}
                      link={false}
                      logo={row.symbol?.imageUrl}
                      marker={row.validatedData?.protocol?.logo}
                      name={row.symbol?.name}
                      progress={
                        source === 'migrated'
                          ? undefined
                          : (row.networkData?.boundingCurve ?? 1)
                      }
                      size={mini ? 'md' : 'lg'}
                      slug={row.symbol?.slug}
                      socials={row.socials}
                      truncate={!!mini}
                    />
                  </div>
                  <div
                    className={clsx(
                      mini
                        ? 'flex items-center text-2xs'
                        : 'absolute end-2 top-2 flex h-full flex-col text-xs',
                    )}
                  >
                    {mini && bCurve}
                    <NCoinMarketDataCol
                      className={clsx()}
                      row={mini}
                      value={row}
                    />
                  </div>
                  {mini && (
                    <NCoinTokenInsight
                      value={{ ...row.validatedData, ...row.securityData }}
                    />
                  )}
                  {row.symbol && (
                    <BtnQuickBuy
                      className="!absolute !hidden group-hover:!flex right-2 bottom-2"
                      slug={row.symbol.slug}
                      source={source}
                      tokenAddress={row.symbol.base}
                    />
                  )}
                </TokenLink>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MetaTag = ({
  id,
  title,
  mini,
}: {
  id: number;
  title: string;
  mini?: boolean;
}) => {
  const [enabled, setEnabled] = useState(false);
  const { data: meta, isLoading } = useMetaDetailsQuery({ id, enabled });

  return (
    <HoverTooltip
      onOpenChange={() => setEnabled(true)}
      title={
        isLoading ? (
          'Loading'
        ) : (
          <div className="h-80 overflow-auto">
            {meta && <MetaNarrative meta={meta} mode="dialog" />}
          </div>
        )
      }
    >
      <Badge
        className={clsx(mini && 'pr-0')}
        color="secondary"
        size="sm"
        variant="solid"
      >
        <MetaIcon className="!-ml-0.5" />
        {!mini && title}
      </Badge>
    </HoverTooltip>
  );
};
