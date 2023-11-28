import { clsx } from 'clsx';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type ReactElement, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from 'modules/shared/Icon';
import Badge from 'modules/shared/Badge';
import RiskBadge from '../RiskBadge';

interface RiskCardProps {
  className?: string;
  isRunning?: boolean;
  risk: 'High' | 'Medium' | 'Low';
  title: string;
  icon: ReactElement;
  description: string;
  to: string;
}

const ProductCard: React.FC<PropsWithChildren<RiskCardProps>> = ({
  isRunning = false,
  risk,
  title,
  icon,
  description,
  to,
  className,
  children,
}) => {
  const { t } = useTranslation('products');

  return (
    <Link
      to={to}
      className={clsx(
        'flex flex-col rounded-3xl bg-black/20 !text-white hover:bg-black/40',
        className,
      )}
    >
      <div className="flex grow flex-col p-6">
        <section className="flex items-center justify-between">
          <h5 className="text-base font-semibold">{title}</h5>
          {icon}
        </section>

        <section className="mt-6 flex justify-between border-y border-y-black py-6 text-sm font-medium">
          {children}
        </section>

        <section className="mt-6 grow text-xs text-white/80">
          {description}
        </section>

        <section className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiskBadge risk={risk} className="px-3 py-1 text-xs font-normal" />
            <Badge label="Trade" color="grey" className="!text-xs" />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {isRunning ? (
              <span className="text-success">
                {t('product-catalog.state-running')}
              </span>
            ) : (
              t('product-catalog.btn-explore')
            )}{' '}
            <Icon name={bxRightArrowAlt} />
          </div>
        </section>
      </div>
    </Link>
  );
};

export default ProductCard;
