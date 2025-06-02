import { clsx } from 'clsx';
import { type SocialMessage } from 'api/discovery';
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
      target="_blank"
      rel="noreferrer"
    >
      {user.avatar && (
        <img
          src={user.avatar}
          alt={user.name || 'User Avatar'}
          className={clsx(
            'size-6 shrink-0 rounded-full bg-v1-surface-l5 object-contain',
            type === 'title' ? 'size-6' : 'size-8',
          )}
        />
      )}
      <div>
        {user.name && (
          <div className="flex items-center gap-2 text-xs text-v1-content-primary">
            {user.name}
            {message.social_type === 'telegram' && !user.url && (
              <span className="rounded-xl bg-white/10 px-1 text-[9px]">
                {'VIP Channel'}
              </span>
            )}
          </div>
        )}
        {user.subtitle && (
          <p className="text-xxs font-light text-v1-content-secondary">
            {user.subtitle}
          </p>
        )}
      </div>
    </LinkComp>
  );
}
