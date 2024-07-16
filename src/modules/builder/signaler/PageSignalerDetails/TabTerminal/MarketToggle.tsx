import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

type Market = 'long' | 'short';
interface Props {
  value: Market;
  onChange: (value: Market) => void;
  disabled?: boolean;
  className?: string;
}

const MarketToggle: React.FC<Props> = ({
  value,
  onChange,
  disabled,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        'flex h-[48px] justify-stretch gap-2 rounded-xl bg-white/5 p-[2px] text-center',
        className,
      )}
    >
      <div
        className={clsx(
          'flex grow items-center justify-center rounded-lg',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white/10',
          value === 'long' ? '!bg-[#11C37E99]' : 'text-white/40',
        )}
        onClick={() => onChange('long')}
      >
        {t('common:market.long')}
      </div>
      <div
        className={clsx(
          'flex grow items-center justify-center rounded-lg',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white/10',
          value === 'short' ? '!bg-[#F1405699]' : 'text-white/40',
        )}
        onClick={() => onChange('short')}
      >
        {t('common:market.short')}
      </div>
    </div>
  );
};

export default MarketToggle;
