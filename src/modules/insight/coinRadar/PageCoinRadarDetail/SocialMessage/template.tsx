import {
  type PropsWithChildren,
  type FC,
  type SVGProps,
  useState,
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

export const SocialMessageHeader: FC<{
  className?: string;
  title: string;
  followers?: number;
  followersName?: string;
  date?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}> = ({ title, followers, followersName, date, icon: Icon, className }) => (
  <div
    className={clsx('flex h-12 items-center gap-3 bg-black/20 px-4', className)}
  >
    <h3 className="text-sm text-white">{title}</h3>
    {typeof followers === 'number' && (
      <ReadableNumber
        className="text-xs text-white/40"
        value={followers}
        label={followersName}
      />
    )}
    <div className="grow" />
    {date && <ReadableDate className="text-xs text-white/40" value={date} />}
    {Icon && <Icon className="h-5 w-5" />}
  </div>
);

const CountItem: FC<{
  icon: FC<SVGProps<SVGSVGElement>>;
  count: number;
}> = ({ count, icon: Icon }) => (
  <span className="flex h-6 items-center gap-1 rounded-md bg-white/10 px-2 text-xs">
    <Icon className="h-4 w-4" /> <ReadableNumber value={count} />
  </span>
);

export const SocialMessageFooter: FC<{
  className?: string;
  commentCount?: number;
  boostCount?: number;
  likeCount?: number;
  retweetCount?: number;
  onClick?: () => void;
}> = ({
  commentCount,
  boostCount,
  retweetCount,
  likeCount,
  onClick,
  className,
}) => (
  <div
    className={clsx(
      'flex h-12 items-center justify-end gap-2 bg-black/20 px-4',
      typeof onClick === 'function' && 'cursor-pointer hover:bg-black/10',
      className,
    )}
    tabIndex={typeof onClick === 'function' ? 0 : -1}
    onClick={onClick}
  >
    {typeof commentCount === 'number' && (
      <CountItem icon={CommentsIcon} count={commentCount} />
    )}
    {typeof boostCount === 'number' && (
      <CountItem icon={BoostsIcon} count={boostCount} />
    )}
    {typeof retweetCount === 'number' && (
      <CountItem icon={RetweetIcon} count={retweetCount} />
    )}
    {typeof likeCount === 'number' && (
      <CountItem icon={LikesIcon} count={likeCount} />
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
          'max-h-96 min-h-72 w-full rounded-lg bg-black/10 object-contain',
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
        'flex flex-col gap-4 p-4 text-xs leading-[1.7] text-zinc-400',
        className,
      )}
    >
      {thumbnailObject && (
        <thumbnailObject.Component {...thumbnailObject.props} />
      )}
      {title && <h3 className="text-sm text-zinc-100">{title.trim()}</h3>}
      {content && (
        <p
          className="whitespace-pre-line [&_span]:text-[#34A3DA]"
          dangerouslySetInnerHTML={{
            __html: content
              .trim()
              .replaceAll(/(#|\$)\S+|\S+(\$|%)/g, x => `<span>${x}</span>`),
          }}
        />
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
    <div className={clsx('overflow-hidden rounded-xl bg-black/10', className)}>
      {children}
    </div>
  );
};
