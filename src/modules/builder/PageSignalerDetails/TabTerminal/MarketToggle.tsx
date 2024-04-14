import { clsx } from 'clsx';

type Market = 'long' | 'short';
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
          value === 'long' ? '!bg-[#11C37E99]' : 'text-white/40',
        )}
        onClick={() => onChange('long')}
      >
        Long
      </div>
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/70',
          value === 'short' ? '!bg-[#F1405699]' : 'text-white/40',
        )}
        onClick={() => onChange('short')}
      >
        Short
      </div>
    </div>
  );
};

export default MarketToggle;
