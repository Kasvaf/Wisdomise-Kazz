import { clsx } from 'clsx';
import { type MarketTypes } from 'api/types/financialProduct';
import { useSignalerPair } from 'api';
import CoinsIcons from './CoinsIcons';

interface Props {
  title?: string;
  name?: string;
  base?: string;
  quote?: string;
  market?: MarketTypes;
  className?: string;
}

const PairInfo: React.FC<Props> = ({
  title,
  name,
  base,
  quote,
  market,
  className,
}) => {
  const marketType =
    market ?? (/(BUSD|USDT)$/.test(name ?? '') ? 'FUTURES' : 'SPOT');

  const pair = useSignalerPair(marketType)(name);
  base ||= pair?.base.name ?? '';
  quote ||= pair?.quote.name ?? '';

  return (
    <div className={clsx('flex items-center justify-center p-2', className)}>
      <CoinsIcons coins={[base]} />
      <div className="ml-2">
        <p className="text-nowrap text-sm text-white">
          {pair?.display_name ?? title}
        </p>
        <p className="text-nowrap text-[10px] text-white/40 ">
          {marketType === 'FUTURES' ? `${base} / ${quote}` : quote}
        </p>
      </div>
    </div>
  );
};

export default PairInfo;
