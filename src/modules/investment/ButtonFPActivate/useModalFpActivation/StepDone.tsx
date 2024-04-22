import Button from 'shared/Button';

const StepDone: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  return (
    <div className="mt-6 text-center">
      <div className="mb-6 text-5xl">🎉</div>
      <h1 className="mb-2 text-2xl">Congratulations!</h1>
      <p className="mb-6 border-b border-white/50 pb-6 text-white/50">
        Your financial product has been created.{' '}
      </p>

      <div className="mb-1">There is one more step to complete.</div>
      <p className="mb-12 text-xs text-white/50">
        Please go to your portfolio page and run your financial product.
      </p>

      <Button
        variant="primary"
        className="w-[280px] mobile:w-full"
        onClick={onContinue}
      >
        Start Your Financial Product
      </Button>
    </div>
  );
};

export default StepDone;
