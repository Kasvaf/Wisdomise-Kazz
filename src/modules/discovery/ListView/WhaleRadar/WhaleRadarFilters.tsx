import type { useWhaleRadarCoins } from 'api/discovery';
import type { ComponentProps, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CategorySelect } from 'shared/CategorySelect';
import { CoinLabelSelect } from 'shared/CoinLabelSelect';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Filters } from '../Filters';
import { WHALE_RADAR_PRESETS, WHALE_RADAR_SORTS } from '../presetFilters';

export const WhaleRadarFilters: FC<
  Omit<
    ComponentProps<typeof Filters<Parameters<typeof useWhaleRadarCoins>[0]>>,
    'presets' | 'sorts' | 'dialog' | 'query'
  >
> = ({ ...props }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <Filters
      dialog={(state, setState) => (
        <>
          <div className="flex items-center gap-2">
            <p className="block basis-1/3">{t('common:trend_label')}</p>
            <CoinLabelSelect
              allowClear
              className="grow"
              multiple
              onChange={trendLabels => setState(p => ({ ...p, trendLabels }))}
              type="trend_labels"
              value={state.trendLabels}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="block shrink-0 basis-1/3">{t('common:category')}</p>
            <CategorySelect
              allowClear
              className="grow"
              filter="social-radar-24-hours"
              multiple
              onChange={categories => setState(p => ({ ...p, categories }))}
              value={state.categories}
            />
          </div>

          <div className="pt-4">
            <Checkbox
              block
              label="Exclude Native Coins"
              onChange={excludeNativeCoins =>
                setState(p => ({ ...p, excludeNativeCoins }))
              }
              size="lg"
              value={state.excludeNativeCoins}
            />
          </div>
        </>
      )}
      excludeKeys={['query']}
      presets={WHALE_RADAR_PRESETS}
      sorts={WHALE_RADAR_SORTS}
      {...props}
    />
  );
};
