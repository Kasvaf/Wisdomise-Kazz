import { useMetaListQuery } from 'api/meta';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';

export type MetaTab = 'new' | 'trend' | 'high_mc';

export const useMeta = ({
  tab,
  skipSimilar,
  query,
}: {
  tab: MetaTab;
  skipSimilar?: boolean;
  query?: string;
}) => {
  const { settings } = useUserSettings();

  const filters = settings.meta.filters[tab];

  return useMetaListQuery({
    recentlyActive: tab === 'trend',
    recentlyCreated: tab === 'new',
    minTotalVolume: filters.minTotalVolume,
    maxTotalVolume: filters.maxTotalVolume,
    minTotalMarketCap: filters.minTotalMarketCap,
    maxTotalMarketCap: filters.maxTotalMarketCap,
    skipSimilar,
    query,
  });
};
