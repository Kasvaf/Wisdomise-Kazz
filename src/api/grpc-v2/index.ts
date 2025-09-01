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
  return subscribeWorker(worker, request, resp => {
    if (resp.data) {
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
  const [response, setResponse] = useState<GrpcState<R>>({
    data: undefined,
    history: [],
    isLoading: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: its safe to check only key and not the entire object
  useEffect(() => {
    if (!request.enabled) return;

    const unsubscribe = subscribeWorker(worker, request, resp => {
      setResponse(p => {
        const newHistory = resp.data ? [...p.history, resp.data] : p.history;
        const historySize = request.history ?? 0;
        return {
          data: resp.data,
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
  }, [generateKey(request), request.enabled]);

  return response;
}
