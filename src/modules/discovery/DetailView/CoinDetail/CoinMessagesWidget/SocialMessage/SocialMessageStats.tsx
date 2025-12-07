import type { SocialMessage } from 'api/discovery';
import { clsx } from 'clsx';
import { ReadableNumber } from 'shared/ReadableNumber';
import {
  BoostIcon,
  CommentIcon,
  DownIcon,
  LikeIcon,
  ShareIcon,
  UpIcon,
  ViewIcon,
} from './icons';
import { useSocialMessage } from './useSocialMessage';

const badgeClassName = clsx(
  'flex h-6 shrink-0 items-center justify-center rounded-full px-2 text-xs capitalize max-md:px-2 [&_svg]:size-[14px]',
  'gap-1 bg-v1-surface-l3 text-v1-content-primary',
);

export function SocialMessageStats({ message }: { message: SocialMessage }) {
  const fields = useSocialMessage(message);

  return (
    <>
      {typeof fields.views === 'number' && (
        <span className={clsx(badgeClassName)}>
          <ViewIcon />
          <ReadableNumber value={fields.views} />
        </span>
      )}
      {typeof fields.ups === 'number' && fields.ups > 0 && (
        <span className={clsx(badgeClassName)}>
          <UpIcon />
          <ReadableNumber value={fields.ups} />
        </span>
      )}
      {typeof fields.downs === 'number' && fields.downs > 0 && (
        <span className={clsx(badgeClassName)}>
          <DownIcon />
          <ReadableNumber value={fields.downs} />
        </span>
      )}
      {typeof fields.boosts === 'number' && (
        <span className={clsx(badgeClassName)}>
          <BoostIcon />
          <ReadableNumber value={fields.boosts} />
        </span>
      )}
      {typeof fields.likes === 'number' && (
        <span className={clsx(badgeClassName)}>
          <LikeIcon />
          <ReadableNumber value={fields.likes} />
        </span>
      )}
      {typeof fields.comments === 'number' && (
        <span className={clsx(badgeClassName)}>
          <CommentIcon />
          <ReadableNumber value={fields.comments} />
        </span>
      )}
      {typeof fields.shares === 'number' && (
        <span className={clsx(badgeClassName)}>
          <ShareIcon />
          <ReadableNumber value={fields.shares} />
        </span>
      )}
    </>
  );
}
