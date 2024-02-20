import { clsx } from 'clsx';

type Market = 'LONG' | 'SHORT';
interface Props {
  value: Market;
  onChange: (value: Market) => void;
}

const MarketToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex h-[48px] justify-stretch gap-2 rounded-xl bg-black/20 p-2 text-center">
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/70',
          value === 'LONG' ? '!bg-[#11C37E99]' : 'text-white/40',
        )}
        onClick={() => onChange('LONG')}
      >
        Long
      </div>
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/70',
          value === 'SHORT' ? '!bg-[#11C37E99]' : 'text-white/40',
        )}
        onClick={() => onChange('SHORT')}
      >
        Short
      </div>
    </div>
  );
};

export default MarketToggle;
