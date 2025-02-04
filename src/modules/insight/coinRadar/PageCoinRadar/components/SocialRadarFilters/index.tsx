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
import { type SocialRadarTableParams } from '../types';
import { presetFilters } from './presetFilters';
import { SortModes } from './SortModes';
import { SocialRadarSourceSelect } from './SocialRadarSourceSelect';

const areEqual = (first: string[], second: string[]) =>
  first.length === second.length && first.every(x => second.includes(x));

export function SocialRadarFilters({
  className,
  onChange,
  value,
}: {
  className?: string;
  onReset?: () => void;
  value: SocialRadarTableParams;
  onChange?: (v?: Partial<SocialRadarTableParams>) => void;
}) {
  const { t } = useTranslation('coin-radar');
  const [open, setOpen] = useState(false);
  const [localState, setLocalState] = useState(value);
  const selectedPreset = useMemo(() => {
    return (
      presetFilters.find(x => {
        return (
          areEqual(x.filters.categories ?? [], value.categories) &&
          areEqual(x.filters.exchanges ?? [], value.exchanges) &&
          areEqual(x.filters.networks ?? [], value.networks) &&
          areEqual(x.filters.sources ?? [], value.sources) &&
          areEqual(x.filters.securityLabels ?? [], value.securityLabels) &&
          areEqual(x.filters.trendLabels ?? [], value.trendLabels)
        );
      })?.slug ?? undefined
    );
  }, [value]);
  const isFiltersApplied = useMemo(
    () =>
      value.categories.length > 0 ||
      value.exchanges.length > 0 ||
      value.networks.length > 0 ||
      value.sources.length > 0 ||
      value.securityLabels.length > 0 ||
      value.trendLabels.length > 0,
    [
      value.categories.length,
      value.exchanges.length,
      value.networks.length,
      value.securityLabels.length,
      value.sources.length,
      value.trendLabels.length,
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
      <div className="flex w-auto flex-nowrap gap-2 overflow-auto mobile:gap-1">
        <Button
          variant={isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
          size="md"
          className="w-md shrink-0"
          onClick={() => setOpen(true)}
        >
          <Icon name={bxSliderAlt} size={16} />
        </Button>
        <Button
          variant={!isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
          size="md"
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
          size="md"
          variant="primary"
          className="max-w-lg grow"
        />
      </div>
      <SortModes
        sortBy={value.sortBy}
        sortOrder={value.sortOrder}
        onChange={(sortBy, sortOrder) =>
          onChange?.({ sortBy, sortOrder: sortOrder as never })
        }
        className="w-auto mobile:w-full"
      />
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
