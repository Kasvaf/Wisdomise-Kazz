import type { Observable } from 'rxjs';
import * as common from '../proto/common';
import * as delphinus from '../proto/delphinus';
import * as network_radar from '../proto/network_radar';

export const SERVICES = {
  ping: {
    ClientImpl: common.PingServiceClientImpl,
    GrpcWebImpl: common.GrpcWebImpl,
    GrpcWebError: common.GrpcWebError,
    pathname: `/ping`,
  },
  delphinus: {
    ClientImpl: delphinus.DelphinusServiceClientImpl,
    GrpcWebImpl: delphinus.GrpcWebImpl,
    GrpcWebError: delphinus.GrpcWebError,
    pathname: `/delphinus`,
  },
  network_radar: {
    ClientImpl: network_radar.NetworkRadarServiceClientImpl,
    GrpcWebImpl: network_radar.GrpcWebImpl,
    GrpcWebError: network_radar.GrpcWebError,
    pathname: `/network-radar`,
  },
};

// const x = new SERVICES.network_radar.ClientImpl(new SERVICES.network_radar.GrpcWebImpl(''));
// const y = x.coinDetailStream({}).subscribe({

// });

export type ServicesMap = typeof SERVICES;
export type ServiceName = keyof ServicesMap;
export type ClientCtor<S extends ServiceName> = ServicesMap[S]['ClientImpl'];
export type ClientOf<S extends ServiceName> = InstanceType<ClientCtor<S>>;

export type GrpcMethodKeys<T> = {
  [K in keyof T]: T[K] extends (arg: any) => Promise<any>
    ? K
    : T[K] extends (arg: any) => Observable<any>
      ? K
      : never;
}[keyof T];

export type MethodName<S extends ServiceName> = GrpcMethodKeys<ClientOf<S>>;

export type Payload<
  S extends ServiceName,
  M extends MethodName<S>,
> = ClientOf<S>[M] extends (arg: infer A) => any ? A : never;

export type Response<
  S extends ServiceName,
  M extends MethodName<S>,
> = ClientOf<S>[M] extends (arg: any) => Promise<infer R>
  ? R
  : ClientOf<S>[M] extends (arg: any) => Observable<infer R>
    ? R
    : never;

export type GrpcWorkerConfig = {
  GRPC_ORIGIN: string;
  isDebugMode: boolean;
};

export type GrpcWorkerRequest = {
  action: 'subscribe' | 'unsubscribe';
  service: string;
  method: string | number | symbol;
  payload?: any;
  debug?: boolean;
};

export type GrpcWorkerResponse = {
  request: Omit<GrpcWorkerRequest, 'action'>;
  key: string;
  data?: any;
  error?: any;
};

export const generateKey = (request: Omit<GrpcWorkerRequest, 'action'>) =>
  JSON.stringify([request.service, request.method, request.payload]);

export const workerMessageHandler =
  (key: string, handler: (data: GrpcWorkerResponse) => void) =>
  (e: MessageEvent<any>) => {
    if (key !== e.data.key) return;
    handler(e.data as GrpcWorkerResponse);
  };

export const createWorkerConfig = (config: GrpcWorkerConfig) => ({
  name: JSON.stringify(config),
});

export const readWorkerConfig = (self: Window & typeof globalThis) =>
  JSON.parse(self.name) as GrpcWorkerConfig;

export const subscribeWorker = (
  worker: Worker,
  request: Omit<GrpcWorkerRequest, 'action'>,
  handler: (response: GrpcWorkerResponse) => void,
) => {
  const key = generateKey(request);
  worker.postMessage({
    action: 'subscribe',
    ...request,
  } satisfies GrpcWorkerRequest);
  const messageHandler = (e: MessageEvent<any>) => {
    if (key !== e.data.key) return;
    handler(e.data as GrpcWorkerResponse);
  };
  worker.addEventListener('message', messageHandler);

  return () => {
    worker.removeEventListener('message', messageHandler);
    worker.postMessage({
      action: 'unsubscribe',
      ...request,
    } satisfies GrpcWorkerRequest);
  };
};
