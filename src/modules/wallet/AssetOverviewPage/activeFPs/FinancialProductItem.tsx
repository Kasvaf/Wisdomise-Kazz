import dayjs from 'dayjs';
import * as numerable from 'numerable';
import { type AxiosError } from 'axios';
import { clsx } from 'clsx';
import { notification } from 'antd';
import React, { useState } from 'react';
import { useIsMobile } from 'utils/useIsMobile';
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
} from 'api';
import {
  type AssetBinding,
  type FinancialProductInstance,
} from 'api/types/investorAssetStructure';
import { CoinsIcons } from 'modules/shared/CoinsIcons';
import { ReactComponent as DeactivateIcon } from '../icons/deactivate.svg';
import { ReactComponent as ArrowUpIcon } from '../icons/arrowUp.svg';
import { ReactComponent as StartIcon } from '../icons/start.svg';
import { ReactComponent as PauseIcon } from '../icons/pause.svg';
import { PopConfirmChangeFPIStatus } from './PopConfirmChangeFPIStatus';

const FpiStatusBadge = ({
  isOpen,
  status,
}: {
  isOpen: boolean;
  status: FinancialProductInstance['status'];
}) => (
  <div
    className={clsx(
      'mx-6 my-4 mr-0 flex flex-col items-center justify-center mobile:m-0',
      isOpen && 'justify-between',
    )}
  >
    <p
      className={clsx(
        'hidden text-sm text-white/80',
        isOpen && '!block',
        'mobile:!hidden',
      )}
    >
      Status
    </p>
    <p
      className={clsx(
        'rounded-full px-3 py-2 text-xxs leading-none first-letter:uppercase',
        status === 'RUNNING' && 'bg-[#40F19C]/20 text-[#40F19C]',
        status === 'PAUSED' && 'bg-[#F1AA40]/20 text-[#F1AA40]',
        status === 'DRAFT' && 'bg-white/20 text-white',
      )}
    >
      {status.toLowerCase()}
    </p>
  </div>
);

const FpiActions = ({ fpi }: { fpi: FinancialProductInstance }) => {
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const changeFpiStatus = async (
    fpiKey: string,
    status: 'stop' | 'start' | 'pause' | 'resume',
  ) => {
    try {
      await updateFPIStatus.mutateAsync({
        status,
        fpiKey,
      });
    } catch (error) {
      notification.error({
        message:
          (error as AxiosError<{ message: string }>).response?.data.message ||
          '',
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-x-2">
      <PopConfirmChangeFPIStatus
        type="stop"
        onConfirm={() => changeFpiStatus(fpi.key, 'stop')}
      >
        <DeactivateIcon className="cursor-pointer text-white/80" />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        type={
          fpi.status === 'DRAFT'
            ? 'start'
            : fpi.status === 'RUNNING'
            ? 'pause'
            : 'resume'
        }
        onConfirm={() =>
          changeFpiStatus(
            fpi.key,
            fpi.status === 'DRAFT'
              ? 'start'
              : fpi.status === 'RUNNING'
              ? 'pause'
              : 'resume',
          )
        }
      >
        {fpi.status === 'RUNNING' ? (
          <PauseIcon className="cursor-pointer text-white/80" />
        ) : (
          <StartIcon className="cursor-pointer text-white/80" />
        )}
      </PopConfirmChangeFPIStatus>
    </div>
  );
};

const FpiAssetItem = ({ asset: a }: { asset: AssetBinding }) => {
  const isMobile = useIsMobile();

  return (
    <React.Fragment key={a.name}>
      <div className="mx-6 mt-4 grid w-fit grid-cols-2 items-center first:ml-0 mobile:mx-0 mobile:flex mobile:w-full mobile:items-center mobile:justify-between mobile:rounded-lg mobile:bg-white/5 mobile:p-2">
        <div className="flex items-center">
          <CoinsIcons size={isMobile ? 15 : 'small'} coins={[a.name]} />
          <span className="ml-2 text-xs text-white">{a.name}</span>
        </div>
        <p className="ml-4 text-sm font-medium text-white/90 mobile:ml-0">
          {numerable.format(a.share / 100, '0,0.00 %')}
        </p>
        <p className="mobile:hidden" />
        <p className="text-right text-xxs text-white/60 mobile:text-xs">
          {numerable.format(a.equity, '0,0.00', {
            rounding: 'floor',
          })}{' '}
          <span className="">BUSD</span>
        </p>
      </div>

      <div className="mx-1 my-4 h-auto border-l border-white/10 last:hidden mobile:hidden" />
    </React.Fragment>
  );
};

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
          <span className="ml-2 text-xs font-normal text-white/40">BUSD</span>
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
          <span className="ml-2 text-xs font-normal text-white/40">BUSD</span>
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
          {numerable.format(fpi.total_equity_share / 100, '0,0.0 %')}{' '}
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

const FinancialProductItem: React.FC<{
  fpi: FinancialProductInstance;
  className?: string;
}> = ({ fpi, className }) => {
  const isMobile = useIsMobile();
  const ias = useInvestorAssetStructuresQuery();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const detailsBtn = (
    <button
      className="ml-3 flex items-center text-xs text-white/80"
      onClick={() => setDetailsOpen(v => !v)}
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
