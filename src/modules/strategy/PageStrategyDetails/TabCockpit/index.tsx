import Button from 'modules/shared/Button';
import TitleHint from '../../TitleHint';

const TabCockpit = () => {
  return (
    <div className="my-10 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <TitleHint title="Activate Strategy">
          By Clicking “Run Strategy” button, your cockpit will be created to run
          position or modify strategy
        </TitleHint>

        <Button>Run Strategy</Button>
      </div>
    </div>
  );
};

export default TabCockpit;
