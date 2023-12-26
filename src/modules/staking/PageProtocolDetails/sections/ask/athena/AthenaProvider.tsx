import { fetchEventSource } from '@microsoft/fetch-event-source';
import * as Sentry from '@sentry/react';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
  useRef,
} from 'react';
import { getJwtToken } from 'modules/auth/jwt-store';
import { CHATAPP_ORIGIN } from 'config/constants';
import { useChatAppProfile, useCreateChatSessionMutation } from 'api/athena';
import {
  type AthenaResponse,
  type AthenaTerminateEvent,
  type AthenaWidget,
} from './AthenaResponse';

interface AthenaContextInterface {
  answer: string;
  question: string;
  isLoading: boolean;
  leftQuestions: number;
  widgets: AthenaWidget[];
  isAnswerFinished: boolean;
  askQuestion: (question: string) => void;
  terminationData: AthenaTerminateEvent | null;
}

export const AthenaProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const abort = useRef<AbortController>();
  const [question, setQuestion] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const chatSession = useCreateChatSessionMutation();
  const [widgets, setWidgets] = useState<AthenaWidget[]>([]);
  const [isAnswerFinished, setIsAnswerFinished] = useState(false);
  const [terminationData, setTerminationData] =
    useState<AthenaTerminateEvent | null>(null);
  const { data: profileData, refetch: refetchProfile } = useChatAppProfile();

  const leftQuestions = profileData?.subscribed_questions_left || 0;

  const askQuestion = useCallback(
    async (question: string) => {
      question = question.trim();

      if (leftQuestions <= 0 || question.length === 0) return;

      setWords([]);
      setWidgets([]);
      setLoading(true);
      setQuestion(question);
      setTerminationData(null);
      setIsAnswerFinished(false);

      if (abort.current) abort.current.abort();
      abort.current = new AbortController();

      void fetchEventSource(
        `${CHATAPP_ORIGIN}/api/chat/chats/${await chatSession.mutateAsync()}/qa/ask/?q="${question}"`,
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${getJwtToken() ?? ''}`,
          },
          openWhenHidden: true,
          signal: abort.current.signal,

          onopen: async response => {
            setLoading(false);
            void refetchProfile();

            if (!response.ok) {
              const error = await response.text();
              if (response.status === 429) {
                // You have asked too many questions.
              }

              setWidgets([]);
              setIsAnswerFinished(false);
              abort.current?.abort();

              Sentry.captureException(error, {
                tags: {
                  question,
                  category: 'backend_error',
                  backendError: true,
                },
                extra: { question },
              });
            }
          },

          onmessage: e => {
            const data: AthenaResponse = JSON.parse(e.data);
            data.event = e.event || ('message' as any);

            switch (data.event) {
              case 'trigger': {
                setWidgets(prev => [
                  ...prev,
                  ...data.widgets.filter(w => w.type !== 'no_specific_widget'),
                ]);
                break;
              }
              case 'message': {
                setWords(w => [...w, data.choices[0]?.delta.content]);
                break;
              }
              case 'terminate': {
                setTerminationData(data);
                setIsAnswerFinished(true);
                setWidgets(
                  data.widgets.filter(w => w.type !== 'no_specific_widget'),
                );
                break;
              }
            }
          },
        },
      );
    },
    [leftQuestions, chatSession, refetchProfile],
  );

  return (
    <context.Provider
      value={{
        widgets,
        question,
        isLoading,
        askQuestion,
        leftQuestions,
        terminationData,
        isAnswerFinished,
        answer: words.join(''),
      }}
    >
      {children}
    </context.Provider>
  );
};

const context = createContext<AthenaContextInterface | null>(null);

export const useAthena = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('Athena Provider not found');
  }
  return ctx;
};
