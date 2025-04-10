import { clsx } from 'clsx';
import { type SVGProps, type PropsWithChildren } from 'react';

const BoxedIcon: React.FC<
  PropsWithChildren<{
    icon: React.FC<SVGProps<SVGSVGElement>>;
    variant?: 'default' | 'brand';
  }>
> = ({ icon: Icon, variant = 'default' }) => {
  return (
    <div
      className={clsx(
        'size-8 rounded-lg p-1.5',
        variant === 'default'
          ? 'bg-white/5'
          : 'bg-gradient-to-tr from-v1-background-accent to-v1-background-brand',
      )}
    >
      <Icon width="20" height="20" />
    </div>
  );
};

export default BoxedIcon;
