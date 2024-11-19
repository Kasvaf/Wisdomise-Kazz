import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Drawer, Modal, type ModalProps } from 'antd';
import { clsx } from 'clsx';
import useIsMobile from 'utils/useIsMobile';

interface ModalConfigs extends ModalProps {
  height?: number;
  fullscreen?: boolean;
  introStyle?: boolean;
  mobileDrawer?: boolean;
}

function useModal<T>(ModalContent: React.FC<T>, config?: ModalConfigs) {
  const props = useRef<Omit<T, 'onResolve'>>();
  const resolveHandler = useRef(noop);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const closeHandler = useCallback(() => resolveHandler.current(), []);

  const Component = useMemo(() => {
    if (!props.current) return <></>;

    if (config?.mobileDrawer && isMobile) {
      return (
        <div onClick={e => e.stopPropagation()}>
          <Drawer
            title={config.title}
            placement="bottom"
            open={open}
            footer={null}
            width={config.width ?? 500}
            height={config.height ?? 'auto'}
            onClose={closeHandler}
            rootClassName="modal-drawer"
            {...config}
          >
            <ModalContent
              {...(props.current as T)}
              onResolve={resolveHandler.current}
            />
          </Drawer>
        </div>
      );
    }

    return (
      <div onClick={e => e.stopPropagation()}>
        <Modal
          centered
          title={config?.title}
          open={open}
          footer={false}
          width={config?.width ?? 500}
          onCancel={closeHandler}
          wrapClassName={clsx(
            config?.introStyle && 'intro-style',
            config?.fullscreen && 'fullscreen', // styles in override.css
          )}
          {...config}
        >
          <ModalContent
            {...(props.current as T)}
            onResolve={resolveHandler.current}
          />
        </Modal>
      </div>
    );
  }, [config, isMobile, open, closeHandler, ModalContent]);

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
