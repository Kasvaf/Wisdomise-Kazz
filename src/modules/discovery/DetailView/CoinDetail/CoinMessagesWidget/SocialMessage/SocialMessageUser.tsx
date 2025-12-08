import type { SocialMessage } from 'api/discovery';
import { clsx } from 'clsx';
import { useSocialMessage } from './useSocialMessage';

export function SocialMessageUser({
  message,
  className,
  type,
}: {
  message: SocialMessage;
  className?: string;
  type: 'title' | 'large-title';
}) {
  const { user } = useSocialMessage(message);

  const LinkComp = user.url ? 'a' : 'div';

  return (
    <LinkComp
      className={clsx(
        'flex max-w-full items-center gap-2 overflow-hidden',
        className,
      )}
      href={user.url}
      rel="noreferrer"
      target="_blank"
    >
      {user.avatar && (
        <img
          alt={user.name || 'User Avatar'}
          className={clsx(
            'size-6 shrink-0 rounded-full bg-v1-surface-l5 object-contain',
            type === 'title' ? 'size-6' : 'size-8',
          )}
          src={user.avatar}
        />
      )}
      <div>
        {user.name && (
          <div className="flex items-center gap-2 text-v1-content-primary text-xs">
            {user.name}
            {message.social_type === 'telegram' && !user.url && (
              <span className="rounded-xl bg-white/10 px-1 text-[9px]">
                {'VIP Channel'}
              </span>
            )}
          </div>
        )}
        {user.subtitle && (
          <p className="font-light text-2xs text-v1-content-secondary">
            {user.subtitle}
          </p>
        )}
      </div>
    </LinkComp>
  );
}
