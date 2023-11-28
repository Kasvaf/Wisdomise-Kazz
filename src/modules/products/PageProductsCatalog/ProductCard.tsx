import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type FinancialProduct } from 'api/types/financialProduct';
import CoinsIcons from 'shared/CoinsIcons';
import Icon from 'modules/shared/Icon';
import Badge from 'modules/shared/Badge';
import useIsFPRunning from '../useIsFPRunning';
import RiskBadge from '../RiskBadge';

interface RiskCardProps {
  className?: string;
  fp: FinancialProduct;
  to: string;
}

const ProductCard: React.FC<PropsWithChildren<RiskCardProps>> = ({
  fp,
  to,
  className,
  children,
}) => {
  const { t } = useTranslation('products');
  const isRunning = useIsFPRunning(fp.key);
  const rrr = fp.profile.return_risk_ratio;

  return (
    <Link
      to={to}
      className={clsx(
        'flex flex-col rounded-3xl bg-black/20 !text-white hover:bg-black/40',
        className,
        isRunning && '!bg-white/10',
      )}
    >
      <div className="flex grow flex-col p-6">
        <section className="flex items-center justify-between">
          <h5 className="text-base font-semibold">{fp.title}</h5>
          <CoinsIcons maxShow={3} coins={fp.config.assets} />
        </section>

        <section className="mt-6 flex justify-between border-y border-y-black py-6 text-sm font-medium">
          {children}
        </section>

        <section className="mt-6 grow text-xs text-white/80">
          {fp.description}
        </section>

        <section className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiskBadge risk={rrr} className="px-3 py-1 text-xs font-normal" />
            <Badge label="Trade" color="grey" className="!text-xs" />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {t('product-catalog.btn-explore')} <Icon name={bxRightArrowAlt} />
          </div>
        </section>
      </div>
    </Link>
  );
};

export default ProductCard;
