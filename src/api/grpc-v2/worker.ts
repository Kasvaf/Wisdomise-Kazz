import { debounce, throttle } from 'utils/throttle';
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

  const log = (title: string, body: any) => {
    if (config.isDebugMode) {
      const logPrefix = '[grpc]';
      const logIdentifier = `${request.service}/${request.method.toString()}`;
      console.groupCollapsed(`${logPrefix} [${title}] ${logIdentifier}`);
      console.log(body);
      console.groupEnd();
    }
  };

  if (request.action === 'subscribe') {
    listeners[key] = (listeners[key] ?? 0) + 1;
    if (subscribtions[key]) return;
    log(`connect`, request.payload);

    const service = SERVICES[request.service as never] as any;
    const impl = new service.ClientImpl(
      new service.GrpcWebImpl(config.GRPC_ORIGIN + service.pathname, {}),
    );
    const call = impl[request.method](request.payload);

    const sendResponse = (type: 'error' | 'data') => {
      return (content: any) => {
        const body =
          typeof content.toObject === 'function' ? content.toObject() : content;
        log(type, content);
        self.postMessage({
          key,
          request,
          [type]: body,
        } satisfies GrpcWorkerResponse);
      };
    };
    if (call instanceof Promise) {
      log('fetch', request.payload);
      subscribtions[key] = call
        .then(sendResponse('data'))
        .catch(sendResponse('error'));
    } else {
      const subscribe = () => {
        log('subscribe', request.payload);
        return impl[request.method](request.payload).subscribe({
          next: throttle(sendResponse('data'), 1000),
          error: (error: any) => {
            sendResponse('error')(error);
            if (subscribtions[key]) {
              debounce(() => {
                subscribtions[key].unsubscribe();
                subscribtions[key] = subscribe();
              }, 5000).run();
            }
          },
          complete: () => log('complete', {}),
        });
      };
      subscribtions[key] = subscribe();
    }
  }

  if (request.action === 'unsubscribe') {
    listeners[key] = (listeners[key] ?? 0) - 1;
    log('unsubscribe', request.payload);
    if (listeners[key] > 0) return;
    delete listeners[key];
    if (!subscribtions[key]) return;
    if (typeof subscribtions[key].unsubscribe === 'function') {
      log(`disconnect`, request.payload);
      subscribtions[key].unsubscribe();
    }
    delete subscribtions[key];
  }
});
