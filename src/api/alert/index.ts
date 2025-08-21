import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resolvePageResponseToArray } from 'api/utils';
import { ofetch } from 'config/ofetch';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { isMiniApp } from 'utils/version';
import type { Alert, BaseAlert } from './types';

export * from './types';

const normalizeDataSource = <D extends string>(
  value?: D | { name: D },
): D | undefined => (typeof value === 'string' ? value : value?.name);

const getAlertingAlerts = () =>
  resolvePageResponseToArray<Alert>('alerting/alerts').then(
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

export const useAlerts = (
  filters?: Partial<Pick<Alert, 'data_source' | 'params'>>,
) => {
  const isLoggedIn = useIsLoggedIn();

  const queryKey = ['alerts', isLoggedIn];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Alert[]> => {
      if (!isLoggedIn) return [];
      return await getAlertingAlerts();
    },
    select: data => {
      return data.filter(row => {
        return (
          (!filters?.data_source || filters?.data_source === row.data_source) &&
          (!filters?.params ||
            filters.params.every(p =>
              row.params.some(
                rp => rp.field_name === p.field_name && rp.value === p.value,
              ),
            ))
        );
      });
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useSaveAlert = (alertId?: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Alert>) => {
      if (!payload.data_source)
        throw new Error('Alert data_source is not valid');
      const alertKey = payload.key ?? alertId;
      return saveAlertingAlert({
        ...payload,
        ...(isMiniApp ? { messengers: ['TELEGRAM_MINI_APP'] } : {}),
        key: alertKey,
      });
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['alerts'] }),
  });
};

export const useDeleteAlert = (alertId?: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<BaseAlert>) => {
      const alertKey = payload.key ?? alertId;
      return deleteAlertingAlert({
        ...payload,
        key: alertKey,
      });
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['alerts'] }),
  });
};
