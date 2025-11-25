import type { ComponentProps, FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { useTechnicalRadarCoins } from 'services/rest/discovery';
import { CategorySelect } from 'shared/CategorySelect';
import { Filters } from '../Filters';
import {
  TECHNICAL_RADAR_PRESETS,
  TECHNICAL_RADAR_SORTS,
} from '../presetFilters';

export const TechnicalRadarFilters: FC<
  Omit<
    ComponentProps<
      typeof Filters<Parameters<typeof useTechnicalRadarCoins>[0]>
    >,
    'presets' | 'sorts' | 'dialog'
  >
> = ({ ...props }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <Filters
      dialog={(state, setState) => (
        <>
          {/* <div className="flex items-center gap-2">
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
          </div> */}
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
        </>
      )}
      excludeKeys={['query']}
      presets={TECHNICAL_RADAR_PRESETS}
      sorts={TECHNICAL_RADAR_SORTS}
      {...props}
    />
  );
};
