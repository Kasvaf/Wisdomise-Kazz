import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/Button';
import TradeSrc from './trade.svg';

const BoxIntro: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        'flex w-full flex-row justify-between rounded-3xl bg-white/5 px-8 py-6 mobile:p-6',
        className,
      )}
    >
      <div className="flex flex-col justify-between">
        <div className="w-2/3 mobile:w-full">
          <h1 className="text-xl font-semibold text-white">
            We Trade On Your Behalf!
          </h1>
          <div className="my-5 w-auto text-sm !leading-normal text-gray-light mobile:-mr-5 mobile:text-sm">
            <img
              src={TradeSrc}
              className="float-right hidden h-[202px] mobile:block"
              alt="trade"
              style={{
                shapeMargin: '20px',
                shapeImageThreshold: '0.05',
                shapeOutside: `url(${TradeSrc})`,
              }}
            />
            <div className="hidden h-3 mobile:block" />
            Wisdomise offers <span className="whitespace-nowrap">
              AI-based
            </span>{' '}
            strategies tailored to your risk tolerance. Check out our strategies
            and start making a profit today.
          </div>
        </div>
        <Button
          className="self-start"
          onClick={() => navigate('/app/products-catalog')}
        >
          Check Products
        </Button>
      </div>
      <img src={TradeSrc} className="h-[200px] mobile:hidden" alt="trade" />
    </div>
  );
};

export default BoxIntro;
