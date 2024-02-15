import { clsx } from 'clsx';
import { Trans } from 'react-i18next';
import Spin from 'modules/shared/Spin';
import { type FinancialProduct } from 'api/types/financialProduct';
import { usePlansQuery, useSubscription } from 'api';

const ProductSubscriptionNotice: React.FC<{
  fp: FinancialProduct;
  className?: string;
}> = ({ fp, className }) => {
  const { data: plans, isLoading } = usePlansQuery();
  const { level: myLevel } = useSubscription();
  const productLevel = fp.config.subscription_level ?? 0;
  const minPlan = plans?.results.find(x => x.level === productLevel)?.name;
  const notice = isLoading ? (
    <div className="flex justify-center">
      <Spin />
    </div>
  ) : (
    productLevel > myLevel && (
      <div className={clsx('text-xs text-error opacity-50', className)}>
        <Trans ns="products" i18nKey="product-detail.min-subscription-level">
          Available with <span className="font-bold">{{ minPlan }}</span> plan.
        </Trans>
      </div>
    )
  );

  return notice || null;
};

export default ProductSubscriptionNotice;
