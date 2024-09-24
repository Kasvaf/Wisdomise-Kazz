import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type PageResponse } from '../types/page';
import {
  type Alert,
  type AlertDataSource,
  type AlertParams,
  type RawAlert,
} from './types';
import { transformAlertToPayload, transformRawAlert } from './lib';

export * from './types';

export const useAlerts = <D extends AlertDataSource>(
  dataSource: D,
  filters?: Partial<AlertParams<D>>,
) => {
  const filterKeys = filters
    ? (Object.keys(filters) as Array<keyof typeof filters>)
    : [];
  if (filterKeys.length > 1)
    throw new Error('useAlerts method only support one filter!');
  return useQuery(
    ['alerts', dataSource, filters],
    (): Promise<Array<Alert<D>>> => {
      if (dataSource === 'custom:coin_radar_notification') {
        const fetchIsSubbed = () =>
          axios
            .get<{
              is_subscribed: boolean;
            }>(
              `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/is_subscribed`,
            )
            .then(resp => resp.data.is_subscribed);
        return fetchIsSubbed().then(isSubbed => {
          let resp: Array<Alert<'custom:coin_radar_notification'>> = [];
          if (isSubbed) {
            resp = [
              {
                key: 'custom:coin_radar_notification:anything_that_shows_alert_existed_before',
                dataSource: 'custom:coin_radar_notification',
                messengers: ['EMAIL'],
                state: 'ACTIVE',
                condition: undefined,
                config: undefined,
                params: undefined,
              },
            ];
          }
          return resp as Array<Alert<D>>;
        });
      } else {
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
                ...resp.data.results.map(rawAlert =>
                  transformRawAlert(rawAlert),
                ),
              ];
              if (resp.data.next !== null) {
                return recursiveGetPageData(page + 1, updatedList);
              }
              return updatedList;
            });
        return recursiveGetPageData(1, []);
      }
    },
  );
};

// export const useSingleAlert = <D extends AlertDataSource>(alertId: string) =>
//   useQuery(['alerts', alertId], () =>
//     axios
//       .get<RawAlert<D>>(`alerting/alerts/${alertId}`)
//       .then(resp => transformRawAlert(resp.data)),
//   );

export const useSaveAlert = <D extends AlertDataSource>(alertId?: string) => {
  const client = useQueryClient();
  return useMutation(
    (payload: Partial<Alert<D>>) => {
      const alertKey = payload.key ?? alertId;
      if (payload.dataSource === 'market_data') {
        const url = `alerting/alerts${alertKey ? `/${alertKey}` : ''}`;
        const method: keyof typeof axios = alertKey ? 'patch' : 'post';
        return axios[method](url, transformAlertToPayload(payload));
      } else if (payload.dataSource === 'custom:coin_radar_notification') {
        const requestToUnsub =
          payload.state === 'DISABLED' ||
          !payload.messengers?.includes('EMAIL');
        // if (requestToUnsub && !alertKey) return Promise.resolve(null);
        return axios.post(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/${
            requestToUnsub ? 'unsubscribe' : 'subscribe'
          }`,
        );
      }
      throw new Error('unexpected alert to save');
    },
    { onSuccess: () => client.invalidateQueries(['alerts']) },
  );
};

export const useDeleteAlert = <D extends AlertDataSource>(
  value: Partial<Alert<D>>,
) => {
  const client = useQueryClient();
  return useMutation(
    () => {
      if (value.dataSource === 'custom:coin_radar_notification') {
        return axios.post(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/unsubscribe`,
        );
      } else if (value.key) {
        return axios.delete(`alerting/alerts/${value.key}`);
      }
      throw new Error('unexpected alert to delete');
    },
    {
      onSuccess: () => client.invalidateQueries(['alerts']),
    },
  );
};
