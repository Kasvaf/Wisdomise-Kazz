import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type FinancialProduct } from 'api/types/financialProduct';
import CoinsIcons from 'shared/CoinsIcons';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';
import { ReactComponent as LogoWisdomise } from 'assets/logo.svg';
import InfoButton from 'shared/InfoButton';
import useIsFPRunning from '../useIsFPRunning';
import useQualityLocales from '../useQualityLocales';

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

const ProductCard: React.FC<{ fp: FinancialProduct; mine: boolean }> = ({
  fp,
}) => {
  const { t } = useTranslation('products');
  const qualityLocales = useQualityLocales();
  const volatility = {
    Minimal: t('info.volatility.minimal'),
    Moderate: t('info.volatility.moderate'),
    Considerable: t('info.volatility.considerable'),
  };
  const isRunning = useIsFPRunning(fp.key);

  return (
    <div className="flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-[#1A1B1F]">
      <div className="flex h-12 items-center justify-center gap-1 bg-black/10 py-3">
        <LogoWisdomise />
        <span className="text-xs">Wisdomise</span>
      </div>

      <div className="px-3">
        <div className="flex h-[52px] items-center justify-between gap-1">
          <div>
            <h2 className="line-clamp-1 text-base font-semibold">{fp.title}</h2>
            <p className="line-clamp-3 text-xs font-light text-white/50">
              {fp.description}
            </p>
          </div>

          <CoinsIcons maxShow={3} coins={fp.config.assets} />
        </div>
        <div className="border-b border-white/5 py-2" />
        <div className="mb-3 flex items-center gap-1 pt-3">
          {fp.config.subscription_level ? (
            <Badge color="purple" label={t('common:paid-plan')} />
          ) : (
            <Badge color="green" label={t('common:free-plan')} />
          )}

          {fp.market_names?.length &&
            (fp.market_names[0] === 'FUTURES' ? (
              <Badge color="orange" label={t('common:futures')} />
            ) : (
              <Badge color="blue" label={t('common:spot')} />
            ))}
        </div>
      </div>

      <div className="px-3">
        <InfoLine
          label={t('info.risk.title')}
          value={qualityLocales(fp.profile.return_risk_ratio)}
          info={t('info.risk.info')}
        />
        {fp.profile.performance && (
          <InfoLine
            label={t('info.performance.title')}
            value={qualityLocales(fp.profile.performance)}
            info={t('info.performance.info')}
          />
        )}
        {fp.profile.volatility && (
          <InfoLine
            label={t('info.volatility.title')}
            value={volatility[fp.profile.volatility] || fp.profile.volatility}
            info={t('info.volatility.info')}
          />
        )}
        <InfoLine
          label={t('info.side.title')}
          value={
            fp.market_names?.[0] === 'FUTURES'
              ? t('info.side.futures')
              : t('info.side.spot')
          }
          info={t('info.side.info')}
          noBorder
        />
      </div>

      <div
        className={clsx(
          'flex h-12 items-center justify-center',
          'bg-gradient-to-r from-[#09090A]/30 to-[#2314364D]/30',
        )}
      >
        {isRunning
          ? t('product-catalog.state-running')
          : t('common:actions.explore')}
        <Icon name={bxRightArrowAlt} />
      </div>
    </div>
  );
};

export default ProductCard;
