import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';

const FpiStatusBadge: React.FC<{
  status: FinancialProductInstance['status'];
}> = ({ status }) => {
  const { t } = useTranslation();
  const label = {
    RUNNING: t('fpi.status.running'),
    PAUSED: t('fpi.status.paused'),
    DRAFT: t('fpi.status.draft'),
  }[status];

  return (
    <div className="mx-6 my-4 mr-0 flex flex-col items-center justify-between mobile:m-0">
      <p className="text-sm text-white/80 mobile:!hidden">
        {t('fpi.status.title')}
      </p>
      <p
        className={clsx(
          'rounded-full px-3 py-2 text-xxs leading-none',
          status === 'RUNNING' && 'bg-[#40F19C]/20 text-[#40F19C]',
          status === 'PAUSED' && 'bg-[#F1AA40]/20 text-[#F1AA40]',
          status === 'DRAFT' && 'bg-white/20 text-white',
        )}
      >
        {label}
      </p>
    </div>
  );
};

export default FpiStatusBadge;
