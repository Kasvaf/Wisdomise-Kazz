import type { ComponentProps, FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { useSocialRadarCoins } from 'services/rest/discovery';
import { CategorySelect } from 'shared/CategorySelect';
import { CoinLabelSelect } from 'shared/CoinLabelSelect';
import { ExchangeSelect } from 'shared/ExchangeSelect';
import { Filters } from '../Filters';
import { SOCIAL_RADAR_PRESETS, SOCIAL_RADAR_SORTS } from '../presetFilters';
import { SocialRadarSourceSelect } from './SocialRadarSourceSelect';

export const SocialRadarFilters: FC<
  Omit<
    ComponentProps<typeof Filters<Parameters<typeof useSocialRadarCoins>[0]>>,
    'presets' | 'sorts' | 'dialog' | 'excludeKeys'
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
          <div className="flex items-center gap-2">
            <p className="block shrink-0 basis-1/3">{t('common:exchange')}</p>
            <ExchangeSelect
              allowClear
              className="grow"
              filter="social-radar-24-hours"
              multiple
              onChange={exchanges => setState(p => ({ ...p, exchanges }))}
              value={state.exchanges}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="block shrink-0 basis-1/3">{t('common:source')}</p>
            <SocialRadarSourceSelect
              className="grow"
              onChange={sources => setState(p => ({ ...p, sources }))}
              value={state.sources}
            />
          </div>
        </>
      )}
      excludeKeys={['query']}
      presets={SOCIAL_RADAR_PRESETS}
      sorts={SOCIAL_RADAR_SORTS}
      {...props}
    />
  );
};
