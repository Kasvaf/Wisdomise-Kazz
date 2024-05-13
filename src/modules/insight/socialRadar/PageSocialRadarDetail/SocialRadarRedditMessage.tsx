import { type SocialRadarRedditMessage as Message } from 'api';
import useModal from 'shared/useModal';
import useIsMobile from 'utils/useIsMobile';
import MessageCard from './MessageCard';

export default function SocialRadarRedditMessage({
  message,
}: {
  message: Message;
}) {
  const isMobile = useIsMobile();
  const [modal, open] = useModal(RedditCommentsModal, {
    width: isMobile ? '95%' : '60%',
    wrapClassName: '[&_.ant-modal-content]:!p-0',
  });
  return (
    <>
      <MessageCard
        type="reddit"
        text={message.text}
        title={message.title}
        onCommentsClick={() => open({ message })}
        date={message.related_at}
        channel={message.subreddit}
        commentsCount={message.num_comments}
        membersCount={message.num_subscribers}
      />
      {modal}
    </>
  );
}

const RedditCommentsModal = ({ message }: { message: Message }) => {
  return (
    <section>
      <section className="max-h-[50vh] overflow-auto rounded-t-lg bg-black/30 p-10 mobile:p-2 mobile:pt-10">
        <MessageCard
          type="reddit"
          className="!mb-0"
          text={message.text}
          title={message.title}
          date={message.related_at}
          channel={message.subreddit}
          membersCount={message.num_subscribers}
        />
      </section>
      <section className="max-h-[40vh] overflow-auto rounded-b-lg bg-[#343942] px-20 py-5 mobile:p-2">
        {message.top_comments
          .sort((a, b) => a.score - b.score)
          .map(comment => (
            <MessageCard
              key={comment.body}
              text={comment.body}
              channel={comment.author}
              date={comment.related_at}
            />
          ))}
      </section>
    </section>
  );
};
