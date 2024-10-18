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
  SocialMessageHeader,
} from './template';

export const CommentsModal: FC<{
  message: SocialMessageType;
}> = ({ message }) => {
  return (
    <div className="max-h-[calc(100vh-4rem)] overflow-auto bg-v1-surface-l2 pt-12">
      <section className="p-4">
        <SocialMessage
          message={message}
          openable={false}
          className="m-auto w-full max-w-3xl"
        />
      </section>
      <div className="my-4 h-px bg-v1-border-tertiary" />
      <section className="flex flex-col gap-8 p-4">
        {message.social_type === 'reddit' &&
          message.content.top_comments.map((comment, idx) => (
            <SocialMessageContainer
              key={`${comment.author}:${comment.score}:${idx}`}
              className="m-auto w-full max-w-3xl"
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
              followersName={t(
                'coin-details.tabs.socials.types.reddit.followers',
              )}
              date={message.content.related_at}
              commentCount={message.content.num_comments}
              onClick={() =>
                openable ? openCommentsModal({ message }) : undefined
              }
            />
            <SocialMessageBody
              title={message.content.title}
              thumbnail={message.content.thumbnail}
              content={message.content.text}
            />
          </>
        )}
        {message.social_type === 'telegram' && (
          <>
            <SocialMessageHeader
              icon={TelegramIcon}
              title={message.content.channel_name}
              followers={message.content.participants_count}
              followersName={t(
                'coin-details.tabs.socials.types.telegram.followers',
              )}
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
              date={message.content.author_updated_at}
              boostCount={message.content.social_boost_score}
              commentCount={message.content.total_comments}
              onClick={() =>
                openable ? openCommentsModal({ message }) : undefined
              }
            />
            <SocialMessageBody
              title={message.content.title}
              content={message.content.preview_text}
              thumbnail={message.content.cover_image_link}
            />
          </>
        )}
        {message.social_type === 'twitter' && (
          <>
            <SocialMessageHeader
              icon={TwitterIcon}
              title={message.content.user.name}
              date={message.content.related_at}
              likeCount={message.content.like_count}
              commentCount={
                (message.content.reply_count || 0) +
                (message.content.quote_count || 0)
              }
              retweetCount={message.content.retweet_count}
            />
            <SocialMessageBody
              content={message.content.text}
              thumbnail={
                Array.isArray(message.content.media)
                  ? message.content.media.find(x => x.type === 'photo')?.url
                  : message.content.media
              }
            />
          </>
        )}
        {commentsModal}
      </SocialMessageContainer>
    </>
  );
};
