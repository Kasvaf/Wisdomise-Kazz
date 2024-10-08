import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

const Link: React.FC<
  PropsWithChildren<{ href: string; target?: string; className?: string }>
> = ({ href, target, className, children }) => {
  return (
    <a
      href={href}
      target={target}
      className={clsx(
        'text-v1-content-link hover:text-v1-content-link-hover active:text-v1-content-link-pressed',
        className,
      )}
    >
      {children}
    </a>
  );
};

export default Link;
