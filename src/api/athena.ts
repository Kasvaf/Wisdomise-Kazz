import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { CHATAPP_ORIGIN } from 'config/constants';

export const useCreateChatSessionMutation = () =>
  useMutation(['session'], async () => {
    const { data } = await axios.post(`${CHATAPP_ORIGIN}/api/chat/chats/`);
    return data.key as string;
  });

interface ChatAppProfile {
  subscribed_questions_left: number;
}
export const useChatAppProfile = () =>
  useQuery(
    ['profile'],
    async () => {
      const { data } = await axios.get<ChatAppProfile>(
        `${CHATAPP_ORIGIN}/api/account/profile/`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
