import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CoinLabelSelect } from 'shared/CoinLabelSelect';
import { type useSocialRadarCoins } from 'api';
import { CategorySelect } from 'shared/CategorySelect';
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
      presets={SOCIAL_RADAR_PRESETS}
      sorts={SOCIAL_RADAR_SORTS}
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
          <div className="flex items-center gap-2">
            <p className="block shrink-0 basis-1/3">{t('common:exchange')}</p>
            <ExchangeSelect
              className="grow"
              value={state.exchanges}
              multiple
              filter="social-radar-24-hours"
              allowClear
              onChange={exchanges => setState(p => ({ ...p, exchanges }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="block shrink-0 basis-1/3">{t('common:source')}</p>
            <SocialRadarSourceSelect
              className="grow"
              value={state.sources}
              onChange={sources => setState(p => ({ ...p, sources }))}
            />
          </div>
        </>
      )}
      excludeKeys={['query']}
      {...props}
    />
  );
};
