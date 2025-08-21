import { Drawer, Modal, type ModalProps } from 'antd';
import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
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
            footer={null}
            height={config.height ?? 'auto'}
            onClose={closeHandler}
            open={open}
            placement="bottom"
            rootClassName="modal-drawer"
            title={config.title}
            width={config.width ?? 500}
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
          footer={false}
          onCancel={closeHandler}
          open={open}
          title={config?.title}
          width={config?.width ?? 500}
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
