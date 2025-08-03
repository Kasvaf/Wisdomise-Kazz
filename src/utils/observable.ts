import { useEffect, useRef, useState } from 'react';
import { type Subscription, type Observable, type TeardownLogic } from 'rxjs';
import { type QueryKey } from '@tanstack/react-query';
import { isDebugMode } from './version';

const subscriptions = new Map<string, Subscription>();
const listeners = new Map<string, Array<(value: never) => void>>();

function createGrpcConnection<V>(key: QueryKey, observable: Observable<V>) {
  const strKey = JSON.stringify(key);

  const log = (title: string, body: any) => {
    const logPrefix = '[grpc]';
    const logIndentifier = `${(key?.[1] as string) ?? 'unknown'}/${
      (key?.[2] as string) ?? 'unknwon'
    }`;
    if (isDebugMode) {
      console.groupCollapsed(`${logPrefix} [${title}] ${logIndentifier}`);
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

function useObservable<V>({
  observable,
  handler: h,
  enabled,
  key,
}: {
  observable: Observable<V>;
  handler: (item: V) => void;
  enabled?: boolean;
  key: QueryKey;
}) {
  const handlerRef = useRef(h);
  useEffect(() => {
    if (enabled === false) return;
    const handler = handlerRef.current;
    const connection = createGrpcConnection(key, observable);
    connection.onMessage(handler);

    return () => {
      connection.offMessage(handler);
    };
  }, [enabled, key, observable]);
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
  const [data, setLastData] = useState<V>();
  const [receivedOnce, setReceivedOnce] = useState(false);
  useObservable({
    observable,
    handler: val => {
      setLastData(val);
      setReceivedOnce(true);
    },
    enabled,
    key,
  });
  return { data, isLoading: !receivedOnce };
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
  const [data, setValues] = useState<V[]>();
  useObservable({
    observable,
    handler: val => setValues(vals => [...(vals ?? []), val]),
    enabled,
    key,
  });
  return { data };
}
