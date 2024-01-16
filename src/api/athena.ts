import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { CHATAPP_ORIGIN } from 'config/constants';

export const useCreateChatSessionMutation = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(CHATAPP_ORIGIN + '/api/chat/chats/');
      return data.key as string;
    },
  });

interface ChatAppProfile {
  questions_left: number;
}
export const useChatAppProfile = () =>
  useQuery(
    ['chatapp-profile'],
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

interface LandingQuestions {
  children: [
    {
      template_questions: [
        {
          key: string;
          template_prompt: string;
          interface_prompt: string;
        },
      ];
      title: 'string';
    },
  ];
}

export const useLandingQuestions = () =>
  useQuery({
    queryKey: ['landing-question'],
    queryFn: async () => {
      const { data } = await axios.get<LandingQuestions>(
        CHATAPP_ORIGIN +
          '/api/template/question_pool/athena_landing_section_question_pool/',
      );
      return data;
    },
  });
