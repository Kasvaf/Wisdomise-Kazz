import clsx from 'clsx';
import type { ReactNode } from 'react';
import './style.css';

interface UnifiedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'buy' | 'sell' | 'neutral';
  size?: 'default' | 'compact' | 'circle' | 'icon';
  active?: boolean;
  disabled?: boolean;
  className?: string;
  block?: boolean;
  type?: 'button' | 'submit';
}

export function UnifiedButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  active = false,
  disabled = false,
  className = '',
  block = false,
  type = 'button',
}: UnifiedButtonProps) {
  return (
    <button
      className={clsx(
        'unified-btn',
        `unified-btn--${variant}`,
        {
          'unified-btn--active': active,
          'unified-btn--disabled': disabled,
          'unified-btn--block': block,
          'unified-btn--circle': size === 'circle',
          'unified-btn--compact': size === 'compact',
          'unified-btn--icon': size === 'icon',
        },
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
