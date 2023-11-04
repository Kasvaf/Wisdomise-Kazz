import { useTranslation } from 'react-i18next';
import ToggleDaily from './ToggleDaily';
import UserQuestions from './UserQuestions';
import CustomQuestions from './CustomQuestions';
import SuggestedQuestions from './SuggestedQuestions';
import useAddQuestion from './useAddQuestion';
import warningSrc from './icons/warning.svg';

export default function CustomNotificationTab() {
  const { t } = useTranslation('notifications');
  const { addQuestion, permissionModals, isLoading } = useAddQuestion();

  return (
    <div className="mt-8 w-full rounded-3xl bg-white/5 p-8">
      <ToggleDaily />
      <UserQuestions />
      <CustomQuestions onAdd={addQuestion} isLoading={isLoading} />
      <SuggestedQuestions onAdd={addQuestion} isLoading={isLoading} />

      <div className="mt-10 flex items-center gap-4 rounded-xl bg-white/10 p-6">
        <img src={warningSrc} />
        <p className="text-sm text-white/80">{t('customs.disclaimer')}</p>
      </div>

      {permissionModals}
    </div>
  );
}
