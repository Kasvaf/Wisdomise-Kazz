import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CoinLabelSelect } from 'shared/CoinLabelSelect';
import { type useWhaleRadarCoins } from 'api';
import { CategorySelect } from 'shared/CategorySelect';
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
      presets={WHALE_RADAR_PRESETS}
      sorts={WHALE_RADAR_SORTS}
      dialog={(state, setState) => (
        <>
          <div className="flex items-center gap-2">
            <p className="block basis-1/3">{t('common:trend_label')}</p>
            <CoinLabelSelect
              className="grow"
              value={state.trendLabels}
              multiple
              allowClear
              onChange={trendLabels => setState(p => ({ ...p, trendLabels }))}
              type="trend_labels"
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="block basis-1/3">{t('common:security_label')}</p>
            <CoinLabelSelect
              className="grow"
              value={state.securityLabels}
              multiple
              allowClear
              onChange={securityLabels =>
                setState(p => ({
                  ...p,
                  securityLabels,
                }))
              }
              type="security_labels"
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="block shrink-0 basis-1/3">{t('common:category')}</p>
            <CategorySelect
              className="grow"
              value={state.categories}
              multiple
              filter="social-radar-24-hours"
              allowClear
              onChange={categories => setState(p => ({ ...p, categories }))}
            />
          </div>

          <div className="pt-4">
            <Checkbox
              size="lg"
              value={state.excludeNativeCoins}
              onChange={excludeNativeCoins =>
                setState(p => ({ ...p, excludeNativeCoins }))
              }
              block
              label="Exclude Native Coins"
            />
          </div>
        </>
      )}
      excludeKeys={['query']}
      {...props}
    />
  );
};
