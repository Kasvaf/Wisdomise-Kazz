import dayjs from 'dayjs';
import * as numerable from 'numerable';
import { clsx } from 'clsx';
import { TEMPLE_ORIGIN } from 'config/constants';
import AuthorizedImage from 'shared/AuthorizedImage';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as RedditIcon } from './images/reddit.svg';
import { ReactComponent as CommentIcon } from './images/comment.svg';

interface Props {
  date: string;
  text: string;
  title?: string;
  photo?: string;
  channel?: string;
  className?: string;
  membersCount?: number;
  commentsCount?: number;
  onCommentsClick?: () => void;
  type?: 'reddit' | 'telegram';
}

export default function MessageCard(props: Props) {
  return (
    <div
      className={clsx(
        'mb-4 break-inside-avoid rounded-xl bg-black/10',
        props.className,
      )}
    >
      <div className="flex h-12 items-center justify-between rounded-t-xl bg-black/20 pl-6 pr-4">
        <p className="text-sm">
          {props.channel}
          {props.membersCount && (
            <span className="ml-2 text-xs text-white/40 mobile:hidden">
              {numerable.format(props.membersCount, '0,0 a', {
                rounding: v => Number(v.toFixed(1)),
              })}{' '}
              {props.type === 'reddit' ? 'Members' : 'Subscribers'}
            </span>
          )}
        </p>

        <div className="flex items-center gap-4">
          {props.commentsCount && (
            <div
              onClick={props.onCommentsClick}
              className={clsx(
                'flex cursor-pointer items-center gap-1 rounded-md bg-white/10 p-1 text-xs hover:bg-white/5',
                'transition',
              )}
            >
              <CommentIcon />
              {props.commentsCount}
            </div>
          )}
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/40">
              {dayjs(props.date).format('MMM D - HH:mm')}
            </p>
            {props.type &&
              (props.type === 'telegram' ? <TelegramIcon /> : <RedditIcon />)}
          </div>
        </div>
      </div>

      <div className="p-4">
        {props.title && (
          <p className="mb-2 text-sm font-medium text-white/80">
            {props.title}
          </p>
        )}
        {props.photo && (
          <AuthorizedImage
            src={TEMPLE_ORIGIN + props.photo}
            className="mb-2 max-h-[700px] w-full rounded"
          />
        )}

        <pre
          className={clsx(
            'overflow-hidden whitespace-pre-line text-xs text-white/60',
            '[&_b]:text-[#34A3DA]',
          )}
          dangerouslySetInnerHTML={{
            __html: props.text.trim().replaceAll(/(#(\S)+)/g, '<b>$1</b>'),
          }}
        />
      </div>
    </div>
  );
}
