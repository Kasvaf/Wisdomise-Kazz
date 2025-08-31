import { throttle } from 'utils/throttle';
import {
  type GrpcWorkerRequest,
  type GrpcWorkerResponse,
  generateKey,
  readWorkerConfig,
  SERVICES,
} from './shared';

const subscribtions: Record<string, any> = {};
const listeners: Record<string, number> = {};

const config = readWorkerConfig(self);

self.addEventListener('message', e => {
  const request = e.data as GrpcWorkerRequest;

  const key = generateKey(request);

  if (request.action === 'subscribe') {
    listeners[key] = (listeners[key] ?? 0) + 1;
    if (subscribtions[key]) return;

    const service = SERVICES[request.service as never] as any;
    const impl = new service.ClientImpl(
      new service.GrpcWebImpl(config.GRPC_ORIGIN + service.pathname, {}),
    );
    const call = impl[request.method](request.payload);

    const sendResponse = (type: 'error' | 'data') => {
      return (content: any) => {
        self.postMessage({
          key,
          request,
          [type]:
            typeof content.toObject === 'function'
              ? content.toObject()
              : content,
        } satisfies GrpcWorkerResponse);
      };
    };
    if (call instanceof Promise) {
      subscribtions[key] = call
        .then(sendResponse('data'))
        .catch(sendResponse('error'));
    } else {
      const subscribe = () =>
        impl[request.method](request.payload).subscribe({
          next: throttle(sendResponse('data'), 1000),
          error: throttle(error => {
            if (subscribtions[key]) {
              subscribtions[key].unsubscribe();
              subscribtions[key] = subscribe();
            }
            sendResponse('error')(error);
          }, 2000),
          complete: () => {
            if (subscribtions[key]) {
              subscribtions[key] = subscribe();
            }
          },
        });
      subscribtions[key] = subscribe();
    }
  }

  if (request.action === 'unsubscribe') {
    listeners[key] = (listeners[key] ?? 0) - 1;
    if (listeners[key] > 0) return;
    delete listeners[key];
    if (!subscribtions[key]) return;
    if (typeof subscribtions[key].unsubscribe === 'function') {
      subscribtions[key].unsubscribe();
    }
    delete subscribtions[key];
  }
});
