import { useEffect, useRef, useState } from 'react';
import { type Subscription, type Observable } from 'rxjs';
import { type QueryKey } from '@tanstack/react-query';
import { isDebugMode } from './version';

const subscriptions = new Map<string, Subscription>();
const listeners = new Map<string, Array<(value: never) => void>>();

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
    const strKey = JSON.stringify(key);
    const logPrefix = '[grpc]';
    const logIndentifier = `${(key?.[1] as string) ?? 'unknown'}/${
      (key?.[2] as string) ?? 'unknwon'
    }`;

    const handler = handlerRef.current;
    const getListeners = () => listeners.get(strKey) ?? [];

    listeners.set(strKey, [...getListeners(), handlerRef.current]);

    const subscription =
      subscriptions.get(strKey) ??
      observable.subscribe(
        item => {
          if (isDebugMode) {
            console.groupCollapsed(`${logPrefix} [msg] ${logIndentifier}`);
            console.log(item);
            console.groupEnd();
          }
          for (const fn of getListeners()) fn(item as never);
        },
        e => {
          if (isDebugMode) {
            console.groupCollapsed(`${logPrefix} [err] ${logIndentifier}`);
            console.log(e);
            console.groupEnd();
          }
        },
        () => {
          if (isDebugMode) {
            console.groupCollapsed(`${logPrefix} [end] ${logIndentifier}`);
            console.log(key[3]);
            console.groupEnd();
          }
        },
      );
    if (!subscriptions.has(strKey)) {
      console.log('HEREEEEEEEEEE', subscriptions);
      if (isDebugMode) {
        console.groupCollapsed(`${logPrefix} [con] ${logIndentifier}`);
        console.log(key[3]);
        console.groupEnd();
      }
      subscriptions.set(strKey, subscription);
    }

    return () => {
      const currentListenerIdx = getListeners().indexOf(handler);
      if (currentListenerIdx !== -1) {
        listeners.set(strKey, [
          ...getListeners().slice(0, currentListenerIdx),
          ...getListeners().slice(currentListenerIdx + 1),
        ]);
      }

      if (getListeners().length === 0) {
        subscription.unsubscribe();
        subscriptions.delete(strKey);
      }
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
