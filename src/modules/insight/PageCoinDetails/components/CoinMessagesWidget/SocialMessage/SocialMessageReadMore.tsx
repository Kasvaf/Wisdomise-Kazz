import { clsx } from 'clsx';
import { type FC } from 'react';
import { ArrowRight, ExternalLink } from './icons';

export const SocialMessageReadMore: FC<{
  className?: string;
  href?: string;
  onClick?: () => void;
}> = ({ className, href, onClick }) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={clsx(
          'inline-flex size-6 items-center justify-center rounded-full bg-v1-content-brand/10 text-v1-content-brand',
          className,
        )}
      >
        <ExternalLink />
      </a>
    );
  }
  return (
    <button
      className={clsx(
        'inline-flex size-6 items-center justify-center rounded-full bg-v1-surface-l3 text-v1-content-primary',
        className,
      )}
      onClick={onClick}
    >
      <ArrowRight />
    </button>
  );
};
