import { clsx } from 'clsx';
import { type FC, type PropsWithChildren } from 'react';
import { Drawer, type DrawerProps } from 'antd';
import { bxX } from 'boxicons-quasar';
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
        '!bg-v1-surface-l3 text-white mobile:max-h-[95dvh]',
        className,
      )}
      height="auto"
      width="auto"
      closeIcon={
        <FabButton
          icon={bxX}
          size={24}
          className="rounded-lg bg-white/5 p-2 text-white/70 hover:!bg-white/10"
        />
      }
      placement={isMobile ? 'bottom' : 'right'}
      {...props}
    >
      <div className="w-[640px] max-w-full mobile:w-full">{children}</div>
    </Drawer>
  );
};
