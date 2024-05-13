import { type SocialRadarTelegramMessage as Message } from 'api';
import MessageCard from './MessageCard';

export default function SocialRadarTelegramMessage({
  message,
}: {
  message: Message;
}) {
  return (
    <MessageCard
      type="telegram"
      date={message.related_at}
      photo={message.photo_url}
      text={message.message_text}
      channel={message.channel_name}
      membersCount={message.participants_count}
    />
  );
}
