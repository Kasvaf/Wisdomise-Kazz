import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('notifications');
  const [subscribeModal, openSubscribeModal] = useModal(SubscribeModalContent, {
    centered: true,
  });

  const userPrompts = useUserPromptsQuery();
  const currentNotificationCount = userPrompts.data?.length || 0;
  const { isActive, weeklyCustomNotificationCount = 0 } = useSubscription();

  const [questionLimitModal, openQuestionLimit] = useConfirm({
    icon: (
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <img src={limitIcon} />
      </div>
    ),
    message: (
      <div className="text-center">
        <h1 className="text-white">
          {t('customs.custom-question.limit.title')}
        </h1>
        <div className="mt-2 text-slate-400">
          {t('customs.custom-question.limit.description', {
            weeklyCustomNotificationCount,
          })}
        </div>
      </div>
    ),
    yesTitle: 'Done',
  });

  const addUserPromptsMutation = useAddUserPromptMutation();
  const addQuestion = async (question: string) => {
    if (!isActive || !weeklyCustomNotificationCount) {
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
  };

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
