import { useMemo } from 'react';
import { usePromise } from 'utils/usePromise';

function useDialog<TResult, MyDialogProps>(
  MyDialog: React.FC<
    MyDialogProps & { open: boolean; onResolve?: (val: TResult) => void }
  >,
) {
  const { run, isRunning, params, resolve } = usePromise<
    Omit<MyDialogProps, 'open' | 'onResolve'>,
    TResult
  >();

  const dialogParams = useMemo(
    () =>
      ({
        ...params,
        open: isRunning,
        onResolve: resolve,
      }) as any as MyDialogProps & {
        open: boolean;
        onResolve?: (val: TResult) => void;
      },
    [isRunning, params, resolve],
  );

  // biome-ignore lint/correctness/useJsxKeyInIterable: <reason>
  return [<MyDialog {...dialogParams} />, run] as const;
}

export default useDialog;
