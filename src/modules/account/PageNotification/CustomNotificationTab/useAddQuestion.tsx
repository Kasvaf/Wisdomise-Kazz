import { useCallback } from 'react';
import { notification } from 'antd';
import useModal from 'modules/shared/useModal';
import { unwrapErrorMessage } from 'utils/error';
import {
  useAddUserPromptMutation,
  useUserPromptsQuery,
} from 'api/notification';
import { useSubscription } from 'api';
import useConfirm from 'modules/shared/useConfirm';
import SubscribeModalContent from './SubscribeModalContent';
import limitIcon from './icons/limit.svg';

const useAddQuestion = () => {
  const [subscribeModal, openSubscribeModal] = useModal(SubscribeModalContent, {
    centered: true,
  });

  const userPrompts = useUserPromptsQuery();
  const currentNotificationCount = userPrompts.data?.length || 0;
  const { weeklyCustomNotificationCount, isActive } = useSubscription();

  const [questionLimitModal, openQuestionLimit] = useConfirm({
    icon: (
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <img src={limitIcon} />
      </div>
    ),
    message: (
      <div className="text-center">
        <h1 className="text-white">Question Limit</h1>
        <div className="mt-2 text-slate-400">
          You can add up to {weeklyCustomNotificationCount} questions and if you
          want to add a new question, you must delete the previous questions
        </div>
      </div>
    ),
    yesTitle: 'Done',
  });

  const addUserPromptsMutation = useAddUserPromptMutation();
  const addQuestion = useCallback(
    async (question: string) => {
      if (!isActive) {
        void openSubscribeModal({});
      } else if (currentNotificationCount >= weeklyCustomNotificationCount) {
        void openQuestionLimit({});
      } else {
        try {
          await addUserPromptsMutation.mutateAsync({
            type: 'CUSTOM',
            question,
          });
        } catch (error) {
          notification.error({ message: unwrapErrorMessage(error) });
          throw error;
        }
      }
    },
    [
      addUserPromptsMutation,
      currentNotificationCount,
      isActive,
      openQuestionLimit,
      openSubscribeModal,
      weeklyCustomNotificationCount,
    ],
  );

  return {
    isLoading: addUserPromptsMutation.isLoading,
    addQuestion,
    permissionModals: (
      <>
        {subscribeModal}
        {questionLimitModal}
      </>
    ),
  };
};

export default useAddQuestion;
