import { type OmitKeyof, QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { type PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import localForge from 'localforage';

const cacheStorage = localForge.createInstance({
  name: 'api-cache',
  driver: [localForge.INDEXEDDB, localForge.WEBSQL, localForge.LOCALSTORAGE],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: (failureCount, err) =>
        1000 *
        (((err as any)?.statusCode === 429 ? 3 : 2) + Math.random()) *
        failureCount,
      gcTime: Number.POSITIVE_INFINITY,
    },
  },
});

export const PERSIST_KEY = 'persist';

export const persisterOptions: OmitKeyof<
  PersistQueryClientOptions,
  'queryClient'
> = {
  persister: createAsyncStoragePersister({
    storage: cacheStorage,
  }),
  dehydrateOptions: {
    shouldDehydrateQuery: query => query.queryKey.includes(PERSIST_KEY),
  },
};

export default queryClient;
