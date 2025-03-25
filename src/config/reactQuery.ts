import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: (failureCount, err) =>
        1000 *
        (((err as any)?.statusCode === 429 ? 3 : 2) + Math.random()) *
        failureCount,
    },
  },
});

export default queryClient;
