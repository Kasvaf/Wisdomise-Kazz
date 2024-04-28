import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

type Market = 'long' | 'short';
interface Props {
  value: Market;
  onChange: (value: Market) => void;
}

const MarketToggle: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-[48px] justify-stretch gap-2 rounded-xl bg-black/20 p-2 text-center">
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/70',
          value === 'long' ? '!bg-[#11C37E99]' : 'text-white/40',
        )}
        onClick={() => onChange('long')}
      >
        {t('common:market.long')}
      </div>
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/70',
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
