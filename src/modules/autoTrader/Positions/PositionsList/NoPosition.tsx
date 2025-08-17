import empty from './empty.svg';

const NoPosition: React.FC<{ active: boolean; slug?: string }> = ({
  active,
}) => {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center pb-5 text-center">
      <img src={empty} className="my-4" />
      <h1 className="font-semibold">
        {active ? 'No active positions yet!' : 'No position yet!'}
      </h1>

      <p className="mt-3 w-3/4 text-xs text-v1-content-secondary">
        {active
          ? 'Get started by creating a position. Your active trades will appear here!'
          : 'Get started by creating your first position. Your trades history will appear here!'}
      </p>
    </div>
  );
};

export default NoPosition;
