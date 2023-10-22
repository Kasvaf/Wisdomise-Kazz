import { useCallback } from 'react';
import { bxPlus } from 'boxicons-quasar';
import {
  useSuggestedPromptsQuery,
  useUserPromptsQuery,
} from 'api/notification';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

interface Props {
  onAdd: (question: string) => void;
  isLoading: boolean;
}

const SuggestedQuestionItem: React.FC<{
  question: string;
  onAdd: (question: string) => void;
  disabled: boolean;
}> = ({ question, onAdd, disabled }) => {
  return (
    <Button
      className="!px-4"
      variant="secondary"
      onClick={useCallback(() => onAdd(question), [question, onAdd])}
      disabled={disabled}
    >
      <div className="flex grow items-center justify-between gap-2">
        <span className="font-semibold">{question}</span>
        <Icon name={bxPlus} size={18} />
      </div>
    </Button>
  );
};

const SuggestedQuestions: React.FC<Props> = ({ onAdd, isLoading }) => {
  const userPrompts = useUserPromptsQuery();
  const suggestedPrompts = useSuggestedPromptsQuery();

  const questions = suggestedPrompts.data?.filter(
    suggestedPrompt =>
      !userPrompts.data?.some(
        userPrompt => userPrompt.question === suggestedPrompt.question,
      ),
  );

  if (!questions?.length) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <p className="my-3 font-medium text-white">Suggested weekly prompts</p>
      <div className="flex w-full flex-wrap gap-3">
        {questions.map(item => (
          <SuggestedQuestionItem
            key={item.key}
            onAdd={onAdd}
            question={item.question}
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
