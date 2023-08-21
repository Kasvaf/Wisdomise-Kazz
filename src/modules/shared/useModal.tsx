import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Modal, type ModalProps } from 'antd';

const noop = (_val?: unknown) => {
  //
};

function useModal<T extends Record<string, any>>(
  ModalContent: React.FC<T>,
  config?: ModalProps,
): [React.FC, (p: T) => Promise<unknown>] {
  const [open, setOpen] = useState(false);
  const resolveHandler = useRef(noop);
  const props = useRef<T | undefined>();

  const closeHandler = useCallback(() => resolveHandler.current(), []);
  const Component = useMemo(() => {
    if (!props.current) return <></>;
    return (
      <Modal
        open={open}
        footer={false}
        onCancel={closeHandler}
        width={500}
        {...config}
      >
        <ModalContent {...props.current} onResolve={resolveHandler.current} />
      </Modal>
    );
  }, [ModalContent, open, closeHandler, config]);

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
