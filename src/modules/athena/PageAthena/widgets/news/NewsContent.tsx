/* eslint-disable @typescript-eslint/naming-convention */
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import arrowRightImg from './arrow-right.svg';
import { type Article } from './useNewsQuery';

interface Props {
  data: Article;
  open: boolean;
  onReadMoreLessClick: (id: string) => void;
}

export function NewsContent({ data, open, onReadMoreLessClick }: Props) {
  const {
    id,
    title,
    published_at,
    content: fullContent,
    image_link,
    link: url,
  } = data;
  const lessMessage = fullContent?.substring(0, 150) || '';

  return (
    <div
      id={'news-' + id}
      className="-mx-8 mb-2 bg-black/20 px-6 py-4 last:mb-0 max-md:-mx-3"
    >
      <div className="mb-4 text-base font-bold">{title}</div>
      {image_link && (
        <img
          loading="lazy"
          src={image_link}
          className="my-2 w-full rounded-lg"
          alt="Article thumbnail"
        />
      )}
      <div className="my-4 text-sm">
        <div
          className={clsx('relative hidden text-white/70', open && '!block')}
        >
          {fullContent}
          <br />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block underline"
          >
            Source
          </a>
        </div>
        <div className={clsx('text-white/70', open && 'hidden')}>
          {lessMessage + ' ...'}
        </div>
      </div>

      <section className="flex justify-between">
        <div className="mb-4 text-xs text-white/50">
          {dayjs(published_at).format('MMM D, YYYY , HH:mm')}
        </div>
        <button
          onClick={() => onReadMoreLessClick(id)}
          className="ml-auto flex h-7 items-center justify-center gap-x-2 rounded bg-white/10 px-4 text-xs leading-none transition-colors hover:bg-white/20"
        >
          {open ? 'show less' : 'show more'}
          <img
            src={arrowRightImg}
            width={10}
            height={10}
            className={clsx('rotate-90', open && '!-rotate-90')}
          />
        </button>
      </section>
    </div>
  );
}
