import { useEffect, useRef, useState } from 'react';
import { type Subscription, type Observable } from 'rxjs';
import { isProduction } from './version';

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
  key: string;
}) {
  const handlerRef = useRef(h);
  useEffect(() => {
    if (enabled === false) return;

    const handler = handlerRef.current;
    const getListeners = () => listeners.get(key) ?? [];

    listeners.set(key, [...getListeners(), handlerRef.current]);

    const subscription =
      subscriptions.get(key) ??
      observable.subscribe(
        item => {
          for (const fn of getListeners()) fn(item as never);
        },
        e => {
          if (!isProduction) {
            console.error('GRPC_ERROR', e);
          }
        },
      );
    if (!subscriptions.has(key)) {
      subscriptions.set(key, subscription);
    }

    return () => {
      const currentListenerIdx = getListeners().indexOf(handler);
      if (currentListenerIdx !== -1) {
        listeners.set(key, [
          ...getListeners().slice(0, currentListenerIdx),
          ...getListeners().slice(currentListenerIdx + 1),
        ]);
      }

      if (getListeners().length === 0) {
        subscription.unsubscribe();
        subscriptions.delete(key);
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
  key: string;
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
  key: string;
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
