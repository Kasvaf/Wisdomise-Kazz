import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import InfoButton from 'shared/InfoButton';
import useQualityLocales from './useQualityLocales';

const InfoLine: React.FC<{
  label: string;
  value: string;
  info?: string;
  noBorder?: boolean;
}> = ({ label, value, info, noBorder }) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-between',
        !noBorder && 'mb-2 border-b border-white/5 pb-2',
      )}
    >
      <div className="flex items-center gap-1 text-sm font-light text-white/40">
        {label} {info && <InfoButton size={16} title={label} text={info} />}
      </div>
      <div>{value}</div>
    </div>
  );
};
const ProductInfoLines: React.FC<{ fp?: FinancialProduct }> = ({ fp }) => {
  const { t } = useTranslation('products');
  const qualityLocales = useQualityLocales();
  const volatility = {
    Minimal: t('info.volatility.minimal'),
    Moderate: t('info.volatility.moderate'),
    Considerable: t('info.volatility.considerable'),
  };

  return (
    <>
      <InfoLine
        label={t('info.risk.title')}
        value={qualityLocales(fp?.profile.return_risk_ratio || '')}
        info={t('info.risk.info')}
      />
      {fp?.profile.performance && (
        <InfoLine
          label={t('info.performance.title')}
          value={qualityLocales(fp?.profile.performance)}
          info={t('info.performance.info')}
        />
      )}
      {fp?.profile.volatility && (
        <InfoLine
          label={t('info.volatility.title')}
          value={volatility[fp?.profile.volatility] || fp?.profile.volatility}
          info={t('info.volatility.info')}
        />
      )}
      <InfoLine
        label={t('info.side.title')}
        value={
          fp?.market_names?.[0] === 'FUTURES'
            ? t('info.side.futures')
            : t('info.side.spot')
        }
        info={t('info.side.info')}
        noBorder
      />
    </>
  );
};

export default ProductInfoLines;
