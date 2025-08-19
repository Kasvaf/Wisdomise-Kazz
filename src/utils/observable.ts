import { useEffect } from 'react';
import { type Subscription, type Observable } from 'rxjs';
import { type QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { isDebugMode } from './version';

const subscriptions = new Map<string, Subscription>();

function createGrpcConnection<V>(
  key: QueryKey,
  observable: Observable<V>,
  handler: (value: V) => void,
) {
  const strKey = JSON.stringify(key);

  const log = (title: string, body: any) => {
    const logPrefix = '[grpc]';
    const logIdentifier = `${(key?.[1] as string) ?? 'unknown'}/${
      (key?.[2] as string) ?? 'unknwon'
    }`;
    if (isDebugMode) {
      console.groupCollapsed(`${logPrefix} [${title}] ${logIdentifier}`);
      console.log(body);
      console.groupEnd();
    }
  };

  const handleMessage = (msg: V) => {
    log('message', msg);
    handler(msg);
  };

  const handleError = (err: any) => {
    log('error', err);
  };

  // fixme: teardown was being called regularly
  // const teardown: TeardownLogic = {
  //   unsubscribe: async () => {
  //     log('disconect', '');
  //     if (getListeners().length > 0) {
  //       subscriptions.delete(strKey);
  //       await new Promise(resolve => setTimeout(resolve, 5000));
  //       subscription = subscribe();
  //     }
  //   },
  // };

  const subscribe = () => {
    if (!subscriptions.has(strKey)) {
      log('connect', key[3]);
      const sub = observable.subscribe({
        next: value => handleMessage(value),
        error: err => handleError(err),
      });
      subscriptions.set(strKey, sub);
    }
  };

  subscribe();
}

export function useObservableLastValue<V>({
  observable,
  enabled,
  key,
}: {
  observable: Observable<V>;
  enabled?: boolean;
  key: QueryKey;
}) {
  const client = useQueryClient();
  const query = useQuery<V | null>({
    queryKey: key,
    queryFn: () => null,
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
  });

  useEffect(() => {
    if (enabled === false) return;
    const handler = (value: V) => client.setQueryData(key, () => value);
    createGrpcConnection(key, observable, handler);
  }, [client, enabled, key, observable]);

  return query;
}

export function useObservableAllValues<V>({
  observable,
  enabled,
  key,
}: {
  observable: Observable<V>;
  enabled?: boolean;
  key: QueryKey;
}) {
  const client = useQueryClient();
  const query = useQuery<V[]>({
    queryKey: key,
    queryFn: () => [],
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
  });

  useEffect(() => {
    if (enabled === false) return;
    const handler = (value: V) =>
      client.setQueryData(key, (old: V[]) => [...(old ?? []), value]);
    createGrpcConnection(key, observable, handler);
  }, [client, enabled, key, observable]);

  return query;
}
