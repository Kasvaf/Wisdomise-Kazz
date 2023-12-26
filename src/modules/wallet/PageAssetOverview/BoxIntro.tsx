import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import Card from 'modules/shared/Card';
import ModalDeposit from '../ModalDeposit';
import TradeSrc from './trade.svg';

const BoxIntro: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { t } = useTranslation('asset-overview');
  const [DepositMod, openDeposit] = useModal(ModalDeposit);
  const ias = useInvestorAssetStructuresQuery();

  return (
    <Card
      className={clsx(
        'flex w-full flex-row justify-between !py-6 mobile:p-6',
        className,
      )}
    >
      <div className="flex grow flex-col items-start justify-between">
        <div className="mb-6 w-2/3 mobile:w-full">
          <h1 className="clear-both mb-5 text-xl font-semibold text-white">
            {t('intro.title')}
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
            {t('intro.description')}
          </div>
        </div>

        <div className="-mx-3 -mb-6 flex flex-wrap items-center justify-center mobile:self-stretch">
          <Button className="mx-3 mb-6" to="/investment/products-catalog">
            {t('intro.btn-check-products')}
          </Button>

          {Boolean(ias.data?.length && ias.data[0]?.main_exchange_account) && (
            <Button className="mx-3 mb-6" onClick={() => openDeposit({})}>
              {t('intro.btn-deposit')}
            </Button>
          )}
          {DepositMod}
        </div>
      </div>

      <img src={TradeSrc} className="h-[200px] mobile:hidden" />
    </Card>
  );
};

export default BoxIntro;
