import { clsx } from 'clsx';
import { useInvestorAssetStructuresQuery } from 'api';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import ModalDeposit from '../ModalDeposit';
import TradeSrc from './trade.svg';

const BoxIntro: React.FC<{
  className?: string;
}> = ({ className }) => {
  const [DepositMod, openDeposit] = useModal(ModalDeposit);
  const ias = useInvestorAssetStructuresQuery();

  return (
    <div
      className={clsx(
        'flex w-full flex-row justify-between rounded-3xl bg-white/5 px-8 py-6 mobile:p-6',
        className,
      )}
    >
      <div className="flex grow flex-col items-start justify-between">
        <div className="mb-6 w-2/3 mobile:w-full">
          <h1 className="clear-both mb-5 text-xl font-semibold text-white">
            We Trade On Your Behalf!
          </h1>

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

          <div className="text-sm !leading-normal text-gray-light mobile:text-sm">
            Wisdomise offers <span className="whitespace-nowrap">AI-based</span>{' '}
            strategies tailored to your risk tolerance. Check out our strategies
            and start making a profit today.
          </div>
        </div>

        <div className="-mx-3 -mb-6 flex flex-wrap items-center justify-center mobile:self-stretch">
          <Button className="mx-3 mb-6" to="/app/products-catalog">
            Check Products
          </Button>

          {Boolean(ias.data?.length) && (
            <Button className="mx-3 mb-6" onClick={() => openDeposit({})}>
              Deposit
            </Button>
          )}
          {DepositMod}
        </div>
      </div>

      <img src={TradeSrc} className="h-[200px] mobile:hidden" />
    </div>
  );
};

export default BoxIntro;
