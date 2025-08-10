/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Observable } from 'rxjs';
import {
  type QueryKey,
  type UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query';
import {
  useObservableAllValues,
  useObservableLastValue,
} from 'utils/observable';
import { GRPC_ORIGIN } from 'config/constants';
import { DelphinusServiceClientImpl, GrpcWebImpl } from './proto/delphinus';
import { NetworkRadarServiceClientImpl } from './proto/network_radar';
import { PingServiceClientImpl } from './proto/common';

const grpcServices = {
  'network-radar': NetworkRadarServiceClientImpl,
  'delphinus': DelphinusServiceClientImpl,
  'ping': PingServiceClientImpl,
} as const;

type ServiceKey = keyof typeof grpcServices;
type ServiceType<K extends ServiceKey> = K extends keyof typeof grpcServices
  ? InstanceType<(typeof grpcServices)[K]>
  : never;

export function useGrpcService<K extends ServiceKey>(svc: K): ServiceType<K> {
  return useMemo(() => {
    const Imp = grpcServices[svc];
    return new Imp(
      new GrpcWebImpl(`${GRPC_ORIGIN}/${svc}`, {}),
    ) as ServiceType<K>;
  }, [svc]);
}

const useSvgMethodKey = (
  service: ServiceKey,
  methodName: string,
  params: unknown,
) => {
  const generateKey = useCallback(() => {
    return ['grpc', service, methodName.split(' ')[1], params] as QueryKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, methodName, JSON.stringify(params)]);
  const [key, setKey] = useState(generateKey());

  useEffect(() => {
    setKey(generateKey());
  }, [generateKey]);
  return key;
};

export function useSvcMethodQuery<K extends ServiceKey, V, P>(
  {
    service: svc,
    method: methodSelector,
    ...queryOptions
  }: {
    service: K;
    method: (x: ServiceType<K>) => (params: P) => Promise<V>;
  } & Omit<UndefinedInitialDataOptions<V>, 'queryKey' | 'queryFn'>,
  params: P,
) {
  const service = useGrpcService(svc);
  const method = methodSelector(service);
  const key = useSvgMethodKey(svc, method.name, params);

  return useQuery({
    queryKey: key,
    queryFn: () => method.call(service, params),
    ...queryOptions,
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
  const method = methodSelector(service);
  const key = useSvgMethodKey(svc, method.name, params);

  return useObservableLastValue({
    observable: useMemo(
      () => method.call(service, params),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [service, method, JSON.stringify(params)],
    ),
    enabled,
    key,
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
  const method = methodSelector(service);
  const key = useSvgMethodKey(svc, method.name, params);

  return useObservableAllValues({
    observable: useMemo(
      () => method.call(service, params),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [service, method, JSON.stringify(params)],
    ),
    enabled,
    key,
  });
}

// ========================

type ServiceMethodMap<S> = {
  [K in keyof S]: S[K] extends (params: infer P) => Promise<infer V>
    ? { type: 'promise'; params: P; returnType: V }
    : S[K] extends (params: infer P) => Observable<infer V>
    ? { type: 'observable'; params: P; returnType: V }
    : never;
};

// Create a service singleton factory
export function createServiceSingleton<K extends ServiceKey>(svcName: K) {
  type Service = ServiceType<K>;
  type MethodMap = ServiceMethodMap<Service>;

  const singleton = {} as any;

  // Get the service prototype to examine methods
  const serviceProto = grpcServices[svcName].prototype as any;

  // Iterate through all methods of the service
  for (const methodName of Object.getOwnPropertyNames(serviceProto).filter(
    prop => typeof serviceProto[prop] === 'function' && prop !== 'constructor',
  )) {
    const method = methodName as keyof Service;
    if (!(method in serviceProto)) continue;

    // Create capitalized method name for the hook naming
    const capitalizedMethod =
      method.toString().charAt(0).toUpperCase() + method.toString().slice(1);

    // For methods returning Promise
    singleton[`use${capitalizedMethod}Query`] = (params: any, options?: any) =>
      useSvcMethodQuery(
        {
          service: svcName,
          method: (x: Service) => x[method] as any,
          ...options,
        },
        params,
      );

    // For methods returning Observable
    singleton[`use${capitalizedMethod}LastValue`] = (
      params: any,
      options?: any,
    ) =>
      useSvcMethodLastValue(
        {
          service: svcName,
          method: (x: Service) => x[method] as any,
          ...options,
        },
        params,
      );

    // For methods returning Observable
    singleton[`use${capitalizedMethod}AllValues`] = (
      params: any,
      options?: any,
    ) =>
      useSvcMethodAllValues(
        {
          service: svcName,
          method: (x: Service) => x[method] as any,
          ...options,
        },
        params,
      );
  }

  interface Options {
    enabled?: boolean;
  }
  return singleton as {
    [M in keyof MethodMap as MethodMap[M]['type'] extends 'promise'
      ? `use${Capitalize<string & M>}Query`
      : never]: (
      params: MethodMap[M]['params'],
      options?: Omit<
        UndefinedInitialDataOptions<MethodMap[M]['returnType']>,
        'queryKey' | 'queryFn'
      >,
    ) => ReturnType<
      typeof useSvcMethodQuery<
        K,
        MethodMap[M]['returnType'],
        MethodMap[M]['params']
      >
    >;
  } & {
    [M in keyof MethodMap as MethodMap[M]['type'] extends 'observable'
      ? `use${Capitalize<string & M>}LastValue`
      : never]: (
      params: MethodMap[M]['params'],
      options?: Options,
    ) => ReturnType<
      typeof useSvcMethodLastValue<
        K,
        MethodMap[M]['returnType'],
        MethodMap[M]['params']
      >
    >;
  } & {
    [M in keyof MethodMap as MethodMap[M]['type'] extends 'observable'
      ? `use${Capitalize<string & M>}AllValues`
      : never]: (
      params: MethodMap[M]['params'],
      options?: Options,
    ) => ReturnType<
      typeof useSvcMethodAllValues<
        K,
        MethodMap[M]['returnType'],
        MethodMap[M]['params']
      >
    >;
  };
}
