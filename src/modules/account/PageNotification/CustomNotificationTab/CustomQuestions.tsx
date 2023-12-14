import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';

const CustomQuestions: React.FC<{
  onAdd: (question: string) => Promise<unknown>;
  isLoading: boolean;
}> = ({ onAdd, isLoading }) => {
  const { t } = useTranslation('notifications');
  const [customQuestion, setCustomQuestion] = useState('');

  const addCustomQuestion = async () => {
    await onAdd(customQuestion);
    setCustomQuestion('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void addCustomQuestion();
    }
  };

  return (
    <div>
      <p className="mt-8 font-medium text-white">
        {t('customs.custom-question.title')}
      </p>
      <p className="my-4 text-sm text-white/50">
        {t('customs.custom-question.description')}
      </p>
      <div className="relative mt-4">
        <input
          value={customQuestion}
          onChange={e => setCustomQuestion(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder={t('customs.custom-question.placeholder')}
          disabled={isLoading}
          className="w-full rounded-xl border border-white/10 bg-transparent p-4 pr-24 text-sm outline-none"
        />
        <Button
          size="small"
          onClick={addCustomQuestion}
          loading={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          + {t('customs.custom-question.btn-add')}
        </Button>
      </div>
    </div>
  );
};

export default CustomQuestions;
