import { clsx } from 'clsx';
import { useDeleteUserPromptMutation } from 'api/notification';
import type { UserPromptsResponse } from 'api/notification';
import removeIconSrc from './icons/remove.svg';

interface Props {
  item: UserPromptsResponse[number];
}

export default function QuestionItem({ item }: Props) {
  const deleteUserPromptMutation = useDeleteUserPromptMutation();

  const onDeleteQuestion = (key: string) => {
    deleteUserPromptMutation.mutate(key);
  };

  return (
    <div
      key={item.key}
      className={clsx(
        'flex w-fit items-center gap-3 rounded-3xl bg-white/10  p-4 text-xs text-white transition-opacity',
        deleteUserPromptMutation.isLoading && 'opacity-40',
      )}
    >
      {item.question}
      <img
        src={removeIconSrc}
        className="cursor-pointer"
        onClick={() => onDeleteQuestion(item.key)}
      />
    </div>
  );
}
