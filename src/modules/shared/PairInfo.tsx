import { clsx } from 'clsx';
import CoinsIcons from './CoinsIcons';

interface Props {
  title: string;
  base: string;
  quote?: string;
  name?: string;
  className?: string;
}

const PairInfo: React.FC<Props> = ({ title, base, quote, name, className }) => (
  <div className={clsx('flex items-center justify-center p-2', className)}>
    <CoinsIcons coins={[base]} />
    <div className="ml-2">
      <p className="text-sm text-white ">{title}</p>
      <p className="text-[10px] text-white/40 ">
        {quote ? `${base} / ${quote}` : name}
      </p>
    </div>
  </div>
);

export default PairInfo;
