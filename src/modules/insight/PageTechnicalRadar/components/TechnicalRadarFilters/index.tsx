import { clsx } from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxGridAlt } from 'boxicons-quasar';
import { CategorySelect } from 'shared/CategorySelect';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { NetworkSelect } from 'shared/NetworkSelect';
import { type useTechnicalRadarCoins } from 'api';
import { type Surface } from 'utils/useSurface';
import useIsMobile from 'utils/useIsMobile';
import { SearchInput } from 'shared/SearchInput';

export function TechnicalRadarFilters({
  className,
  onChange,
  value,
  surface,
}: {
  className?: string;
  onReset?: () => void;
  value: Parameters<typeof useTechnicalRadarCoins>[0];
  onChange?: (
    v?: Partial<Parameters<typeof useTechnicalRadarCoins>[0]>,
  ) => void;
  surface: Surface;
}) {
  const { t } = useTranslation('market-pulse');
  const isMobile = useIsMobile();
  const [localState, setLocalState] = useState(value);
  const isFiltersApplied = useMemo(
    () =>
      value.query?.length || value.categories?.length || value.networks?.length,
    [value.query?.length, value.categories?.length, value.networks?.length],
  );

  useEffect(() => {
    setLocalState(value);
  }, [value]);

  return (
    <div
      className={clsx(
        'flex w-full gap-4 mobile:block mobile:space-y-4',
        className,
      )}
    >
      <div className="min-w-64 max-w-full mobile:w-full">
        <p className="mb-1 text-xs">{t('common:filtered-by')}</p>
        <div className="flex items-start gap-2">
          <Button
            variant={isFiltersApplied ? 'ghost' : 'primary'}
            size={isMobile ? 'sm' : 'md'}
            onClick={() =>
              onChange?.({
                categories: [],
                networks: [],
                query: '',
              })
            }
            surface={isMobile ? ((surface + 1) as never) : surface}
          >
            <Icon name={bxGridAlt} size={16} />
            {t('common:all')}
          </Button>
          <SearchInput
            value={localState.query}
            onChange={query => onChange?.({ query })}
            className="max-w-52 shrink-0 basis-80 mobile:hidden"
            placeholder={t('coin-radar:common.search_coin')}
            size={isMobile ? 'sm' : 'md'}
            surface={surface}
          />
          <NetworkSelect
            value={localState.networks}
            multiple
            onChange={networks => onChange?.({ networks })}
            allowClear
            valueType="slug"
            filter="technical-radar"
            className="mobile:grow"
            size={isMobile ? 'sm' : 'md'}
            surface={surface}
          />
          <CategorySelect
            value={localState.categories}
            multiple
            allowClear
            onChange={categories => onChange?.({ categories })}
            filter="technical-radar"
            className="mobile:grow"
            size={isMobile ? 'sm' : 'md'}
            surface={surface}
          />
        </div>
      </div>
      <div className="w-1/3 min-w-48 max-w-max mobile:w-full">
        <p className="mb-1 text-xs">{t('common:sorted-by')}</p>
        <ButtonSelect
          size={isMobile ? 'sm' : 'md'}
          value={JSON.stringify({
            sortBy: localState.sortBy ?? 'rank',
            sortOrder: localState.sortOrder ?? 'ascending',
          })}
          options={[
            {
              label: t('table.sorts.rank'),
              value: JSON.stringify({
                sortBy: 'rank',
                sortOrder: 'ascending',
              }),
            },
            {
              label: t('table.sorts.positive_price_changes'),
              value: JSON.stringify({
                sortBy: 'price_change',
                sortOrder: 'descending',
              }),
            },
            {
              label: t('table.sorts.negative_price_changes'),
              value: JSON.stringify({
                sortBy: 'price_change',
                sortOrder: 'ascending',
              }),
            },
            {
              label: t('table.sorts.market_cap'),
              value: JSON.stringify({
                sortBy: 'market_cap',
                sortOrder: 'descending',
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
          surface={surface}
        />
      </div>
    </div>
  );
}
