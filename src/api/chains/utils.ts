import { useCallback, useEffect, useRef } from 'react';
import { ofetch } from 'config/ofetch';

export function usePromiseOfEffect({
  action,
  done,
  result,
}: {
  action: () => void;
  done?: boolean;
  result?: boolean;
}) {
  const resolver = useRef<((val: boolean) => void) | null>(null);
  const promiseRef = useRef<Promise<boolean> | null>(null);

  // Effect to resolve any pending promise when connected
  useEffect(() => {
    if (resolver.current && done) {
      resolver.current(result ?? false);
      resolver.current = null;
      promiseRef.current = null;
    }
  }, [done, result]);

  // This returns a fresh promise every time you want to wait for a connection
  const awaitConnection = useCallback(() => {
    if (!promiseRef.current) {
      promiseRef.current = new Promise(resolve => {
        resolver.current = resolve;
      });
      void action();
    }
    return promiseRef.current;
  }, [action]);

  return awaitConnection;
}

const cachedMappings: Record<string, string> = {};
export const queryContractSlugs = async (assets: string[]) => {
  const newKeys = assets.filter(x => !cachedMappings[x]).join(',');
  if (newKeys) {
    const mappings = await ofetch<
      Array<{
        slug: string;
        source_id: string;
      }>
    >('/delphi/market/symbol-mappings/', {
      query: {
        source: 'solana',
        source_ids: newKeys,
      },
    });
    const newMappings = Object.fromEntries(
      mappings.map(x => [x.source_id, x.slug]),
    );
    Object.assign(cachedMappings, newMappings);
  }
  return cachedMappings;
};
