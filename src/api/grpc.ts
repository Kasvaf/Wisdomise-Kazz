import { useMemo } from 'react';
import { type Observable } from 'rxjs';
import { useQuery } from '@tanstack/react-query';
import {
  useObservableAllValues,
  useObservableLastValue,
} from 'utils/observable';
import { DelphinusServiceClientImpl, GrpcWebImpl } from './proto/delphinus';
import { PingServiceClientImpl } from './proto/common';

const services = {
  delphinus: DelphinusServiceClientImpl,
  ping: PingServiceClientImpl,
} as const;

type ServiceKey = keyof typeof services;
type ServiceType<K extends ServiceKey> = K extends keyof typeof services
  ? InstanceType<(typeof services)[K]>
  : never;

export function useGrpcService<K extends ServiceKey>(svc: K): ServiceType<K> {
  return useMemo(() => {
    const Imp = services[svc];
    return new Imp(
      new GrpcWebImpl('https://stage-grpc.wisdomise.com/' + svc, {}),
    ) as ServiceType<K>;
  }, [svc]);
}

export function useSvcMethodQuery<K extends ServiceKey, V, P>(
  {
    service: svc,
    method: methodSelector,
    enabled,
  }: {
    service: K;
    method: (x: ServiceType<K>) => (params: P) => Promise<V>;
    enabled?: boolean;
  },
  params: P,
) {
  const service = useGrpcService(svc);
  const paramsJson = JSON.stringify(params);
  return useQuery({
    queryKey: ['grpc', methodSelector(service).name, paramsJson],
    queryFn: () => methodSelector(service)(JSON.parse(paramsJson)),
    enabled,
  });
}

export function useSvcMethodLastValue<K extends ServiceKey, V, P>(
  {
    service: svc,
    method: methodSelector,
    enabled,
  }: {
    service: K;
    method: (x: ServiceType<K>) => (params: P) => Observable<V>;
    enabled?: boolean;
  },
  params: P,
) {
  const service = useGrpcService(svc);
  const paramsJson = JSON.stringify(params);
  return useObservableLastValue({
    observable: useMemo(
      () => methodSelector(service)(JSON.parse(paramsJson)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [service, paramsJson],
    ),
    enabled,
  });
}

export function useSvcMethodAllValues<K extends ServiceKey, V, P>(
  {
    service: svc,
    method: methodSelector,
    enabled,
  }: {
    service: K;
    method: (x: ServiceType<K>) => (params: P) => Observable<V>;
    enabled?: boolean;
  },
  params: P,
) {
  const service = useGrpcService(svc);
  const paramsJson = JSON.stringify(params);
  return useObservableAllValues({
    observable: useMemo(
      () => methodSelector(service)(JSON.parse(paramsJson)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [service, paramsJson],
    ),
    enabled,
  });
}

/*
Usage:
const { values } = useSvcMethodAllValues(
  {
    service: 'delphinus',
    method: x => x.swapsStream,
  },
  { asset, network },
);
*/
