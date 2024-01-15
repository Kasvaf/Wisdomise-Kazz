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
import {
  useAccountQuery,
  useChatAppProfile,
  useCreateChatSessionMutation,
} from 'api';
import { getJwtToken } from 'modules/auth/jwt-store';
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
  const user = useAccountQuery();
  const { i18n } = useTranslation();
  const profile = useChatAppProfile();
  const abort = useRef<VoidFunction>();
  const [question, setQuestion] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const chatSession = useCreateChatSessionMutation();
  const [leftQuestions, setLeftQuestions] = useState(0);
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
      const controller = new AbortController();
      abort.current = () => controller.abort();

      // setQuestion(res.question);
      // setLoading(false);
      // setWidgets(res.widgets as any);
      // setIsAnswerFinished(true);
      // setWords([res.answer] as any);
      // setTerminationData(res as any);
      // return;

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
            if (jwtToken) void user.refetch();
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
    [leftQuestions, chatSession, i18n.language, user],
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

// eslint-disable-next-line unused-imports/no-unused-vars
// const res = {
//   key: '5744ca57-308c-415d-8b9c-171536d74cbf',
//   created_at: '2023-12-04T11:25:27.901910Z',
//   question: 'Give me todays overview of the crypto market',
//   answer:
//     "Today's crypto market seems to be in a corrective phase, mostly impacted by a series of regulatory enforcement events. Major cryptocurrencies like <b>Bitcoin</b> and <b>Ether</b> have been affected, which in turn has weighed on the prices of various altcoins. <br><br>In particular, the market continues to react to the recent settlement against <b>Changpeng “CZ” Zhao</b> and <b>Binance</b>, amounting to a significant $4.3 billion. Such regulatory pressures often create a level of uncertainty in the market, which can lead to risk-off sentiment among investors and traders, thus driving prices down.<br><br>It's critical to stay updated with my knowledge as well as to monitor key market indicators, as they provide insights into the market's potential future direction. As always, diversification and risk management are essential tools for managing the inherent volatility of the crypto market.",
//   feedback: 'NO_FEEDBACK',
//   subject: {
//     category: 'crypto_market_news_events',
//     symbols: ['btc', 'eth'],
//   },
//   context_sources: [
//     {
//       description:
//         'Bitcoin ETF Token ($BTCETF) Price Prediction 2023, 2024, 2025, 2030',
//       url: 'https://www.techopedia.com/cryptocurrency/bitcoin-etf-token-price-prediction',
//     },
//     {
//       description: 'Why is the crypto market down today?',
//       url: 'https://www.tradingview.com/news/cointelegraph:8159c135e094b:0-why-is-the-crypto-market-down-today/',
//     },
//     {
//       description: '',
//       url: 'https://www.tradingview.com/news/',
//     },
//   ],
//   widgets: [
//     {
//       type: 'news',
//       settings: {},
//       symbol: 'btc',
//     },
//     {
//       type: 'lunar_crush_top_tweets',
//       settings: {},
//       symbol: 'no_mentioned_symbol',
//     },
//     {
//       type: 'last_positions',
//       settings: {},
//       symbol: 'no_mentioned_symbol',
//     },
//     {
//       type: 'price_chart',
//       settings: {
//         autosize: true,
//         interval: 'D',
//         timezone: 'Etc/UTC',
//         theme: 'dark',
//         style: '1',
//         locale: 'en',
//         toolbar_bg: '#f1f3f6',
//         enable_publishing: false,
//         allow_symbol_change: true,
//         container_id: 'tradingview_adde9',
//       },
//       symbol: 'CRYPTO:BNBUSD',
//     },
//   ],
//   following_questions: [
//     {
//       root_question_subject_category: 'crypto_market_news_events',
//       interface_text:
//         "What's a good long-term investment strategy for btc,eth?",
//       exact_text: 'Can you suggest some long-term investing tips for btc,eth?',
//     },
//     {
//       root_question_subject_category: 'crypto_market_news_events',
//       interface_text: 'What are the legal aspects of cryptocurrency trading?',
//       exact_text:
//         'Can you explain the legal and regulatory framework for cryptocurrencies?',
//     },
//   ],
//   event: 'terminate',
// };
