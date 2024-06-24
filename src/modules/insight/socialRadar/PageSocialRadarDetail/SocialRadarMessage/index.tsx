import { type FC } from 'react';

import { useTranslation } from 'react-i18next';
import { type SocialRadarMessage as SocialRadarMessageType } from 'api/socialRadar';
import useModal from 'shared/useModal';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as TelegramIcon } from '../images/telegram.svg';
import { ReactComponent as TradingViewIcon } from '../images/trading_view.svg';
import { ReactComponent as RedditIcon } from '../images/reddit.svg';
import { ReactComponent as TwitterIcon } from '../images/twitter.svg';
import {
  SocialRadarMessageBody,
  SocialRadarMessageContainer,
  SocialRadarMessageFooter,
  SocialRadarMessageHeader,
} from './template';

export const CommentsModal: FC<{
  message: SocialRadarMessageType;
}> = ({ message }) => {
  return (
    <div className="max-h-[calc(100vh-4rem)] overflow-auto pt-12">
      <section className="bg-black/5 p-4">
        <SocialRadarMessage
          message={message}
          openable={false}
          className="m-auto w-full max-w-3xl bg-zinc-900"
        />
      </section>
      <section className="flex flex-col gap-4 bg-white/5 p-4">
        {message.social_type === 'reddit' &&
          message.content.top_comments.map((comment, idx) => (
            <SocialRadarMessageContainer
              key={`${comment.author}:${comment.score}:${idx}`}
              className="m-auto w-full max-w-3xl bg-zinc-900"
            >
              <SocialRadarMessageHeader
                title={comment.author}
                date={comment.related_at}
                icon={RedditIcon}
              />
              <SocialRadarMessageBody content={comment.body} />
            </SocialRadarMessageContainer>
          ))}
        {message.social_type === 'trading_view' &&
          message.content.timeline_contents.map((comment, idx) => (
            <SocialRadarMessageContainer
              key={`${comment.content}:${idx}`}
              className="m-auto w-full max-w-3xl bg-zinc-900"
            >
              <SocialRadarMessageHeader
                title={message.content.author_username}
                date={comment.created_at}
                icon={TradingViewIcon}
              />
              <SocialRadarMessageBody content={comment.content} />
            </SocialRadarMessageContainer>
          ))}
      </section>
    </div>
  );
};

export const SocialRadarMessage: FC<{
  message: SocialRadarMessageType;
  className?: string;
  openable?: boolean;
}> = ({ message, className, openable = true }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('social-radar');
  const [commentsModal, openCommentsModal] = useModal(CommentsModal, {
    width: isMobile ? '95%' : '60%',
    wrapClassName: '[&_.ant-modal-content]:!p-0',
    className: '!bg-transparent rounded-4xl',
  });

  return (
    <>
      <SocialRadarMessageContainer className={className}>
        {message.social_type === 'reddit' && (
          <>
            <SocialRadarMessageHeader
              icon={RedditIcon}
              title={message.content.subreddit}
              followers={message.content.num_subscribers}
              followersName={t('socials.reddit.followers')}
              date={message.content.related_at}
            />
            <SocialRadarMessageBody
              title={message.content.title}
              thumbnail={message.content.thumbnail}
              content={message.content.text}
            />
            <SocialRadarMessageFooter
              commentCount={message.content.num_comments}
              onClick={() =>
                openable ? openCommentsModal({ message }) : undefined
              }
            />
          </>
        )}
        {message.social_type === 'telegram' && (
          <>
            <SocialRadarMessageHeader
              icon={TelegramIcon}
              title={message.content.channel_name}
              followers={message.content.participants_count}
              followersName={t('socials.telegram.followers')}
              date={message.content.related_at}
            />
            <SocialRadarMessageBody
              thumbnail={message.content.photo_url}
              content={message.content.message_text}
            />
          </>
        )}
        {message.social_type === 'trading_view' && (
          <>
            <SocialRadarMessageHeader
              icon={TradingViewIcon}
              title={message.content.author_username}
              date={message.content.updated_at}
            />
            <SocialRadarMessageBody
              title={message.content.title}
              content={message.content.preview_text}
              thumbnail={message.content.cover_image_link}
            />
            <SocialRadarMessageFooter
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
            <SocialRadarMessageHeader
              icon={TwitterIcon}
              title={message.content.user.name}
              date={message.content.related_at}
            />
            <SocialRadarMessageBody
              content={message.content.text}
              thumbnail={
                Array.isArray(message.content.media)
                  ? message.content.media.find(x => x.type === 'photo')?.url
                  : message.content.media
              }
            />
            <SocialRadarMessageFooter
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
      </SocialRadarMessageContainer>
    </>
  );
};
