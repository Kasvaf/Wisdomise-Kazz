import { fetchEventSource } from '@microsoft/fetch-event-source';
import { type PropsWithChildren } from 'react';
import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useChatAppProfile, useCreateChatSessionMutation } from 'api';
import { getJwtToken } from 'modules/base/auth/jwt-store';
import { CHATAPP_ORIGIN } from 'config/constants';
import {
  type AthenaResponse,
  type AthenaTerminateEvent,
  type AthenaWidget,
} from './AthenaResponse';

interface AthenaContextInterface {
  answer: string;
  question: string;
  isLoading: boolean;
  abort?: VoidFunction;
  leftQuestions: number;
  widgets: AthenaWidget[];
  isAnswerFinished: boolean;
  askQuestion: (question: string) => void;
  setLeftQuestions: (count: number) => void;
  terminationData: AthenaTerminateEvent | null;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
}

export const AthenaProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const profile = useChatAppProfile();
  const abort = useRef<VoidFunction>();
  const [question, setQuestion] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const chatSession = useCreateChatSessionMutation();
  const [leftQuestions, setLeftQuestions] = useState(
    profile.data?.questions_left || 0,
  );
  const [widgets, setWidgets] = useState<AthenaWidget[]>([]);
  const [isAnswerFinished, setIsAnswerFinished] = useState(false);
  const [terminationData, setTerminationData] =
    useState<AthenaTerminateEvent | null>(null);

  const askQuestion = useCallback(
    async (question: string) => {
      question = question.trim();

      if (leftQuestions <= 0) {
        setLeftQuestions(v => v - 1);
        return;
      }

      if (question.length === 0) return;

      setWords([]);
      setWidgets([]);
      setLoading(true);
      setQuestion(question);
      setTerminationData(null);
      setIsAnswerFinished(false);
      setLeftQuestions(v => v - 1);

      const jwtToken = getJwtToken();
      abort.current?.();
      const controller = new AbortController();
      abort.current = () => controller.abort();

      void fetchEventSource(
        `${CHATAPP_ORIGIN}/api/chat/chats/${await chatSession.mutateAsync()}/qa/ask/?q="${question}"&lang=${
          i18n.language === 'ja' ? 'ja' : 'en'
        }`,
        {
          headers: {
            Accept: '*/*',
            ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
          },
          openWhenHidden: true,
          signal: controller.signal,

          onopen: async response => {
            setLoading(false);
            if (jwtToken) {
              void profile.refetch();
            }
            if (!response.ok) {
              // const error = await response.text();
              if (response.status === 429) {
                // toast
              }

              setWidgets([]);
              setLoading(false);
              setIsAnswerFinished(false);
              controller.abort();
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
    [leftQuestions, chatSession, i18n.language, profile],
  );

  useEffect(() => {
    if (profile.data) {
      setLeftQuestions(profile.data.questions_left);
    }
  }, [profile.data]);

  return (
    <context.Provider
      value={{
        widgets,
        question,
        isLoading,
        askQuestion,
        setQuestion,
        leftQuestions,
        terminationData,
        isAnswerFinished,
        setLeftQuestions,
        abort: abort.current,
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
