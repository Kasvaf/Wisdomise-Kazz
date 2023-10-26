import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Modal, type ModalProps } from 'antd';
import { clsx } from 'clsx';

interface ModalConfigs extends ModalProps {
  fullscreen?: boolean;
}

function useModal<T>(ModalContent: React.FC<T>, config?: ModalConfigs) {
  const props = useRef<Omit<T, 'onResolve'>>();
  const resolveHandler = useRef(noop);
  const [open, setOpen] = useState(false);

  const closeHandler = useCallback(() => resolveHandler.current(), []);

  const Component = useMemo(() => {
    if (!props.current) return <></>;
    return (
      <Modal
        open={open}
        footer={false}
        onCancel={closeHandler}
        width={500}
        wrapClassName={clsx(
          config?.fullscreen && 'fullscreen', // styles in override.css
        )}
        {...config}
      >
        <ModalContent
          {...(props.current as T)}
          onResolve={resolveHandler.current}
        />
      </Modal>
    );
  }, [ModalContent, open, closeHandler, config]);

  const update = useCallback((p: Omit<T, 'onResolve'>) => {
    props.current = p;
    setOpen(true);
    return new Promise(resolve => {
      resolveHandler.current = val => {
        setOpen(false);
        resolve(val);
      };
    });
  }, []);

  return [Component, update] as const;
}

const noop = (_val?: unknown) => {
  //
};

export default useModal;
