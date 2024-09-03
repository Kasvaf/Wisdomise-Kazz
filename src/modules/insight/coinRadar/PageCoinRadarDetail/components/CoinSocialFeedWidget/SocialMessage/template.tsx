import {
  type PropsWithChildren,
  type FC,
  type SVGProps,
  useState,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';
import AuthorizedImage from 'shared/AuthorizedImage';
import { TEMPLE_ORIGIN } from 'config/constants';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { ReactComponent as BoostsIcon } from '../images/boosts.svg';
import { ReactComponent as CommentsIcon } from '../images/comments.svg';
import { ReactComponent as LikesIcon } from '../images/likes.svg';
import { ReactComponent as RetweetIcon } from '../images/retweet.svg';

const Badge: FC<{
  icon?: FC<SVGProps<SVGSVGElement>>;
  children: ReactNode;
}> = ({ children, icon: Icon }) => (
  <span className="flex h-6 items-center gap-1 rounded-md bg-v1-surface-l3 px-2 text-xs">
    {Icon && <Icon className="size-3" />} {children}
  </span>
);

export const SocialMessageHeader: FC<{
  className?: string;
  title: string;
  followers?: number;
  followersName?: string;
  date?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  commentCount?: number;
  boostCount?: number;
  likeCount?: number;
  retweetCount?: number;
  onClick?: () => void;
}> = ({
  title,
  followers,
  followersName,
  date,
  icon: Icon,
  className,
  commentCount,
  boostCount,
  retweetCount,
  likeCount,
  onClick,
}) => (
  <div
    className={clsx(
      'flex h-12 items-center gap-3',
      typeof onClick === 'function' && 'cursor-pointer',
      className,
    )}
    tabIndex={typeof onClick === 'function' ? 0 : -1}
    onClick={onClick}
  >
    <div className="leading-none">
      <p className="text-sm font-light text-white">{title}</p>
      {typeof followers === 'number' && (
        <ReadableNumber
          className="block text-xxs font-light text-v1-content-secondary"
          value={followers}
          label={followersName}
        />
      )}
    </div>
    <div className="grow" />
    {Icon && <Icon className="size-6" />}
    {typeof commentCount === 'number' && (
      <Badge icon={CommentsIcon}>
        <ReadableNumber value={commentCount} />
      </Badge>
    )}
    {typeof boostCount === 'number' && (
      <Badge icon={BoostsIcon}>
        <ReadableNumber value={boostCount} />
      </Badge>
    )}
    {typeof retweetCount === 'number' && (
      <Badge icon={RetweetIcon}>
        <ReadableNumber value={retweetCount} />
      </Badge>
    )}
    {typeof likeCount === 'number' && (
      <Badge icon={LikesIcon}>
        <ReadableNumber value={likeCount} />
      </Badge>
    )}
    {date && (
      <Badge>
        <ReadableDate className="text-xs text-white/40" value={date} />
      </Badge>
    )}
  </div>
);

export const SocialMessageBody: FC<{
  className?: string;
  title?: string;
  content?: string;
  thumbnail?: string;
}> = ({ title, content, className, thumbnail }) => {
  const [thumbnailLoadError, setThumbnailLoadError] = useState(false);
  const thumbnailObject = (() => {
    if (!thumbnail) return null;
    const isLocal = !/^http(s?):\/\//.test(thumbnail);
    return {
      Component: thumbnailLoadError ? 'div' : isLocal ? AuthorizedImage : 'img',
      props: {
        className:
          'max-h-96 min-h-72 w-full rounded-lg bg-v1-surface-l3 object-contain',
        ...(!thumbnailLoadError && {
          src: isLocal ? TEMPLE_ORIGIN + thumbnail : thumbnail,
          onError: () => setThumbnailLoadError(true),
        }),
      },
    };
  })();
  return (
    <div
      className={clsx(
        'flex flex-col gap-3 text-xs leading-[1.7] text-v1-content-secondary',
        className,
      )}
    >
      {title && (
        <h3 className="text-sm font-medium text-v1-content-primary">
          {title.trim()}
        </h3>
      )}
      {content && (
        <p
          className="whitespace-pre-line font-normal [&_span]:text-v1-content-info"
          dangerouslySetInnerHTML={{
            __html: content
              .trim()
              .replaceAll(/(#|\$)\S+|\S+(\$|%)/g, x => `<span>${x}</span>`),
          }}
        />
      )}
      {thumbnailObject && (
        <thumbnailObject.Component {...thumbnailObject.props} />
      )}
    </div>
  );
};

export const SocialMessageContainer: FC<
  PropsWithChildren<{
    className?: string;
  }>
> = ({ children, className }) => {
  return (
    <div className={clsx('space-y-2 overflow-hidden', className)}>
      {children}
    </div>
  );
};
