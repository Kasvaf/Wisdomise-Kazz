import { useState } from 'react';
import Button from 'shared/Button';

const CustomQuestions: React.FC<{
  onAdd: (question: string) => Promise<unknown>;
  isLoading: boolean;
}> = ({ onAdd, isLoading }) => {
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
      <p className="mt-8 font-medium text-white">Add New Question</p>
      <p className="my-4 text-sm text-white/50">
        You can use the suggested prompts below or write your own customized
        prompts.
      </p>
      <div className="relative mt-4">
        <input
          value={customQuestion}
          onChange={e => setCustomQuestion(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Type your question..."
          disabled={isLoading}
          className="w-full rounded-3xl border border-white/10 bg-transparent p-4 pr-24 text-sm outline-none"
        />
        <Button
          size="small"
          onClick={addCustomQuestion}
          loading={isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          + Add
        </Button>
      </div>
    </div>
  );
};

export default CustomQuestions;
