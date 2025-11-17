import { Drawer, type DrawerProps } from 'antd';
import { bxX } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import useIsMobile from 'utils/useIsMobile';
import FabButton from './FabButton';

export const DrawerModal: FC<PropsWithChildren<DrawerProps>> = ({
  children,
  className,
  ...props
}) => {
  const isMobile = useIsMobile();
  return (
    <Drawer
      className={clsx(
        '!bg-v1-surface-l0 mobile:max-h-[90dvh] text-white',
        className,
      )}
      closeIcon={
        <FabButton
          className="hover:!bg-white/10 rounded-lg bg-white/5 p-2 text-white/70"
          icon={bxX}
          size={24}
        />
      }
      height="auto"
      placement={isMobile ? 'bottom' : 'right'}
      width="auto"
      {...props}
    >
      <div className="mobile:w-full w-[640px] max-w-full">{children}</div>
    </Drawer>
  );
};
