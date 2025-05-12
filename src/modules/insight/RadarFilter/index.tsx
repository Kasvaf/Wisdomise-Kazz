/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxGridAlt, bxSliderAlt } from 'boxicons-quasar';
import { CategorySelect } from 'shared/CategorySelect';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { CoinLabelSelect } from 'shared/CoinLabelSelect';
import { ExchangeSelect } from 'shared/ExchangeSelect';
import {
  type useNetworks,
  type useSocialRadarCoins,
  type useTechnicalRadarCoins,
  type useWhaleRadarCoins,
} from 'api';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { type Surface } from 'utils/useSurface';
import useIsMobile from 'utils/useIsMobile';
import { Dialog } from 'shared/v1-components/Dialog';
import {
  socialPresetFilters,
  technicalPresetFilters,
  whalePresetFilters,
} from './presetFilters';
import { SocialRadarSourceSelect } from './SocialRadarSourceSelect';

type RadarFilterValue = Partial<
  Parameters<typeof useSocialRadarCoins>[0] &
    Parameters<typeof useWhaleRadarCoins>[0] &
    Parameters<typeof useTechnicalRadarCoins>[0]
>;

const areEqual = (first: string[], second: string[]) =>
  first.length === second.length && first.every(x => second.includes(x));

export function RadarFilter({
  radar,
  className,
  onChange,
  value,
  surface,
  mini,
}: {
  className?: string;
  onReset?: () => void;
  value: RadarFilterValue;
  onChange?: (v?: RadarFilterValue) => void;
  surface: Surface;
  // TODO radar type could be different from filter type
  radar: NonNullable<Parameters<typeof useNetworks>['0']>['filter'];
  mini?: boolean;
}) {
  const { t } = useTranslation('coin-radar');
  const isMobile = useIsMobile();
  const isMini = typeof mini === 'boolean' ? mini : isMobile;
  const [open, setOpen] = useState(false);
  const [localState, setLocalState] = useState(value);

  const presetFilters =
    radar === 'social-radar-24-hours'
      ? socialPresetFilters
      : radar === 'whale-radar'
      ? whalePresetFilters
      : radar === 'technical-radar'
      ? technicalPresetFilters
      : null;
  // if (!presetFilters) throw new Error('preset filters is null');

  const selectedPreset = useMemo(() => {
    return (
      (radar === 'social-radar-24-hours' || radar === 'technical-radar'
        ? socialPresetFilters.find(x => {
            return (
              areEqual(x.filters.categories ?? [], value.categories ?? []) &&
              areEqual(x.filters.exchanges ?? [], value.exchanges ?? []) &&
              areEqual(x.filters.sources ?? [], value.sources ?? []) &&
              areEqual(
                x.filters.securityLabels ?? [],
                value.securityLabels ?? [],
              ) &&
              areEqual(x.filters.trendLabels ?? [], value.trendLabels ?? [])
            );
          })
        : radar === 'whale-radar'
        ? whalePresetFilters.find(x => {
            return (
              areEqual(x.filters.categories ?? [], value.categories ?? []) &&
              areEqual(
                x.filters.securityLabels ?? [],
                value.securityLabels ?? [],
              ) &&
              areEqual(x.filters.trendLabels ?? [], value.trendLabels ?? []) &&
              (value.profitableOnly ?? false) ===
                (x.filters.profitableOnly ?? false) &&
              (value.excludeNativeCoins ?? false) ===
                (x.filters.excludeNativeCoins ?? false)
            );
          })
        : undefined
      )?.slug ?? undefined
    );
  }, [value, radar]);

  const isFiltersApplied = useMemo(
    () =>
      value.categories?.length ||
      value.securityLabels?.length ||
      value.trendLabels?.length ||
      (radar === 'social-radar-24-hours'
        ? value.exchanges?.length || value.sources?.length
        : radar === 'whale-radar'
        ? value.profitableOnly || value.excludeNativeCoins
        : false),
    [
      radar,
      value.categories?.length,
      value.exchanges?.length,
      value.excludeNativeCoins,
      value.profitableOnly,
      value.securityLabels?.length,
      value.sources?.length,
      value.trendLabels?.length,
    ],
  );

  useEffect(() => {
    setLocalState(value);
  }, [value]);

  return (
    <div className={clsx('flex w-full gap-4', isMini && 'flex-col', className)}>
      <div className={clsx('min-w-64 max-w-max', isMini && 'w-full')}>
        <p className="mb-1 text-xs">{t('common:filtered-by')}</p>
        <div className="flex items-start gap-2">
          <Button
            variant={isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
            size={isMini ? 'sm' : 'md'}
            className={isMini ? 'w-sm' : 'w-md'}
            onClick={() => setOpen(true)}
            surface={isMini ? ((surface + 1) as never) : surface}
          >
            <Icon name={bxSliderAlt} size={16} />
          </Button>
          <Button
            variant={!isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
            size={isMini ? 'sm' : 'md'}
            onClick={() =>
              onChange?.({
                categories: [],
                exchanges: [],
                networks: [],
                securityLabels: [],
                sources: [],
                trendLabels: [],
                profitableOnly: false,
                excludeNativeCoins: false,
                query: '',
              })
            }
            surface={isMini ? ((surface + 1) as never) : surface}
          >
            <Icon name={bxGridAlt} size={16} />
            {t('common:all')}
          </Button>
          <ButtonSelect
            options={
              presetFilters?.map(x => ({
                label: x.label,
                value: x.slug,
              })) ?? []
            }
            value={isFiltersApplied && !selectedPreset ? null : selectedPreset}
            onChange={newPresetFilter =>
              onChange?.({
                categories: [],
                exchanges: [],
                networks: [],
                securityLabels: [],
                sources: [],
                trendLabels: [],
                profitableOnly: false,
                excludeNativeCoins: false,
                ...presetFilters?.find(x => x.slug === newPresetFilter)
                  ?.filters,
              })
            }
            size={isMini ? 'sm' : 'md'}
            variant="primary"
            surface={surface}
          />
        </div>
      </div>
      <div className={clsx('w-1/2 min-w-48 max-w-max', isMini && 'w-full')}>
        <p className="mb-1 text-xs">{t('common:sorted-by')}</p>
        <ButtonSelect
          size={isMini ? 'sm' : 'md'}
          value={JSON.stringify({
            sortBy: localState.sortBy ?? 'rank',
            sortOrder: localState.sortOrder ?? 'ascending',
          })}
          options={
            radar === 'social-radar-24-hours'
              ? [
                  {
                    label: t('social-radar.sorts.rank'),
                    value: JSON.stringify({
                      sortBy: 'rank',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('social-radar.sorts.newest'),
                    value: JSON.stringify({
                      sortBy: 'call_time',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('social-radar.sorts.oldest'),
                    value: JSON.stringify({
                      sortBy: 'call_time',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('social-radar.sorts.positive_price_changes'),
                    value: JSON.stringify({
                      sortBy: 'price_change',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('social-radar.sorts.negative_price_changes'),
                    value: JSON.stringify({
                      sortBy: 'price_change',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('social-radar.sorts.market_cap'),
                    value: JSON.stringify({
                      sortBy: 'market_cap',
                      sortOrder: 'ascending',
                    }),
                  },
                ]
              : radar === 'whale-radar'
              ? [
                  {
                    label: t('whale:top_coins.sorts.rank'),
                    value: JSON.stringify({
                      sortBy: 'rank',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.most_bought'),
                    value: JSON.stringify({
                      sortBy: 'buy',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.most_sold'),
                    value: JSON.stringify({
                      sortBy: 'sell',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.highest_transfer_vol'),
                    value: JSON.stringify({
                      sortBy: 'transfer',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.wallet_count'),
                    value: JSON.stringify({
                      sortBy: 'wallet_count',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.positive_price_changes'),
                    value: JSON.stringify({
                      sortBy: 'price_change',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.negative_price_changes'),
                    value: JSON.stringify({
                      sortBy: 'price_change',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('whale:top_coins.sorts.market_cap'),
                    value: JSON.stringify({
                      sortBy: 'market_cap',
                      sortOrder: 'descending',
                    }),
                  },
                ]
              : radar === 'technical-radar'
              ? [
                  {
                    label: t('market-pulse:table.sorts.rank'),
                    value: JSON.stringify({
                      sortBy: 'rank',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('market-pulse:table.sorts.positive_price_changes'),
                    value: JSON.stringify({
                      sortBy: 'price_change',
                      sortOrder: 'descending',
                    }),
                  },
                  {
                    label: t('market-pulse:table.sorts.negative_price_changes'),
                    value: JSON.stringify({
                      sortBy: 'price_change',
                      sortOrder: 'ascending',
                    }),
                  },
                  {
                    label: t('market-pulse:table.sorts.market_cap'),
                    value: JSON.stringify({
                      sortBy: 'market_cap',
                      sortOrder: 'descending',
                    }),
                  },
                ]
              : []
          }
          onChange={newVal => {
            const newSort = JSON.parse(newVal);
            onChange?.({
              sortBy: newSort.sortBy,
              sortOrder: newSort.sortOrder as never,
            });
          }}
          surface={surface}
        />
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className={clsx('w-[500px]', isMini && 'w-auto')}
        contentClassName="p-3"
        mode={isMini ? 'drawer' : 'modal'}
        drawerConfig={{
          position: 'bottom',
          closeButton: true,
        }}
        modalConfig={{
          closeButton: true,
        }}
        surface={2}
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              block
              onClick={() => {
                setOpen(false);
              }}
              className="shrink-0 grow"
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              block
              onClick={() => {
                onChange?.(localState);
                setOpen(false);
              }}
              className="shrink-0 grow"
            >
              {t('common:apply_filters')}
            </Button>
          </div>
        }
      >
        <p className="text-xl font-semibold">{t('common:filters')}</p>
        <div className="mt-8 space-y-4">
          <div
            className={clsx('flex items-center gap-2', isMini && 'flex-wrap')}
          >
            <p className={clsx('block basis-1/3', isMini && 'basis-full')}>
              {t('common:trend_label')}
            </p>
            <CoinLabelSelect
              className="grow"
              value={localState.trendLabels}
              multiple
              allowClear
              onChange={trendLabels =>
                setLocalState(p => ({ ...p, trendLabels: trendLabels ?? [] }))
              }
              type="trend_labels"
            />
          </div>
          <div
            className={clsx('flex items-center gap-2', isMini && 'flex-wrap')}
          >
            <p className={clsx('block basis-1/3', isMini && 'basis-full')}>
              {t('common:security_label')}
            </p>
            <CoinLabelSelect
              className="grow"
              value={localState.securityLabels}
              multiple
              allowClear
              onChange={securityLabels =>
                setLocalState(p => ({
                  ...p,
                  securityLabels: securityLabels ?? [],
                }))
              }
              type="security_labels"
            />
          </div>
          <div
            className={clsx('flex items-center gap-2', isMini && 'flex-wrap')}
          >
            <p
              className={clsx(
                'block shrink-0 basis-1/3',
                isMini && 'basis-full',
              )}
            >
              {t('common:category')}
            </p>
            <CategorySelect
              className="grow"
              value={localState.categories}
              multiple
              filter={
                radar === 'social-radar-24-hours' || radar === 'technical-radar'
                  ? radar
                  : undefined
              }
              allowClear
              onChange={categories =>
                setLocalState(p => ({ ...p, categories: categories ?? [] }))
              }
            />
          </div>
          {radar === 'social-radar-24-hours' && (
            <>
              <div
                className={clsx(
                  'flex items-center gap-2',
                  isMini && 'flex-wrap',
                )}
              >
                <p
                  className={clsx(
                    'block shrink-0 basis-1/3',
                    isMini && 'basis-full',
                  )}
                >
                  {t('common:exchange')}
                </p>
                <ExchangeSelect
                  className="grow"
                  value={localState.exchanges}
                  multiple
                  filter="social-radar-24-hours"
                  allowClear
                  onChange={exchanges =>
                    setLocalState(p => ({ ...p, exchanges: exchanges ?? [] }))
                  }
                />
              </div>
              <div
                className={clsx(
                  'flex items-center gap-2',
                  isMini && 'flex-wrap',
                )}
              >
                <p
                  className={clsx(
                    'block shrink-0 basis-1/3',
                    isMini && 'basis-full',
                  )}
                >
                  {t('common:source')}
                </p>
                <SocialRadarSourceSelect
                  className="grow"
                  value={localState.sources}
                  onChange={sources =>
                    setLocalState(p => ({ ...p, sources: sources ?? [] }))
                  }
                />
              </div>
            </>
          )}
          {radar === 'whale-radar' && (
            <div className="pt-4">
              <Checkbox
                size="lg"
                value={localState.excludeNativeCoins}
                onChange={excludeNativeCoins =>
                  setLocalState(p => ({ ...p, excludeNativeCoins }))
                }
                block
                label="Exclude Native Coins"
              />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
