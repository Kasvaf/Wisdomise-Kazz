import { useEffect, useRef, useState } from 'react';
import { type Observable } from 'rxjs';

function useObservable<V>({
  observable,
  handler,
  enabled,
}: {
  observable: Observable<V>;
  handler: (item: V) => void;
  enabled?: boolean;
}) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    if (enabled === false) return;
    const x = observable.subscribe(handlerRef.current);
    return () => x.unsubscribe();
  }, [enabled, observable]);
}

export function useObservableLastValue<V>({
  observable,
  enabled,
}: {
  observable: Observable<V>;
  enabled?: boolean;
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
  });
  return { data, isLoading: !receivedOnce };
}

export function useObservableAllValues<V>({
  observable,
  enabled,
}: {
  observable: Observable<V>;
  enabled?: boolean;
}) {
  const [data, setValues] = useState<V[]>();
  useObservable({
    observable,
    handler: val => setValues(vals => [...(vals ?? []), val]),
    enabled,
  });
  return { data };
}
