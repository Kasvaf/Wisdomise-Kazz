import { type FC } from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { type CommunityProfile } from 'api';
import { ProfilePhoto } from './ProfilePhoto';
import { VerifiedBadge } from './assets';
import { truncateUserId } from './truncateUserId';

export const ProfileLink: FC<{
  userId: string;
  profile?: CommunityProfile;
  className?: string;
}> = ({ userId, profile, className }) => (
  <NavLink
    className={clsx(
      'inline-flex items-center gap-1 rounded-full bg-black/30 p-1 pr-3 text-xs',
      'transition-colors hover:bg-white/10 hover:text-white',
      className,
    )}
    to={`/users/${userId}`}
  >
    <ProfilePhoto
      className="size-6 shrink-0 rounded-full"
      type="avatar"
      src={profile?.profile_image}
    />
    <span
      className={clsx(
        'max-w-36 overflow-hidden text-ellipsis',
        profile?.nickname
          ? 'font-normal'
          : 'font-mono font-extralight opacity-80',
      )}
    >
      {profile?.nickname || truncateUserId(userId)}
    </span>
    {profile?.verified && <VerifiedBadge className="h-4 w-auto shrink-0" />}
  </NavLink>
);
