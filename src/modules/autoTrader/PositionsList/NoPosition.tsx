import empty from './empty.svg';

const NoPosition: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="flex flex-col items-center justify-center pb-5 text-center">
      <img src={empty} alt="" className="my-8" />
      <h1 className="mt-3 font-semibold">
        {active ? 'No active positions!' : 'No position!'}
      </h1>

      <p className="mt-3 w-3/4 text-xs">
        {active
          ? 'Get started by creating a position. Your active trades will appear here!'
          : 'Get started by creating your first position. Your trades history will appear here!'}
      </p>
    </div>
  );
};

export default NoPosition;
