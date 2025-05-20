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
      gcTime: Number.POSITIVE_INFINITY,
      retryDelay: (failureCount, err) =>
        1000 *
        (((err as any)?.statusCode === 429 ? 3 : 2) + Math.random()) *
        failureCount,
    },
  },
});

export const persisterOptions: OmitKeyof<
  PersistQueryClientOptions,
  'queryClient'
> = {
  persister: createAsyncStoragePersister({
    storage: {
      getItem: key =>
        cacheStorage
          .getItem(key)
          .then(resp => (resp as string) || null)
          .catch(() => null),
      setItem: (key, value) => cacheStorage.setItem(key, value),
      removeItem: key => cacheStorage.removeItem(key),
    },
  }),
  dehydrateOptions: {
    shouldDehydrateQuery: query =>
      (!query.meta ||
        !('persist' in query.meta) ||
        query.meta.persist !== false) &&
      !query.state.error,
    shouldDehydrateMutation: () => false,
    shouldRedactErrors: () => false,
  },
  // cache for up to 3 days
  maxAge: 1000 * 60 * 60 * 24 * 3,
};
