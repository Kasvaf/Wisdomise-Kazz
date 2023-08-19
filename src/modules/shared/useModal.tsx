import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ModalV2 } from './ModalV2';

const noop = (val: unknown) => {
  //
};

function useModal<T extends Record<string, any>>(
  Modal: React.FC<T>,
): [React.FC, (p: T) => Promise<unknown>] {
  const [open, setOpen] = useState(false);
  const resolveHandler = useRef(noop);
  const props = useRef<T | undefined>();

  const closeHandler = useCallback(() => resolveHandler.current(undefined), []);
  const Component = useMemo(() => {
    if (!props.current) return <></>;
    return (
      <ModalV2 open={open} footer={false} onCancel={closeHandler} width={500}>
        <Modal {...props.current} onResolve={resolveHandler.current} />
      </ModalV2>
    );
  }, [Modal, open, closeHandler]);

  const update = useCallback((p: T) => {
    props.current = p;
    setOpen(true);
    return new Promise(resolve => {
      resolveHandler.current = val => {
        setOpen(false);
        resolve(val);
      };
    });
  }, []);

  return [() => Component, update];
}

export default useModal;
