import { type DependencyList, useEffect, useRef } from 'react';

export const useChangesDebugger = (
  dependencies: DependencyList,
  dependencyNames: string[],
) => {
  const previousDeps = useRef<DependencyList>([]);
  useEffect(() => {
    previousDeps.current = dependencies;
  });

  const changedDeps = dependencies.reduce(
    (
      accum: Record<string, [unknown, unknown]>,
      dependency: unknown,
      index: number,
    ) => {
      if (dependency !== previousDeps.current[index]) {
        const keyName = dependencyNames[index] ?? index.toString();
        return {
          ...accum,
          [keyName as never]: [previousDeps.current[index], dependency],
        };
      }

      return accum;
    },
    {},
  );

  if (Object.keys(changedDeps).length > 0) {
    // eslint-disable-next-line no-console
    console.log('🔄', changedDeps);
  }
};
