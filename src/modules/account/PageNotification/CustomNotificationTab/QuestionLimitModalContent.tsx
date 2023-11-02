import Button from 'modules/shared/Button';
import limitIcon from './icons/limit.svg';

interface Props {
  onResolve?: () => void;
}

export default function QuestionLimitModalContent({ onResolve }: Props) {
  return (
    <div className="mt-12 flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <img src={limitIcon} />
      </div>

      <h1 className="text-white">Question Limit</h1>
      <div className="mt-2 text-slate-400">
        You can add up to 5 questions and if you want to add a new question, you
        must delete the previous questions
      </div>

      <Button onClick={onResolve} className="mt-6">
        Done
      </Button>
    </div>
  );
}
