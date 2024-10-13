import { Drawer } from 'antd';
import type { DrawerProps } from 'antd';

export default function BottomDrawer({ children, ...otherProps }: DrawerProps) {
  return (
    <Drawer
      placement="bottom"
      {...otherProps}
      maskStyle={{ backdropFilter: 'blur(10px)' }}
      drawerStyle={{ borderRadius: '1.5rem', background: 'transparent' }}
      contentWrapperStyle={{
        borderRadius: '1.5rem',
        background: 'transparent',
      }}
      bodyStyle={{
        borderRadius: '1.5rem 1.5rem 0 0',
        background: '#131920',
      }}
      headerStyle={{
        display: 'none',
      }}
    >
      {otherProps.maskClosable && (
        <button
          onClick={otherProps.onClose}
          className="absolute start-1/2 top-3 h-1.5 w-10 -translate-x-1/2 rounded-3xl bg-white/40"
        ></button>
      )}
      <div className="h-full text-white">{children}</div>
    </Drawer>
  );
}
