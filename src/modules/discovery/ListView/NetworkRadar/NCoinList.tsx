import type { TrenchStreamResponseResult } from 'api/proto/network_radar';
import { bxGroup, bxLoader, bxPauseCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/v1-components/Coin';
import { calcNCoinBCurveColor, calcNCoinMarketCapColor } from './lib';
import { NCoinAge } from './NCoinAge';
import { NCoinBuySell } from './NCoinBuySell';
import { NCoinSecurity } from './NCoinSecurity';
import { NCoinTokenInsight } from './NCoinTokenInsight';

const NCoinMarketDataCol: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
  row?: boolean;
}> = ({ className, value, row }) => (
  <div
    className={clsx(
      'flex gap-1',
      !row && 'flex-col items-end justify-center',
      row && 'flex-row-reverse items-center justify-start',
      className,
    )}
  >
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
        className="align-middle font-medium text-[1.35em]"
        format={{
          decimalLength: 2,
        }}
        label="$"
        popup="never"
        value={+(value.networkData?.marketCap ?? '0') || 0}
      />
    </div>
    <div title="Volume">
      <span className="mr-1 align-middle text-[0.9em] text-v1-content-secondary">
        {'V'}
      </span>
      <ReadableNumber
        className="align-middle"
        format={{
          decimalLength: 2,
        }}
        label="$"
        popup="never"
        value={+(value.networkData?.volume ?? '0') || 0}
      />
    </div>
    {!row && (
      <>
        <div title="Transactions">
          <span className="me-1 align-middle text-[0.9em] text-v1-content-secondary">
            {'TX'}
          </span>
          <NCoinBuySell
            className="align-middle"
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
      </>
    )}
  </div>
);

const NCoinBCurve: FC<{
  value: TrenchStreamResponseResult;
  className?: string;
}> = ({ value, className }) => {
  return (
    <div
      className={className}
      style={{
        color: calcNCoinBCurveColor({
          bCurvePercent: (value.networkData?.boundingCurve ?? 0) * 100,
        }),
      }}
      title="Bonding Curve"
    >
      <ReadableNumber
        className="font-medium"
        format={{
          decimalLength: 1,
        }}
        label="%"
        popup="never"
        value={(value.networkData?.boundingCurve ?? 0) * 100}
      />
    </div>
  );
};

export const NCoinList: FC<{
  dataSource: TrenchStreamResponseResult[];
  title?: ReactNode;
  titleSuffix?: ReactNode;
  className?: string;
  loading?: boolean;
  mini?: boolean;
  onRowClick?: (slug: string) => void;
  source: 'new_pairs' | 'final_stretch' | 'migrated';
}> = ({
  dataSource: _dataSource,
  title,
  titleSuffix,
  loading,
  className,
  mini,
  onRowClick,
  source,
}) => {
  const [dataSource, setDataSource] = useState(_dataSource);
  const [shown, setShown] = useState<Set<string>>(
    new Set(dataSource.map(x => x.symbol?.slug ?? '')),
  );
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

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
          onPointerEnter={() => setHovered(false)}
        >
          <div
            className={clsx(
              hovered ? 'pointer-events-none opacity-100' : 'opacity-0',
              'absolute inset-0 size-full bg-v1-background-brand/10 transition-all',
            )}
          />
          <h3 className="relative">{title}</h3>
          <div
            className={clsx(
              'flex animate-spin items-center gap-1 text-v1-content-secondary text-xs',
              !loading && 'hidden',
            )}
          >
            <Icon name={bxLoader} size={18} />
          </div>
          <div
            className={clsx(
              'flex items-center gap-1 text-v1-content-info text-xs transition-all',
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
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {dataSource.map(row => {
            const ageAndSecurity = (
              <>
                <NCoinSecurity
                  imgClassName="size-4"
                  type="row"
                  value={{
                    lpBurned: row.securityData?.lpBurned ?? false,
                  }}
                />
                <NCoinAge
                  className="ms-1 text-xs"
                  imgClassName="hidden"
                  inline
                  value={row.symbol?.createdAt}
                />
              </>
            );

            const bCurve = (
              <>
                {source !== 'migrated' && (
                  <NCoinBCurve className="pe-1 text-xs" value={row} />
                )}
              </>
            );
            return (
              <div
                className={clsx(
                  'group relative flex max-w-full cursor-pointer rounded-lg bg-v1-surface-l-next p-2 transition-all hover:brightness-110',
                  mini
                    ? 'flex-col justify-start gap-2'
                    : 'items-center justify-between',
                  shown.has(row.symbol?.slug ?? '')
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-14 opacity-0',
                )}
                key={row.symbol?.slug ?? ''}
                onClick={() =>
                  row.symbol?.slug && onRowClick?.(row.symbol.slug)
                }
              >
                {source === 'final_stretch' &&
                  row.networkData?.boundingCurve === 1 && (
                    <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                      <div className="-mt-28 h-36 w-64 rounded-b-3xl bg-gradient-to-b from-[#00FFA3] to-[#00A3FF] opacity-45 blur-2xl" />
                    </div>
                  )}
                <div className="relative flex flex-col gap-1 overflow-hidden">
                  <Coin
                    abbreviation={row.symbol?.abbreviation}
                    customLabels={ageAndSecurity}
                    extra={
                      <>
                        {!mini && bCurve}
                        <NCoinTokenInsight
                          className={mini ? 'text-xxs' : 'text-xs'}
                          imgClassName="size-2"
                          key="ins"
                          type="row"
                          value={row.validatedData}
                        />
                      </>
                    }
                    href={false}
                    links={{
                      twitter_screen_name: row.socials?.twitter,
                      telegram_channel_identifier: row.socials?.telegram,
                      homepage: row.socials?.website
                        ? [row.socials?.website]
                        : [],
                    }}
                    logo={row.symbol?.imageUrl}
                    marker={row.validatedData?.protocol?.logo}
                    name={row.symbol?.name}
                    networks={[
                      {
                        contract_address: row.symbol?.base ?? '---',
                        network: {
                          slug: 'solana',
                          icon_url: '',
                          name: 'Solana',
                        },
                        symbol_network_type: 'TOKEN',
                      },
                    ]}
                    progress={
                      source === 'migrated'
                        ? undefined
                        : (row.networkData?.boundingCurve ?? 1)
                    }
                    progressTitle="Bounding Curve: "
                    size={mini ? 'md' : 'lg'}
                    slug={row.symbol?.slug}
                    truncate={!!mini}
                  />
                </div>
                <div
                  className={clsx(
                    mini
                      ? 'flex items-center justify-between text-xxs'
                      : 'absolute end-2 flex h-full flex-col justify-center text-xs',
                  )}
                >
                  {mini && bCurve}
                  <NCoinMarketDataCol
                    className={clsx()}
                    row={mini}
                    value={row}
                  />
                </div>
                {row.symbol && (
                  <BtnQuickBuy
                    className="!absolute !hidden group-hover:!flex right-2 bottom-2"
                    slug={row.symbol.slug}
                    source={source}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
