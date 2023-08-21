import dayjs from 'dayjs';
import { clsx } from 'clsx';
import * as numerable from 'numerable';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import { useIsMobile } from 'utils/useIsMobile';
import useMainQuote from 'shared/useMainQuote';
import FpiStatusBadge from './FpiStatusBadge';

const VerticalLine = () => (
  <div className="mx-1 my-6 h-auto border-l border-white/10 mobile:my-0 mobile:w-full mobile:border-b" />
);

const FpiColumns = ({
  fpi,
  detailsOpen,
}: {
  fpi: FinancialProductInstance;
  detailsOpen: boolean;
}) => {
  const isMobile = useIsMobile();
  const mainQuote = useMainQuote();
  return (
    <main
      className={clsx(
        'mt-3 flex items-stretch justify-between mobile:flex-col',
        detailsOpen && 'h-24 mobile:h-auto',
      )}
    >
      <div
        className={clsx(
          'mx-6 my-4 ml-0 flex items-center justify-between mobile:mr-0 mobile:flex-row',
          detailsOpen && 'flex-col !items-start',
        )}
      >
        <p className="text-sm text-white/80">Equity</p>
        <p
          className={clsx(
            'ml-20 text-base font-medium text-white',
            detailsOpen && '!ml-0',
          )}
        >
          {numerable.format(fpi.total_equity, '0,0.00', {
            rounding: 'floor',
          })}
          <span className="ml-2 text-xs font-normal text-white/40">
            {mainQuote}
          </span>
        </p>
      </div>

      <VerticalLine />

      <div
        className={clsx(
          'mx-6 my-4 flex items-center justify-between mobile:mx-0 mobile:flex-row',
          detailsOpen && 'flex-col !items-start',
        )}
      >
        <p className="mr-6 text-sm text-white/80">P / L</p>
        <p
          className={clsx(
            'text-base font-semibold text-white',
            fpi.pnl >= 0 && '!text-[#40F19C]',
          )}
        >
          <span>
            {numerable.format(fpi.pnl, '0,0.00', { rounding: 'floor' })}
          </span>
          <span className="ml-2 text-xs font-normal text-white/40">
            {mainQuote}
          </span>
        </p>
      </div>

      {!isMobile && <VerticalLine />}

      <div
        className={clsx(
          'mx-6 my-4 flex flex-col justify-between mobile:order-first mobile:mx-0 mobile:mb-0',
          detailsOpen && 'mobile:mb-4 mobile:flex-row',
        )}
      >
        <p className="text-xs font-medium text-white/40">
          {numerable.format(fpi.total_equity_share / 100, '0,0.00 %')}{' '}
          {isMobile && detailsOpen && <br />}
          <span className="text-xs text-white/40">Of Total Balance</span>
        </p>
        <p
          className={clsx(
            'mt-4 text-xs text-white/40 mobile:mt-0 mobile:hidden',
            detailsOpen && 'mobile:order-first mobile:!block',
          )}
        >
          {fpi.status === 'DRAFT' ? 'Created' : 'Started'}
          {isMobile ? <br /> : <>&nbsp;&nbsp;</>}
          {dayjs(
            fpi.status === 'DRAFT' ? fpi.created_at : fpi.started_at,
          ).format('MMMM DD, YYYY')}{' '}
          &nbsp;&nbsp;
          <span className="text-xxs text-white/20">
            {dayjs(
              fpi.status === 'DRAFT' ? fpi.created_at : fpi.started_at,
            ).fromNow()}
          </span>
        </p>
      </div>

      {isMobile && detailsOpen && (
        <div className="order-first">
          <VerticalLine />
        </div>
      )}

      {!isMobile && (
        <>
          <VerticalLine />
          <FpiStatusBadge isOpen={detailsOpen} status={fpi.status} />
        </>
      )}
    </main>
  );
};

export default FpiColumns;
