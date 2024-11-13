import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type PageResponse } from '../types/page';
import { type BaseAlert, type Alert } from './types';

export * from './types';

const normalizeDataSource = <D extends string>(
  value?: D | { name: D },
): D | undefined => (typeof value === 'string' ? value : value?.name);

export const useIsSubscribedToReport = () => {
  const isLoggedIn = useIsLoggedIn();
  return useQuery(['alerts', 'social-radar-daily-report'], () => {
    if (!isLoggedIn) return Promise.resolve(false);
    return axios
      .get<{ is_subscribed: boolean }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/is_subscribed`,
      )
      .then(resp => resp.data.is_subscribed);
  });
};

export const useToggleSubscripeToReport = () => {
  const client = useQueryClient();
  return useMutation(
    (sub: boolean) => {
      return axios.post(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/${
          sub ? 'subscribe' : 'unsubscribe'
        }`,
      );
    },
    {
      onSuccess: () => client.invalidateQueries(['alerts']),
    },
  );
};

export const useAlerts = (
  filters?: Partial<Pick<Alert, 'data_source' | 'params'>>,
) => {
  const isLoggedIn = useIsLoggedIn();

  return useQuery(
    ['alerts', JSON.stringify(filters), isLoggedIn],
    (): Promise<Alert[]> => {
      if (!isLoggedIn) return Promise.resolve([]);
      return axios
        .get<PageResponse<Alert>>('alerting/alerts', {
          params: {
            data_source: filters?.data_source
              ? normalizeDataSource(filters.data_source)
              : undefined,
            page: 1,
            page_size: 90,
            ...((filters?.params?.length ?? 0) >= 1 && {
              param_field: filters?.params?.[0].field_name,
              param_value: filters?.params?.[0].value,
            }),
          },
        })
        .then(
          resp =>
            resp.data.results.map(x => ({
              ...x,
              data_source: normalizeDataSource(x.data_source),
            })) as Alert[],
        );
    },
  );
};

export const useSaveAlert = (alertId?: string) => {
  const client = useQueryClient();
  return useMutation(
    (payload: Partial<Alert>) => {
      const alertKey = payload.key ?? alertId;
      const url = `alerting/alerts${alertKey ? `/${alertKey}` : ''}`;
      const method: keyof typeof axios = alertKey ? 'patch' : 'post';
      return axios[method](url, {
        data_source: payload?.data_source
          ? normalizeDataSource(payload.data_source)
          : undefined,
        conditions: payload.conditions,
        config: payload.config,
        messengers: payload.messengers,
        params: payload.params,
        state: payload.state === 'DISABLED' ? 'DISABLED' : 'ACTIVE',
      });
    },
    { onSuccess: () => client.invalidateQueries(['alerts']) },
  );
};

export const useDeleteAlert = (alertId?: string) => {
  const client = useQueryClient();
  return useMutation(
    (payload: Partial<BaseAlert>) => {
      const alertKey = payload.key ?? alertId;
      if (!alertKey) throw new Error('Cannot delete alert without key!');
      return axios.delete(`alerting/alerts/${alertKey}`);
    },
    {
      onSuccess: () => client.invalidateQueries(['alerts']),
    },
  );
};
