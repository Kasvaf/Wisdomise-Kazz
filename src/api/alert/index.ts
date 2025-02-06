import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { isMiniApp } from 'utils/version';
import { ofetch } from 'config/ofetch';
import { resolvePageResponseToArray } from 'api/utils';
import { type BaseAlert, type Alert } from './types';

export * from './types';

const normalizeDataSource = <D extends string>(
  value?: D | { name: D },
): D | undefined => (typeof value === 'string' ? value : value?.name);

const getAlertingAlerts = (
  filters?: Partial<Pick<Alert, 'data_source' | 'params'>>,
) =>
  resolvePageResponseToArray<Alert>('alerting/alerts', {
    query: {
      data_source: filters?.data_source
        ? normalizeDataSource(filters.data_source)
        : undefined,
      ...((filters?.params?.length ?? 0) >= 1 && {
        param_field: filters?.params?.[0].field_name,
        param_value: filters?.params?.[0].value,
      }),
    },
  }).then(
    results =>
      results.map(item => ({
        ...item,
        data_source: normalizeDataSource(item.data_source),
      })) as Alert[],
  );

const saveAlertingAlert = (payload: Partial<Alert>) => {
  const alertKey = payload.key;
  const url = `alerting/alerts${alertKey ? `/${alertKey}` : ''}`;
  const method = alertKey ? 'patch' : 'post';
  return ofetch(url, {
    body: {
      data_source: payload?.data_source
        ? normalizeDataSource(payload.data_source)
        : undefined,
      conditions: payload.conditions,
      config: payload.config,
      messengers: payload.messengers,
      params: payload.params,
      state: payload.state === 'DISABLED' ? 'DISABLED' : 'ACTIVE',
    },
    method,
  });
};

const deleteAlertingAlert = (payload: Partial<BaseAlert>) => {
  const alertKey = payload.key;
  if (!alertKey) throw new Error('Cannot delete alert without key!');
  return ofetch(`alerting/alerts/${alertKey}`, {
    method: 'delete',
  });
};

const getSocialRadarDailyReportAlert = () =>
  ofetch<{ is_subscribed: boolean }>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/is_subscribed`,
  ).then(data => data.is_subscribed);

const toggleSocialRadarDailyReportAlert = (sub: boolean) => {
  return ofetch(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/${
      sub ? 'subscribe' : 'unsubscribe'
    }`,
    {
      method: 'post',
    },
  );
};

export const useAlerts = (
  filters?: Partial<Pick<Alert, 'data_source' | 'params'>>,
) => {
  const isLoggedIn = useIsLoggedIn();

  return useQuery(
    ['alerts', JSON.stringify(filters), isLoggedIn],
    async (): Promise<Alert[]> => {
      if (!isLoggedIn) return [];
      let returnValue: Alert[] = [];
      if (
        filters?.data_source === 'manual:social_radar_daily_report' ||
        !filters?.data_source
      ) {
        const isSubscribed = await getSocialRadarDailyReportAlert();
        if (isSubscribed) {
          returnValue = [
            ...returnValue,
            {
              data_source: 'manual:social_radar_daily_report',
              messengers: ['EMAIL'],
              conditions: [],
              params: [],
              state: 'ACTIVE',
              config: {},
            },
          ];
        }
      }
      if (filters?.data_source !== 'manual:social_radar_daily_report') {
        returnValue = [...returnValue, ...(await getAlertingAlerts(filters))];
      }
      return returnValue;
    },
  );
};

export const useSaveAlert = (alertId?: string) => {
  const client = useQueryClient();
  return useMutation(
    (payload: Partial<Alert>) => {
      if (!payload.data_source)
        throw new Error('Alert data_source is not valid');
      if (payload.data_source === 'manual:social_radar_daily_report') {
        const unsub =
          !payload.messengers?.includes('EMAIL') ||
          payload.state === 'DISABLED';
        return toggleSocialRadarDailyReportAlert(!unsub);
      }
      const alertKey = payload.key ?? alertId;
      return saveAlertingAlert({
        ...payload,
        ...(isMiniApp ? { messengers: ['TELEGRAM_MINI_APP'] } : {}),
        key: alertKey,
      });
    },
    { onSuccess: () => client.invalidateQueries(['alerts']) },
  );
};

export const useDeleteAlert = (alertId?: string) => {
  const client = useQueryClient();
  return useMutation(
    (payload: Partial<BaseAlert>) => {
      if (payload.data_source === 'manual:social_radar_daily_report') {
        return toggleSocialRadarDailyReportAlert(false);
      }
      const alertKey = payload.key ?? alertId;
      return deleteAlertingAlert({
        ...payload,
        key: alertKey,
      });
    },
    {
      onSuccess: () => client.invalidateQueries(['alerts']),
    },
  );
};
