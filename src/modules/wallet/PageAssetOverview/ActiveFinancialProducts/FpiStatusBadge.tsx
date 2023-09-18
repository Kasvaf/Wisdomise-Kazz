import { clsx } from 'clsx';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';

const FpiStatusBadge = ({
  status,
}: {
  status: FinancialProductInstance['status'];
}) => (
  <div className="mx-6 my-4 mr-0 flex flex-col items-center justify-between mobile:m-0">
    <p className="text-sm text-white/80 mobile:!hidden">Status</p>
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

export default FpiStatusBadge;
