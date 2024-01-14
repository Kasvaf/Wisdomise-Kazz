import { useCallback, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccountQuery, useSubscription } from 'api';
import { useAthena } from 'modules/athena/core';
import { useBotAlert } from './BotAlertProvider';

export const BotAlertMessages = () => {
  const navigate = useNavigate();
  const { alert } = useBotAlert();
  const profile = useAccountQuery();
  const [params] = useSearchParams();
  const { leftQuestions, question, isAnswerFinished } = useAthena();
  const { athenaQuestionsCount, isTrialPlan, isLoading } = useSubscription();

  const toBilling = useCallback(() => {
    navigate('/account/billing');
  }, [navigate]);

  useEffect(() => {
    if (isTrialPlan) {
      if (leftQuestions > 0) {
        alert({
          title: 'Loving Athena?',
          description: (
            <Trans i18nKey="bot-alert.loving-athena" ns="athena">
              You can ask up to <b>{athenaQuestionsCount} questions</b> free of
              charge, hence use them wisely! For more questions, you shall
              subscribe to one of our packages. You can type your question in
              the chat box or use the related questions attached to the end of
              the answer.
            </Trans>
          ),
        });
      } else {
        if (!question || (question && isAnswerFinished)) {
          alert({
            title: 'Pro Version!',
            description: (
              <Trans i18nKey="bot-alert.pro-version" ns="athena">
                You have reached the maximum number of free questions. Subscribe
                to unlock the opportunity for more questions, cool widgets, and
                innovative features from Athena.
              </Trans>
            ),
            buttonText: 'Subscribe',
            onButtonClick: toBilling,
          });
        }
      }
    } else {
      if (params.has('subscribed_success')) {
        alert({
          title: 'Congratulations!',
          description: (
            <Trans i18nKey="bot-alert.subscribe-congratulations" ns="athena">
              You’ve subscribed to one of our plans.Enjoy using Athena and ask
              your questions about cryptocurrency world and whitepapers, AI
              Curated price predictions, market analysis and much more!
            </Trans>
          ),
        });
      } else if (
        leftQuestions <= 0 &&
        (!question || (question && isAnswerFinished))
      ) {
        alert({
          title: 'Message Limit Reached',
          description: (
            <Trans i18nKey="bot-alert.message-limit" ns="athena">
              You have reached the maximum number of messages allowed with your
              current Athena chatbot plan. To continue using the chatbot without
              interruption, please upgrade to a higher subscription tier.,
            </Trans>
          ),
          buttonText: 'Upgrade',
          onButtonClick: toBilling,
        });
      } else {
        alert({
          description: (
            <Trans i18nKey="bot-alert.freemium-stage" ns="athena">
              You are in a <b>freemium stage</b> and can ask any question
              related to Cryptocurrencies and I will provide you an answer and a
              relevant widget so you can have a better experience.{' '}
              <b>Currently covering ETH, BTC, LTC, XRP, ADA, BNB, TRX coins.</b>
            </Trans>
          ),
        });
      }
    }
  }, [
    alert,
    params,
    question,
    toBilling,
    isTrialPlan,
    leftQuestions,
    isAnswerFinished,
    athenaQuestionsCount,
    profile.data,
    isLoading,
  ]);

  return null;
};
