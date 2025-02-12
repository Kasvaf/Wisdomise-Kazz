import { clsx } from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { bxGridAlt, bxSliderAlt } from 'boxicons-quasar';
import { CategorySelect } from 'shared/CategorySelect';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { CoinLabelSelect } from 'shared/CoinLabelSelect';
import { NetworkSelect } from 'shared/NetworkSelect';
import { ExchangeSelect } from 'shared/ExchangeSelect';
import { type useSocialRadarCoins } from 'api';
import { type Surface } from 'utils/useSurface';
import useIsMobile from 'utils/useIsMobile';
import { presetFilters } from './presetFilters';
import { SocialRadarSourceSelect } from './SocialRadarSourceSelect';

const areEqual = (first: string[], second: string[]) =>
  first.length === second.length && first.every(x => second.includes(x));

export function SocialRadarFilters({
  className,
  onChange,
  value,
  surface,
}: {
  className?: string;
  onReset?: () => void;
  value: Parameters<typeof useSocialRadarCoins>[0];
  onChange?: (v?: Partial<Parameters<typeof useSocialRadarCoins>[0]>) => void;
  surface: Surface;
}) {
  const { t } = useTranslation('coin-radar');
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [localState, setLocalState] = useState(value);
  const selectedPreset = useMemo(() => {
    return (
      presetFilters.find(x => {
        return (
          areEqual(x.filters.categories ?? [], value.categories ?? []) &&
          areEqual(x.filters.exchanges ?? [], value.exchanges ?? []) &&
          areEqual(x.filters.networks ?? [], value.networks ?? []) &&
          areEqual(x.filters.sources ?? [], value.sources ?? []) &&
          areEqual(
            x.filters.securityLabels ?? [],
            value.securityLabels ?? [],
          ) &&
          areEqual(x.filters.trendLabels ?? [], value.trendLabels ?? [])
        );
      })?.slug ?? undefined
    );
  }, [value]);
  const isFiltersApplied = useMemo(
    () =>
      value.categories?.length ||
      value.exchanges?.length ||
      value.networks?.length ||
      value.sources?.length ||
      value.securityLabels?.length ||
      value.trendLabels?.length,
    [
      value.categories?.length,
      value.exchanges?.length,
      value.networks?.length,
      value.securityLabels?.length,
      value.sources?.length,
      value.trendLabels?.length,
    ],
  );

  useEffect(() => {
    setLocalState(value);
  }, [value]);

  return (
    <div
      className={clsx(
        'flex max-w-full flex-nowrap items-center gap-4 overflow-hidden mobile:flex-wrap',
        className,
      )}
    >
      <div className="mobile:w-full">
        <p className="mb-1 block text-xs">{t('common:filtered-by')}</p>
        <div className="flex w-auto flex-nowrap gap-2 overflow-auto">
          <Button
            variant={isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
            size={isMobile ? 'sm' : 'md'}
            className="w-md shrink-0"
            onClick={() => setOpen(true)}
            surface={isMobile ? ((surface + 1) as never) : surface}
          >
            <Icon name={bxSliderAlt} size={16} />
          </Button>
          <Button
            variant={!isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
            size={isMobile ? 'sm' : 'md'}
            className="shrink-0"
            onClick={() =>
              onChange?.({
                categories: [],
                exchanges: [],
                networks: [],
                securityLabels: [],
                sources: [],
                trendLabels: [],
              })
            }
            surface={isMobile ? ((surface + 1) as never) : surface}
          >
            <Icon name={bxGridAlt} size={16} />
            {t('common.all')}
          </Button>
          <ButtonSelect
            options={presetFilters.map(x => ({
              label: x.label,
              value: x.slug,
            }))}
            allowClear
            value={isFiltersApplied && !selectedPreset ? null : selectedPreset}
            onChange={newPresetFilter =>
              onChange?.({
                categories: [],
                exchanges: [],
                networks: [],
                securityLabels: [],
                sources: [],
                trendLabels: [],
                ...presetFilters.find(x => x.slug === newPresetFilter)?.filters,
              })
            }
            size={isMobile ? 'sm' : 'md'}
            variant="primary"
            className="max-w-lg grow"
            surface={surface}
          />
        </div>
      </div>
      <div className="mobile:w-full">
        <p className="mb-1 block text-xs">{t('common:sorted-by')}</p>
        <ButtonSelect
          size={isMobile ? 'sm' : 'md'}
          value={JSON.stringify({
            sortBy: localState.sortBy ?? 'rank',
            sortOrder: localState.sortOrder ?? 'ascending',
          })}
          options={[
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
              label: t('social-radar.sorts.price_change'),
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
          ]}
          onChange={newVal => {
            const newSort = JSON.parse(newVal);
            onChange?.({
              sortBy: newSort.sortBy,
              sortOrder: newSort.sortOrder as never,
            });
          }}
          className="w-auto mobile:w-full"
          surface={surface}
        />
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        centered
        className="max-w-[500px] mobile:max-w-[360px]"
        destroyOnClose
        footer={false}
      >
        <p className="text-xl font-semibold">{t('common.filters')}</p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block basis-1/3 mobile:basis-full">
              {t('common.trend_label')}
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
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block basis-1/3 mobile:basis-full">
              {t('common.security_label')}
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
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block shrink-0 basis-1/3 mobile:basis-full">
              {t('common.category')}
            </p>
            <CategorySelect
              className="grow"
              value={localState.categories}
              multiple
              filter="social-radar-24-hours"
              allowClear
              onChange={categories =>
                setLocalState(p => ({ ...p, categories: categories ?? [] }))
              }
            />
          </div>
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block shrink-0 basis-1/3 mobile:basis-full">
              {t('common.network')}
            </p>
            <NetworkSelect
              className="grow"
              value={localState.networks}
              multiple
              filter="social-radar-24-hours"
              allowClear
              onChange={networks =>
                setLocalState(p => ({ ...p, networks: networks ?? [] }))
              }
            />
          </div>
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block shrink-0 basis-1/3 mobile:basis-full">
              {t('common.exchange')}
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
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block shrink-0 basis-1/3 mobile:basis-full">
              {t('common.source')}
            </p>
            <SocialRadarSourceSelect
              className="grow"
              value={localState.sources}
              onChange={sources =>
                setLocalState(p => ({ ...p, sources: sources ?? [] }))
              }
            />
          </div>
        </div>
        <div className="mt-20 flex items-center gap-2">
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
            {t('common.apply_filters')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
