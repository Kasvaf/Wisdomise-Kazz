import { clsx } from 'clsx';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import useIsMobile from 'utils/useIsMobile';
import Button from 'shared/Button';
import FpiStatusBadge from './FpiStatusBadge';
import FpiActions from './FpiActions';
import FpiAssetItem from './FpiAssetItem';
import FpiColumns from './FpiColumns';

const FinancialProductItem: React.FC<{
  fpi: FinancialProductInstance;
  noDetailsBtn?: boolean;
  className?: string;
}> = ({ fpi, className, noDetailsBtn }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const ias = useInvestorAssetStructuresQuery();
  const badges = (
    <div className="flex">
      {[fpi.financial_product.asset_class.toLowerCase(), 'Spot'].map(e => (
        <p
          key={e}
          className="mr-2 rounded-3xl bg-white/5 px-2 py-1 text-xxs leading-none text-white/20 first-letter:uppercase last:mr-0"
        >
          {e}
        </p>
      ))}
    </div>
  );

  const detailsBtn = !noDetailsBtn && (
    <Button
      variant="primary"
      size="small"
      to={`/app/fpi/${fpi.key}`}
      className="!px-10 text-base font-medium"
    >
      {t('fpi.list.btn-details')}
    </Button>
  );

  return (
    <div className={clsx('rounded-3xl bg-white/5 p-6', className)}>
      <header className="flex w-full items-center justify-between mobile:flex-col">
        <section className="flex w-full items-center mobile:justify-between">
          <p className="mr-4 text-base font-medium text-white/90 ">
            {fpi.financial_product.title}
          </p>
          {isMobile ? <FpiActions fpi={fpi} /> : badges}
        </section>

        {isMobile ? (
          <section className="mt-4 flex w-full items-center justify-between">
            {badges}
            <FpiStatusBadge status={fpi.status} />
          </section>
        ) : (
          <section className="flex items-center">
            {detailsBtn}
            <FpiActions className="ml-4" fpi={fpi} />
          </section>
        )}
      </header>

      <FpiColumns fpi={fpi} />

      {fpi.status !== 'DRAFT' && (
        <footer>
          {ias.data?.[0] && ias.data[0].asset_bindings.length > 0 && (
            <p className="mb-2 mt-4 text-sm text-white/80">
              {t('fpi.list.aum-in', {
                title: fpi.financial_product.title,
              })}
            </p>
          )}

          <section className="flex overflow-x-auto mobile:flex-col mobile:justify-between">
            {ias.data?.[0]?.asset_bindings.map(a => (
              <FpiAssetItem asset={a} key={a.name} />
            ))}
          </section>

          <div className="mt-8 hidden mobile:block">{detailsBtn}</div>
        </footer>
      )}
    </div>
  );
};

export default FinancialProductItem;
