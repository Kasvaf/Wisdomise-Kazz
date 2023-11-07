import { clsx } from 'clsx';
import { type FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import useMainQuote from 'shared/useMainQuote';
import Button from 'shared/Button';
import CoinsIcons from 'shared/CoinsIcons';
import PriceChange from 'shared/PriceChange';
import useIsFPRunning from '../useIsFPRunning';
import ButtonFPActivate from '../ButtonFPActivate';
import RiskBadge from '../RiskBadge';

interface RiskCardProps {
  className?: string;
  fp: FinancialProduct;
}

const ProductCatalogCard: FunctionComponent<RiskCardProps> = ({
  fp,
  className,
}) => {
  const { t } = useTranslation('products');
  const isRunning = useIsFPRunning(fp.key);
  const rrr = fp.profile.return_risk_ratio;
  const mainQuote = useMainQuote();

  return (
    <div
      className={clsx(
        'flex flex-col rounded-3xl bg-white/5',
        className,
        isRunning && '!bg-white/10',
      )}
    >
      <div className="flex grow flex-col p-6">
        <h5 className="mb-4 grow text-base font-semibold text-white">
          {fp.title}
        </h5>
        <div className="mb-9 flex items-center justify-between">
          <div className="flex items-start gap-2 text-xs font-normal">
            <RiskBadge risk={rrr} className="px-3 py-2" />
          </div>
          <CoinsIcons maxShow={3} coins={fp.config.assets} />
        </div>

        <section className="text-sm font-medium">
          <div className="mb-4 flex justify-between ">
            <p className=" text-white">
              {t('product-detail.expected-yield-apy')}
            </p>
            <PriceChange
              valueToFixed={false}
              value={Number(fp.profile.expected_yield.replace('%', ''))}
            />
          </div>

          <div className="mb-9 flex justify-between">
            <p className="font-medium text-white">
              {t('product-detail.expected-max-drawdown')}
            </p>
            <PriceChange
              bg={false}
              colorize={false}
              valueToFixed={false}
              value={Number(fp.profile.max_drawdown.replace('%', ''))}
            />
          </div>
        </section>

        <div className="-mx-6 mb-7 flex flex-col bg-black/20 p-4 text-xs">
          <p className="mb-4 text-white/80">{t('product-detail.investment')}</p>
          <div className="flex items-center justify-between">
            <p className="w-full text-left text-white">
              <span className="text-white/40">{t('product-detail.min')}</span>
              <br />
              <span className="font-medium">
                {fp.min_deposit}{' '}
                <span className="text-white/80">{mainQuote}</span>
              </span>
            </p>
            <div className="h-[20px] w-[1px] rotate-12 border-l border-white/20" />
            <p className="w-full text-right text-white">
              <span className="text-white/40">{t('product-detail.max')}</span>
              <br />
              <span className="font-medium">
                {fp.max_deposit}{' '}
                <span className="text-white/80">{mainQuote}</span>
              </span>
            </p>
          </div>
        </div>

        <>
          <div className="mb-2 flex gap-3">
            <ButtonFPActivate financialProduct={fp} className="basis-2/3" />
            <Button
              className="basis-1/3"
              variant="secondary"
              to={`/app/products-catalog/${fp.key}`}
            >
              {t('product-catalog.btn-details')}
            </Button>
          </div>
        </>
      </div>
    </div>
  );
};

export default ProductCatalogCard;
