import { GRPC_ORIGIN } from 'config/constants';
import { useEffect, useState } from 'react';
import { isDebugMode } from 'utils/version';
import {
  createWorkerConfig,
  generateKey,
  type MethodName,
  type Payload,
  type Response,
  type ServiceName,
  subscribeWorker,
} from './shared';
import GrpcWorker from './worker?worker';

const worker = new GrpcWorker(
  createWorkerConfig({
    GRPC_ORIGIN,
    isDebugMode,
  }),
);

export interface GrpcState<Res> {
  data: Res | undefined;
  isLoading: boolean;
  history: Res[];
}

export function requestGrpc<
  S extends ServiceName,
  M extends MethodName<S>,
  P extends Payload<S, M>,
  R extends Response<S, M>,
>(request: { service: S; method: M; payload: P }): Promise<R> {
  return new Promise((resolve, reject) => {
    const unsubscribe = subscribeWorker(worker, request, resp => {
      unsubscribe();
      if (resp.data) {
        resolve(resp.data);
      } else if (resp.error) {
        reject(resp.error);
      }
    });
  });
}

const lastObservedData = new Map<string, any>();

export function observeGrpc<
  S extends ServiceName,
  M extends MethodName<S>,
  P extends Payload<S, M>,
  R extends Response<S, M>,
>(
  request: { service: S; method: M; payload: P },
  callbacks?: {
    next?: (response: R) => void;
    error?: (error: any) => void;
  },
) {
  const key = generateKey(request);
  if (lastObservedData.has(key)) {
    callbacks?.next?.(lastObservedData.get(key));
  }

  return subscribeWorker(worker, request, resp => {
    if (resp.data) {
      lastObservedData.set(resp.key, resp.data);
      callbacks?.next?.(resp.data);
    } else if (resp.error) {
      callbacks?.error?.(resp.error);
    }
  });
}

export function useGrpc<
  S extends ServiceName,
  M extends MethodName<S>,
  P extends Payload<S, M>,
  R extends Response<S, M>,
>(request: {
  service: S;
  method: M;
  payload: P;
  history?: number;
  enabled?: boolean;
}): GrpcState<R> {
  const key = generateKey(request);

  const [response, setResponse] = useState<GrpcState<R>>({
    data: lastObservedData.get(key),
    history: [],
    isLoading: !!request.enabled && !lastObservedData.has(key),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: its safe to check only key and not the entire object
  useEffect(() => {
    if (request.enabled === false) return;

    if (lastObservedData.has(key)) {
      setResponse({
        data: lastObservedData.get(key),
        history: [],
        isLoading: !lastObservedData.has(key),
      });
    }

    const unsubscribe = subscribeWorker(worker, request, resp => {
      lastObservedData.set(resp.key, resp.data);
      setResponse(p => {
        lastObservedData.set(resp.key, resp.data);
        const newHistory = resp.data ? [...p.history, resp.data] : p.history;
        const historySize = request.history ?? 0;
        return {
          data: resp.data ?? p.data,
          error: resp.error,
          isLoading: false,
          history:
            newHistory.length < historySize
              ? newHistory
              : newHistory.slice(newHistory.length - historySize),
        };
      });
    });

    return () => {
      unsubscribe();
    };
  }, [key, request.enabled]);

  return response;
}
