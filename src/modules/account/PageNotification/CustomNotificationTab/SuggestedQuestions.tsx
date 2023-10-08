import { clsx } from 'clsx';
import {
  useSuggestedPromptsQuery,
  useUserPromptsQuery,
} from 'api/notification';
import plusIconSrc from './icons/plus.svg';

interface Props {
  onAdd: (question: string) => void;
}
export default function SuggestedQuestions({ onAdd }: Props) {
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
          <div
            key={item.key}
            className={clsx(
              'flex w-fit items-center gap-3 rounded-3xl border border-white/40  p-4 text-xs text-white transition-opacity',
            )}
          >
            {item.question}
            <img
              src={plusIconSrc}
              className="cursor-pointer"
              onClick={() => onAdd(item.question)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
