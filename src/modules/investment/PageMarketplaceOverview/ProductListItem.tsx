import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import ResponsiveLabelInfo from 'shared/ResponsiveLabelInfo';
import Badge from 'shared/Badge';
import CoinsIcons from 'shared/CoinsIcons';
import useIsFPRunning from '../useIsFPRunning';
import useQualityLocales from '../useQualityLocales';

const ProductListItem: React.FC<{
  product: FinancialProduct;
  className?: string;
}> = ({ product: fp, className }) => {
  const { t } = useTranslation('products');
  const isRunning = useIsFPRunning(fp.key);

  const qualityLocales = useQualityLocales();
  const volatility = {
    Minimal: t('info.volatility.minimal'),
    Moderate: t('info.volatility.moderate'),
    Considerable: t('info.volatility.considerable'),
  };

  const market = (
    fp?.config.market_type || fp?.market_names?.[0]
  )?.toUpperCase();

  return (
    <NavLink
      to={`/marketplace/products-catalog/fp/${fp.key}`}
      className={clsx(
        'rounded-lg bg-v1-surface-l3 p-6 hover:bg-v1-background-hover',
        className,
      )}
    >
      <div className="flex items-center justify-between mobile:flex-col mobile:items-start mobile:gap-4">
        <div className="text-2xl font-normal">{fp.title}</div>
        <div className="flex gap-2">
          {isRunning && <Badge color="white" label="Running" />}

          {fp.config.subscription_level ? (
            <Badge color="purple" label={t('common:paid-plan')} />
          ) : (
            <Badge color="green" label={t('common:free-plan')} />
          )}

          {Boolean(market) &&
            (market === 'FUTURES' ? (
              <Badge color="orange" label={t('common:futures')} />
            ) : (
              <Badge color="blue" label={t('common:spot')} />
            ))}

          <div className="ml-3 border-l border-v1-border-disabled pl-5 mobile:hidden">
            <CoinsIcons size={24} maxShow={2} coins={fp.config.assets} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex border-t border-v1-border-disabled pt-4 mobile:w-full mobile:flex-col mobile:gap-6">
        <ResponsiveLabelInfo label="Risk" className="basis-1/5">
          {fp?.profile.return_risk_ratio &&
            qualityLocales(fp.profile.return_risk_ratio || '')}
        </ResponsiveLabelInfo>

        <ResponsiveLabelInfo label="Performance" className="basis-1/5">
          {fp?.profile.performance && qualityLocales(fp.profile.performance)}
        </ResponsiveLabelInfo>

        <ResponsiveLabelInfo label="Volatility" className="basis-1/5">
          {(fp?.profile.volatility && volatility[fp.profile.volatility]) ||
            fp?.profile.volatility}
        </ResponsiveLabelInfo>

        <ResponsiveLabelInfo label="Side" className="basis-1/5">
          {market === 'FUTURES' ? t('info.side.futures') : t('info.side.spot')}
        </ResponsiveLabelInfo>

        <ResponsiveLabelInfo label="Supported Exchanges" className="basis-1/5">
          {fp.config.exchanges?.length && fp.config.exchanges.join(',')}
        </ResponsiveLabelInfo>
      </div>
    </NavLink>
  );
};

export default ProductListItem;
