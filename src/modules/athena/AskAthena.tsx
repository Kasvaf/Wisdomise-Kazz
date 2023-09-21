import { clsx } from 'clsx';
import { bxChevronRight } from 'boxicons-quasar';
import { ATHENA_FE } from 'config/constants';
import Icon from 'shared/Icon';

const AskAthena: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <a
      href={ATHENA_FE}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        'flex h-16 cursor-pointer items-center justify-between rounded-3xl bg-white/5 px-8 py-3 text-xl text-white/20 mobile:p-2 mobile:pl-8 mobile:text-sm',
        className,
      )}
    >
      Ask Athena anything about crypto
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <Icon size={24} name={bxChevronRight} className="w-6 text-black" />
      </div>
    </a>
  );
};

export default AskAthena;
