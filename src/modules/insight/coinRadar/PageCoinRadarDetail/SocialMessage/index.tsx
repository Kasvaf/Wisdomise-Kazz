import { type FC } from 'react';

import { useTranslation } from 'react-i18next';
import { type SocialMessage as SocialMessageType } from 'api/coinRadar';
import useModal from 'shared/useModal';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as TelegramIcon } from '../images/telegram.svg';
import { ReactComponent as TradingViewIcon } from '../images/trading_view.svg';
import { ReactComponent as RedditIcon } from '../images/reddit.svg';
import { ReactComponent as TwitterIcon } from '../images/twitter.svg';
import {
  SocialMessageBody,
  SocialMessageContainer,
  SocialMessageFooter,
  SocialMessageHeader,
} from './template';

export const CommentsModal: FC<{
  message: SocialMessageType;
}> = ({ message }) => {
  return (
    <div className="max-h-[calc(100vh-4rem)] overflow-auto pt-12">
      <section className="bg-black/5 p-4">
        <SocialMessage
          message={message}
          openable={false}
          className="m-auto w-full max-w-3xl bg-zinc-900"
        />
      </section>
      <section className="flex flex-col gap-4 bg-white/5 p-4">
        {message.social_type === 'reddit' &&
          message.content.top_comments.map((comment, idx) => (
            <SocialMessageContainer
              key={`${comment.author}:${comment.score}:${idx}`}
              className="m-auto w-full max-w-3xl bg-zinc-900"
            >
              <SocialMessageHeader
                title={comment.author}
                date={comment.related_at}
                icon={RedditIcon}
              />
              <SocialMessageBody content={comment.body} />
            </SocialMessageContainer>
          ))}
        {message.social_type === 'trading_view' &&
          message.content.timeline_contents.map((comment, idx) => (
            <SocialMessageContainer
              key={`${comment.content}:${idx}`}
              className="m-auto w-full max-w-3xl bg-zinc-900"
            >
              <SocialMessageHeader
                title={message.content.author_username}
                date={comment.created_at}
                icon={TradingViewIcon}
              />
              <SocialMessageBody content={comment.content} />
            </SocialMessageContainer>
          ))}
      </section>
    </div>
  );
};

export const SocialMessage: FC<{
  message: SocialMessageType;
  className?: string;
  openable?: boolean;
}> = ({ message, className, openable = true }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('coin-radar');
  const [commentsModal, openCommentsModal] = useModal(CommentsModal, {
    width: isMobile ? '95%' : '60%',
    wrapClassName: '[&_.ant-modal-content]:!p-0',
    className: '!bg-transparent rounded-4xl',
  });

  return (
    <>
      <SocialMessageContainer className={className}>
        {message.social_type === 'reddit' && (
          <>
            <SocialMessageHeader
              icon={RedditIcon}
              title={message.content.subreddit}
              followers={message.content.num_subscribers}
              followersName={t('socials.reddit.followers')}
              date={message.content.related_at}
            />
            <SocialMessageBody
              title={message.content.title}
              thumbnail={message.content.thumbnail}
              content={message.content.text}
            />
            <SocialMessageFooter
              commentCount={message.content.num_comments}
              onClick={() =>
                openable ? openCommentsModal({ message }) : undefined
              }
            />
          </>
        )}
        {message.social_type === 'telegram' && (
          <>
            <SocialMessageHeader
              icon={TelegramIcon}
              title={message.content.channel_name}
              followers={message.content.participants_count}
              followersName={t('socials.telegram.followers')}
              date={message.content.related_at}
            />
            <SocialMessageBody
              thumbnail={message.content.photo_url}
              content={message.content.message_text}
            />
          </>
        )}
        {message.social_type === 'trading_view' && (
          <>
            <SocialMessageHeader
              icon={TradingViewIcon}
              title={message.content.author_username}
              date={message.content.updated_at}
            />
            <SocialMessageBody
              title={message.content.title}
              content={message.content.preview_text}
              thumbnail={message.content.cover_image_link}
            />
            <SocialMessageFooter
              boostCount={message.content.social_boost_score}
              commentCount={message.content.total_comments}
              onClick={() =>
                openable ? openCommentsModal({ message }) : undefined
              }
            />
          </>
        )}
        {message.social_type === 'twitter' && (
          <>
            <SocialMessageHeader
              icon={TwitterIcon}
              title={message.content.user.name}
              date={message.content.related_at}
            />
            <SocialMessageBody
              content={message.content.text}
              thumbnail={
                Array.isArray(message.content.media)
                  ? message.content.media.find(x => x.type === 'photo')?.url
                  : message.content.media
              }
            />
            <SocialMessageFooter
              likeCount={message.content.like_count}
              commentCount={
                (message.content.reply_count || 0) +
                (message.content.quote_count || 0)
              }
              retweetCount={message.content.retweet_count}
            />
          </>
        )}
        {commentsModal}
      </SocialMessageContainer>
    </>
  );
};
