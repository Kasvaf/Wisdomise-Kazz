import { clsx } from 'clsx';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReactComponent as Top10HoldersHolding } from './top_10_holders_holding.svg';
import { ReactComponent as DevHolding } from './dev_holding.svg';
import { ReactComponent as SnipersHolding } from './snipers_holding.svg';
import { ReactComponent as InsidersHolding } from './insiders_holding.svg';
import { ReactComponent as BundleHolding } from './bundle_holding.svg';

export const NCoinTokenInsight: FC<{
  className?: string;
  imgClassName?: string;
  value?: {
    top10Holding?: number;
    snipersHolding?: number;
    numberOfHolders?: number;
    insiderHolding?: number;
    devHolding?: number;
    boundleHolding?: number;
  };
  type: 'row' | 'card';
}> = ({ type, className, imgClassName, value }) => {
  const { t } = useTranslation('network-radar');

  const items = useMemo<
    Array<{
      key: string;
      icon: FC<{ className?: string }>;
      value: number | undefined;
      title: string;
      fullTitle: string;
      color: 'green' | 'gray' | 'red';
    }>
  >(
    () => [
      {
        key: 'top_10_holders_holding',
        icon: Top10HoldersHolding,
        value: value?.top10Holding,
        title: t('network-radar:token_insight.top_10_holders_holding.mini'),
        fullTitle: t('network-radar:token_insight.top_10_holders_holding.full'),
        color:
          typeof value?.top10Holding === 'number'
            ? (value?.top10Holding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'dev_holding',
        icon: DevHolding,
        value: value?.devHolding,
        title: t('network-radar:token_insight.dev_holding.mini'),
        fullTitle: t('network-radar:token_insight.dev_holding.full'),
        color:
          typeof value?.devHolding === 'number'
            ? (value?.devHolding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'snipers_holding',
        icon: SnipersHolding,
        value: value?.snipersHolding,
        title: t('network-radar:token_insight.snipers_holding.mini'),
        fullTitle: t('network-radar:token_insight.snipers_holding.full'),
        color:
          typeof value?.snipersHolding === 'number'
            ? (value?.snipersHolding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'insiders_holding',
        icon: InsidersHolding,
        value: value?.insiderHolding,
        title: t('network-radar:token_insight.insiders_holding.mini'),
        fullTitle: t('network-radar:token_insight.insiders_holding.full'),
        color:
          typeof value?.insiderHolding === 'number'
            ? (value?.insiderHolding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
      {
        key: 'bundle_holding',
        icon: BundleHolding,
        value: value?.boundleHolding,
        title: t('network-radar:token_insight.bundle_holding.mini'),
        fullTitle: t('network-radar:token_insight.bundle_holding.full'),
        color:
          typeof value?.boundleHolding === 'number'
            ? (value?.boundleHolding ?? 0) < 15
              ? 'green'
              : 'red'
            : 'gray',
      },
    ],
    [value, t],
  );

  return (
    <>
      {type === 'row' ? (
        <div
          className={clsx(
            'flex items-center gap-1',
            !value && 'animate-pulse',
            className,
          )}
        >
          {items.map(item => (
            <HoverTooltip key={item.key} title={item.fullTitle}>
              <div
                className={clsx(
                  'relative flex shrink-0 items-center justify-start gap-px',
                  item.color === 'green'
                    ? 'text-v1-background-positive'
                    : item.color === 'red'
                    ? 'text-v1-background-negative'
                    : 'opacity-80',
                )}
              >
                <item.icon
                  className={clsx(
                    item.color === 'green'
                      ? 'stroke-v1-background-positive-subtle'
                      : item.color === 'red'
                      ? 'stroke-v1-background-negative-subtle'
                      : '',
                    'size-4',
                    imgClassName,
                  )}
                />{' '}
                <ReadableNumber
                  value={item.value}
                  format={{ decimalLength: 1 }}
                  popup="never"
                  emptyText=""
                />
                %
              </div>
            </HoverTooltip>
          ))}
        </div>
      ) : (
        <div
          className={clsx(
            'rounded-lg p-3 text-xs bg-v1-surface-l-next',
            className,
          )}
        >
          <p className="mb-3 font-normal">
            {t('network-radar:token_insight.title')}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {items.map(item => (
              <HoverTooltip key={item.key} title={item.fullTitle}>
                <div className={clsx('flex flex-col gap-1')}>
                  <p className="text-xxs text-v1-content-secondary">
                    {item.title}
                  </p>

                  <div
                    className={clsx(
                      'relative flex shrink-0 items-center justify-start gap-1',
                      item.color === 'green'
                        ? 'text-v1-background-positive'
                        : item.color === 'red'
                        ? 'text-v1-background-negative'
                        : 'opacity-80',
                    )}
                  >
                    <item.icon
                      className={clsx(
                        item.color === 'green'
                          ? 'stroke-v1-background-positive-subtle'
                          : item.color === 'red'
                          ? 'stroke-v1-background-negative-subtle'
                          : '',
                        'size-5',
                        imgClassName,
                      )}
                    />
                    <ReadableNumber
                      value={item.value}
                      label="%"
                      format={{ decimalLength: 1 }}
                      popup="never"
                    />
                  </div>
                </div>
              </HoverTooltip>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
