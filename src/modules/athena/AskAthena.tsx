import { clsx } from 'clsx';
import { bxChevronRight } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from 'shared/Icon';

const AskAthena: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation('athena');
  return (
    <Link
      to="/insight/athena"
      rel="noreferrer noopener"
      className={clsx(
        'flex h-16 cursor-pointer items-center justify-between rounded-xl px-8 py-3 mobile:p-2 mobile:pl-8',
        'bg-black/20 text-xl text-white/20 hover:bg-black/30 mobile:text-sm',
        className,
      )}
    >
      {t('box-ask-athena')}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <Icon size={24} name={bxChevronRight} className="w-6 text-black" />
      </div>
    </Link>
  );
};

export default AskAthena;
