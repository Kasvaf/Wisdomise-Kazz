import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useIsMobile } from 'utils/useIsMobile';
import { useInvestorAssetStructuresQuery } from 'api';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import { ReactComponent as ArrowUpIcon } from '../icons/arrowUp.svg';
import FpiStatusBadge from './FpiStatusBadge';
import FpiActions from './FpiActions';
import FpiAssetItem from './FpiAssetItem';
import FpiColumns from './FpiColumns';

const FinancialProductItem: React.FC<{
  fpi: FinancialProductInstance;
  className?: string;
}> = ({ fpi, className }) => {
  const isMobile = useIsMobile();
  const ias = useInvestorAssetStructuresQuery();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const toggleDetails = useCallback(() => setDetailsOpen(v => !v), []);

  const detailsBtn = (
    <button
      className="ml-3 flex items-center text-xs text-white/80"
      onClick={toggleDetails}
    >
      Details{' '}
      <ArrowUpIcon
        className={clsx(
          'ml-2 rotate-180 transition',
          detailsOpen && 'rotate-[360deg]',
        )}
      />
    </button>
  );

  return (
    <div
      key={fpi.key}
      className={clsx(
        'rounded-3xl bg-white/5 p-6',
        !detailsOpen && !isMobile && 'pb-2',
        className,
      )}
    >
      <header className="flex w-full items-start justify-start mobile:flex-col">
        <section className="flex w-full items-start mobile:justify-between">
          <p className="mr-4 text-base font-medium text-white/90 ">
            {fpi.financial_product.title}
          </p>
          <FpiActions fpi={fpi} />
        </section>

        <div className="ml-auto flex items-center self-start mobile:ml-0 mobile:mt-3 mobile:w-full ">
          {[fpi.financial_product.asset_class.toLowerCase(), 'Spot'].map(e => (
            <p
              key={e}
              className="mr-2 rounded-3xl bg-white/5 px-2 py-1 text-xxs leading-none text-white/20 first-letter:uppercase last:mr-0"
            >
              {e}
            </p>
          ))}

          {!isMobile && detailsBtn}
          <section className="ml-auto hidden self-end mobile:block">
            <FpiStatusBadge isOpen={detailsOpen} status={fpi.status} />
          </section>
        </div>
      </header>

      <FpiColumns fpi={fpi} detailsOpen={detailsOpen} />

      {fpi.status !== 'DRAFT' && detailsOpen && (
        <footer>
          {ias.data?.[0] && ias.data[0].asset_bindings.length > 0 && (
            <p className="mb-2 mt-4 text-sm text-white/80">
              AUM in {fpi.financial_product.title}
            </p>
          )}

          <section className="flex mobile:flex-col mobile:justify-between">
            {ias.data?.[0]?.asset_bindings.map(a => (
              <FpiAssetItem asset={a} key={a.name} />
            ))}
          </section>
        </footer>
      )}

      {isMobile && (
        <section className="mt-6 flex justify-end">{detailsBtn}</section>
      )}
    </div>
  );
};

export default FinancialProductItem;
