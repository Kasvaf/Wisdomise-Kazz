import { clsx } from 'clsx';
import { notification } from 'antd';
import Button from 'shared/Button';
import { useHasFlag } from 'api';
import BackgroundSvg from './background.svg';

const SectionBuilder: React.FC<{ className?: string }> = ({ className }) => {
  const hasFlag = useHasFlag();
  const requestHandler = () => {
    notification.success({
      message: 'We will review your request.',
    });
  };

  return (
    <div className={clsx('relative overflow-hidden rounded-xl', className)}>
      <div
        className="absolute left-0 top-0 h-full w-full bg-cover bg-center p-6"
        style={{ backgroundImage: `url(${BackgroundSvg})` }}
      />

      <div className="relative z-[1] flex h-full flex-col justify-end p-6">
        <div className="mb-2 text-base">Strategy Builder</div>
        <div className="mb-4 text-xs font-normal">
          Build and customize your own investment financial products.
        </div>
        {hasFlag('/marketplace/builder') ? (
          <Button to="/marketplace/builder">Build Now</Button>
        ) : (
          <Button onClick={requestHandler}>Request Now</Button>
        )}
      </div>
    </div>
  );
};

export default SectionBuilder;
