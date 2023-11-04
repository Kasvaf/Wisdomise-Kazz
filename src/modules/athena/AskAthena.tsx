import { clsx } from 'clsx';
import { bxChevronRight } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { ATHENA_FE } from 'config/constants';
import Icon from 'shared/Icon';

const AskAthena: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation('athena');
  return (
    <a
      href={ATHENA_FE}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        'flex h-16 cursor-pointer items-center justify-between rounded-3xl px-8 py-3 mobile:p-2 mobile:pl-8',
        'bg-white/5 text-xl text-white/20 mobile:text-sm',
        className,
      )}
    >
      {t('box-ask-athena')}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <Icon size={24} name={bxChevronRight} className="w-6 text-black" />
      </div>
    </a>
  );
};

export default AskAthena;
