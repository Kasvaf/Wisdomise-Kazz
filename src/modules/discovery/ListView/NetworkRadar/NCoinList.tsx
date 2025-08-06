/* eslint-disable import/max-dependencies */
import { type ReactNode, type FC, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxPauseCircle } from 'boxicons-quasar';
import { type TrenchStreamResponseResult } from 'api/proto/network_radar';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { Coin } from 'shared/v1-components/Coin';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import { NCoinAge } from './NCoinAge';
import { NCoinSecurity } from './NCoinSecurity';
import { NCoinTokenInsight } from './NCoinTokenInsight';
import { NCoinBuySell } from './NCoinBuySell';
import { calcNCoinBCurveColor, calcNCoinMarketCapColor } from './lib';

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
    >
      <span className="text-[0.9em] text-v1-content-secondary">{'MC '}</span>
      <ReadableNumber
        popup="never"
        value={+(value.networkData?.marketCap ?? '0') || 0}
        label="$"
        className="align-middle text-[1.35em] font-medium"
        format={{
          decimalLength: 2,
        }}
      />
    </div>
    <div>
      <span className="text-[0.9em] text-v1-content-secondary">{'V '}</span>
      <ReadableNumber
        popup="never"
        value={+(value.networkData?.volume ?? '0') || 0}
        label="$"
        format={{
          decimalLength: 2,
        }}
      />
    </div>
    {!row && (
      <>
        <div>
          <span className="text-[0.9em] text-v1-content-secondary">
            {'TX '}
          </span>
          <NCoinBuySell
            value={{
              buys: value.networkData?.totalBuy,
              sells: value.networkData?.totalSell,
            }}
          />
        </div>
        <div>
          <span className="text-[0.9em] text-v1-content-secondary">
            {'# of Holders '}
          </span>
          <ReadableNumber
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
}> = ({ value }) => {
  return (
    <div
      style={{
        color: calcNCoinBCurveColor({
          bCurvePercent: (value.networkData?.boundingCurve ?? 0) * 100,
        }),
      }}
    >
      <span className="text-[0.9em] text-v1-content-secondary">
        {'B Curve '}
      </span>
      <ReadableNumber
        popup="never"
        value={(value.networkData?.boundingCurve ?? 0) * 100}
        label="%"
        className="font-medium"
        format={{
          decimalLength: 1,
        }}
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
      setDataSource(p => {
        const ret: typeof p = [];
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
        'flex flex-col gap-3 overflow-auto rounded-lg scrollbar-none',
        className,
      )}
    >
      {title && (
        <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 overflow-auto whitespace-nowrap rounded-lg px-3 py-2 text-sm shadow-xl bg-v1-surface-l-next scrollbar-none">
          <div
            className={clsx(
              hovered ? 'pointer-events-none opacity-100' : 'opacity-0',
              'absolute inset-0 size-full bg-v1-background-brand/10 transition-all',
            )}
          />
          <h3 className="relative">{title}</h3>
          <div
            className={clsx(
              'flex items-center gap-1 text-xs text-v1-content-info transition-all',
              !hovered && 'pointer-events-none opacity-0',
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
      {loading ? (
        <p className="animate-pulse p-3 text-center text-xs text-v1-content-secondary">
          {t('common:almost-there')}
        </p>
      ) : dataSource.length === 0 ? (
        <p className="p-3 text-center text-xs leading-relaxed text-v1-content-secondary">
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
                  type="row"
                  imgClassName="size-4"
                  value={{
                    lpBurned: row.securityData?.lpBurned ?? false,
                  }}
                />
                <NCoinAge
                  value={row.symbol?.createdAt}
                  inline
                  className="ms-1 text-xs"
                  imgClassName="hidden"
                />
              </>
            );

            const bCurve = (
              <>{source !== 'migrated' && <NCoinBCurve value={row} />}</>
            );
            return (
              <button
                key={row.symbol?.slug ?? ''}
                className={clsx(
                  'group relative flex max-w-full rounded-lg p-2 transition-all bg-v1-surface-l-next hover:brightness-110',
                  mini
                    ? 'flex-col justify-start gap-2'
                    : 'items-center justify-between',
                  shown.has(row.symbol?.slug ?? '')
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-14 opacity-0',
                )}
                type="button"
                onClick={() =>
                  row.symbol?.slug && onRowClick?.(row.symbol.slug)
                }
              >
                {source === 'final_stretch' &&
                  row.networkData?.boundingCurve === 1 && (
                    <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                      <div className="-mt-28 h-36 w-64 rounded-b-3xl bg-gradient-to-b from-[#00FFA3] to-[#00A3FF]  opacity-45 blur-2xl" />
                    </div>
                  )}
                <div className="relative flex flex-col gap-1 overflow-hidden">
                  <Coin
                    abbreviation={row.symbol?.abbreviation}
                    name={row.symbol?.name}
                    slug={row.symbol?.slug}
                    logo={row.symbol?.imageUrl}
                    size={mini ? 'md' : 'lg'}
                    links={{
                      twitter_screen_name: row.socials?.twitter,
                      telegram_channel_identifier: row.socials?.telegram,
                      homepage: row.socials?.website
                        ? [row.socials?.website]
                        : [],
                    }}
                    marker={row.validatedData?.protocol?.logo}
                    progress={
                      source === 'migrated'
                        ? undefined
                        : row.networkData?.boundingCurve ?? 1
                    }
                    progressTitle="Bounding Curve: "
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
                    customLabels={ageAndSecurity}
                    extra={
                      <>
                        {!mini && bCurve}
                        <NCoinTokenInsight
                          key="ins"
                          value={row.validatedData}
                          type="row"
                          imgClassName="size-2"
                          className={mini ? 'text-xxs ' : 'text-xs'}
                        />
                      </>
                    }
                    href={false}
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
                    value={row}
                    className={clsx()}
                    row={mini}
                  />
                </div>
                {row.symbol && (
                  <BtnQuickBuy
                    slug={row.symbol.slug}
                    source={source}
                    className="absolute bottom-0 right-0 hidden group-hover:flex"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
