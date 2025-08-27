import { type QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Observable, Subscription, TeardownLogic } from 'rxjs';
import { isDebugMode } from './version';

const subscriptions = new Map<string, Subscription>();
const listeners = new Map<string, Array<(value: never) => void>>();

function createGrpcConnection<V>(
  key: QueryKey,
  observable: Observable<V>,
  debug?: boolean,
) {
  const strKey = JSON.stringify(key);

  const log = (title: string, body: any) => {
    const logPrefix = '[grpc]';
    const logIdentifier = `${(key?.[1] as string) ?? 'unknown'}/${
      (key?.[2] as string) ?? 'unknwon'
    }`;
    if (debug || isDebugMode) {
      console.groupCollapsed(`${logPrefix} [${title}] ${logIdentifier}`);
      console.log(body);
      console.groupEnd();
    }
  };

  const getListeners = () => listeners.get(strKey) ?? [];

  const handleMessage = (msg: V) => {
    log('message', msg);
    for (const fn of getListeners()) fn(msg as never);
  };

  const handleError = (err: any) => {
    log('error', err);
  };

  const onMessage = (handler: (msg: V) => void) => {
    listeners.set(strKey, [...getListeners(), handler]);
  };

  const offMessage = (handler: (msg: V) => void) => {
    const currentListenerIdx = getListeners().indexOf(handler);
    if (currentListenerIdx !== -1) {
      listeners.set(strKey, [
        ...getListeners().slice(0, currentListenerIdx),
        ...getListeners().slice(currentListenerIdx + 1),
      ]);
      if (getListeners().length === 0) {
        listeners.delete(strKey);
        subscription.unsubscribe();
        subscriptions.delete(strKey);
      }
    }
  };

  const teardown: TeardownLogic = {
    unsubscribe: async () => {
      log('disconect', '');
      if (getListeners().length > 0) {
        subscriptions.delete(strKey);
        await new Promise(resolve => setTimeout(resolve, 5000));
        subscription = subscribe();
      }
    },
  };

  const subscribe = () => {
    const subscription =
      subscriptions.get(strKey) ??
      observable.subscribe(handleMessage, handleError);

    if (!subscriptions.has(strKey)) {
      log('connect', key[3]);
      subscriptions.set(strKey, subscription);

      subscription.add(teardown);
    }

    return subscription;
  };

  let subscription = subscribe();

  return {
    onMessage,
    offMessage,
  };
}

export function useObservableLastValue<V>({
  observable,
  enabled,
  debug,
  key,
}: {
  observable: Observable<V>;
  enabled?: boolean;
  debug?: boolean;
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
    const connection = createGrpcConnection(key, observable, debug);

    connection.onMessage(handler);

    return () => {
      connection.offMessage(handler);
    };
  }, [client, debug, enabled, key, observable]);

  return query;
}

export function useObservableAllValues<V>({
  observable,
  enabled,
  debug,
  key,
}: {
  observable: Observable<V>;
  enabled?: boolean;
  debug?: boolean;
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
    const connection = createGrpcConnection(key, observable, debug);

    connection.onMessage(handler);

    return () => {
      connection.offMessage(handler);
    };
  }, [client, debug, enabled, key, observable]);

  return query;
}
