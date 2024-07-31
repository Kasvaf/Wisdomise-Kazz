import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type PageResponse } from './types/page';

export type AlertDataSource = 'market_data';

export type AlertState = 'ACTIVE' | 'DISABLED' | 'SNOOZE';

export type AlertMessanger =
  | 'EMAIL'
  | 'TELEGRAM'
  | 'SLACK'
  | 'SMS'
  | 'DISCORD'
  | 'PUSH'
  | 'BROWSER';

export type AlertParams<D extends AlertDataSource> = D extends 'market_data'
  ? {
      base?: string;
      quote?: string;
      market_type?: 'SPOT' | 'FUTURES';
      market_name?: string;
    }
  : never;

export type AlertConditionField<D extends AlertDataSource> =
  D extends 'market_data' ? 'last_price' : never;

export interface AlertCondition<D extends AlertDataSource> {
  field_name: AlertConditionField<D>;
  threshold: string;
  operator: 'LESS' | 'GREATER' | 'EQUAL';
}

export type AlertConfig<D extends AlertDataSource> = D extends 'market_data'
  ? {
      dnd_interval: number;
      one_time: boolean;
    }
  : {
      dnd_interval: number;
      reset_interval?: number;
      one_time: boolean;
    };

interface RawAlert<D extends AlertDataSource> {
  key: string;
  data_source: {
    name: AlertDataSource;
  };
  state: AlertState;
  params: Array<{
    field_name: keyof AlertParams<D>;
    value: string | boolean | number;
  }>;
  conditions: Array<AlertCondition<D>>;
  messengers: AlertMessanger[];
  config: AlertConfig<D>;
}

export interface Alert<D extends AlertDataSource> {
  key?: string;
  dataSource: AlertDataSource;
  params: AlertParams<D>;
  condition: AlertCondition<D>;
  messengers: AlertMessanger[];
  config: AlertConfig<D>;
  state: AlertState;
}

const transformRawAlert = <D extends AlertDataSource>(
  data: RawAlert<D>,
): Alert<D> => {
  const { params, conditions, data_source: dataSource, ...rest } = data;
  return {
    ...(dataSource?.name && {
      dataSource: dataSource.name,
    }),
    ...(params && {
      params: Object.fromEntries(
        params.map(({ field_name: fieldName, value }) => [fieldName, value]),
      ) as AlertParams<D>,
    }),
    ...(conditions && {
      condition: conditions[0],
    }),
    ...rest,
  } satisfies Alert<D>;
};

const transformAlertToPayload = <D extends AlertDataSource>(
  data: Partial<Alert<D>>,
) => {
  const { params, condition, dataSource, ...rest } = data;
  return {
    data_source: dataSource,
    params: params
      ? // eslint-disable-next-line @typescript-eslint/naming-convention
        Object.entries(params).map(([field_name, value]) => ({
          field_name,
          value,
        }))
      : [],
    conditions: [condition],
    ...rest,
  };
};

export const useAlerts = <D extends AlertDataSource>(
  dataSource: D,
  filters?: Partial<AlertParams<D>>,
) => {
  const filterKeys = filters
    ? (Object.keys(filters) as Array<keyof typeof filters>)
    : [];
  if (filterKeys.length > 1)
    throw new Error('useAlerts method only support one filter!');
  return useQuery(['alerts', dataSource, filters], () => {
    const recursiveGetPageData = (
      page = 1,
      initialList: Array<Alert<D>>,
    ): Promise<Array<Alert<D>>> =>
      axios
        .get<PageResponse<RawAlert<D>>>('alerting/alerts', {
          params: {
            data_source: dataSource,
            page,
            page_size: 90,
            ...(filters && {
              param_field: filterKeys[0],
              param_value: filters[filterKeys[0]],
            }),
          },
        })
        .then(resp => {
          const updatedList = [
            ...initialList,
            ...resp.data.results.map(rawAlert => transformRawAlert(rawAlert)),
          ];
          if (resp.data.next !== null) {
            return recursiveGetPageData(page + 1, updatedList);
          }
          return updatedList;
        });

    return recursiveGetPageData(1, []);
  });
};

export const useSingleAlert = <D extends AlertDataSource>(alertId: string) =>
  useQuery(['alerts', alertId], () =>
    axios
      .get<RawAlert<D>>(`alerting/alerts/${alertId}`)
      .then(resp => transformRawAlert(resp.data)),
  );

export const useSaveAlert = <D extends AlertDataSource>(alertId?: string) => {
  const client = useQueryClient();
  return useMutation(
    (payload: Partial<Alert<D>>) => {
      const url = `alerting/alerts${alertId ? `/${alertId}` : ''}`;
      const method: keyof typeof axios = alertId ? 'patch' : 'post';
      return axios[method](url, transformAlertToPayload(payload));
    },
    { onSuccess: () => client.invalidateQueries(['alerts']) },
  );
};

export const useDeleteAlert = (alertId: string) => {
  const client = useQueryClient();
  return useMutation(() => axios.delete(`alerting/alerts/${alertId}`), {
    onSuccess: () => client.invalidateQueries(['alerts']),
  });
};
