import { useState } from 'react';
import { clsx } from 'clsx';
import { notification } from 'antd';
import {
  useAddUserPromptMutation,
  usePredefinedPromptsQuery,
  useUserPromptsQuery,
} from 'api/notification';
import { useSubscription } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import Button from 'modules/shared/Button';
import useModal from 'modules/shared/useModal';
import QuestionItem from './QuestionItem';
import SuggestedQuestions from './SuggestedQuestions';
import ToggleDaily from './ToggleDaily';
import SubscribeModalContent from './SubscribeModalContent';
import QuestionLimitModalContent from './QuestionLimitModalContent';
import warningSrc from './icons/warning.svg';

export default function CustomNotificationTab() {
  const userPrompts = useUserPromptsQuery();
  const [question, setQuestion] = useState('');
  const predefinedPrompts = usePredefinedPromptsQuery();
  const addUserPromptsMutation = useAddUserPromptMutation();
  const { weeklyCustomNotificationCount, isActive } = useSubscription();
  const [subscribeModal, openSubscribeModal] = useModal(SubscribeModalContent, {
    centered: true,
  });
  const [questionLimitModal, openQuestionLimit] = useModal(
    QuestionLimitModalContent,
    { centered: true },
  );

  const currentNotificationCount = userPrompts.data?.length || 0;

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void addQuestion();
    }
  };

  const addQuestion = async (suggestedQuestion?: string) => {
    if (!isActive) {
      void openSubscribeModal({});
    } else if (currentNotificationCount >= weeklyCustomNotificationCount) {
      void openQuestionLimit({});
    } else {
      try {
        if (suggestedQuestion || question) {
          await addUserPromptsMutation.mutateAsync({
            type: 'CUSTOM',
            question: suggestedQuestion || question,
          });
          !suggestedQuestion && setQuestion('');
        }
      } catch (error) {
        notification.error({ message: unwrapErrorMessage(error) });
      }
    }
  };

  return (
    <div className="mt-8 w-full rounded-3xl bg-white/5 p-8">
      <ToggleDaily />
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-white">Your Question</p>
          <p className="mt-4 leading-none text-white/40">
            You can receive customized prompts via email every Monday.
          </p>
        </div>
        <p
          className={clsx(
            'text-right text-xl text-white mobile:basis-40',
            !isActive && 'invisible',
          )}
        >
          {currentNotificationCount} / {weeklyCustomNotificationCount}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {
          <div className="flex w-full flex-wrap items-start justify-start gap-4 rounded-lg bg-white/10 p-6 mobile:flex-col mobile:px-8">
            {predefinedPrompts.data?.map(item => (
              <div
                key={item.key}
                className="flex w-fit items-center gap-3 rounded-3xl bg-black  p-4 text-xs text-white transition-opacity"
              >
                {item.question}
              </div>
            ))}
            {userPrompts.data?.map(item => (
              <QuestionItem item={item} key={item.key} />
            ))}
          </div>
        }
      </div>

      <p className="mt-8 font-medium text-white">Add New Question</p>
      <p className="my-4 text-sm text-white/50">
        You can use the suggested prompts below or write your own customized
        prompts.
      </p>
      <div className="relative mt-4">
        <input
          value={question}
          onKeyDown={onInputKeyDown}
          placeholder="Type your question..."
          onChange={e => setQuestion(e.target.value)}
          disabled={addUserPromptsMutation.isLoading}
          className="w-full rounded-3xl border border-white/10 bg-transparent p-4 pr-24 text-sm outline-none"
        />
        <Button
          size="small"
          onClick={() => addQuestion()}
          loading={addUserPromptsMutation.isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          + Add
        </Button>
      </div>

      <SuggestedQuestions onAdd={addQuestion} />

      <div className="mt-10 flex items-center gap-4 rounded-xl bg-white/10 p-6">
        <img src={warningSrc} />
        <p className="text-sm text-white/80">
          By turning on this feature, you will receive two default daily
          updates, and you can set a few customized prompts to be sent to you on
          a weekly basis.
        </p>
      </div>
      {subscribeModal}
      {questionLimitModal}
    </div>
  );
}
