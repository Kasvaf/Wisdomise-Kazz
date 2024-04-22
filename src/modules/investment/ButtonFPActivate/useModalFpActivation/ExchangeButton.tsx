import { clsx } from 'clsx';
import * as numerable from 'numerable';
import YellowCard from './YellowCard';
import { ReactComponent as GridIconSvg } from './grid-icon.svg';

const ExchangeButton: React.FC<{
  walletName?: string;
  available?: number;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ walletName, available, selected, className, onClick }) => {
  return (
    <YellowCard
      onClick={onClick}
      className={clsx(
        available === undefined ? 'justify-center' : 'justify-between',
        'flex h-full w-[220px] flex-col',
        onClick
          ? [
              'cursor-pointer hover:border-white/70',
              selected
                ? 'border-white/70 opacity-100'
                : 'opacity-40 hover:opacity-70',
            ]
          : undefined,
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold leading-4">Binance</div>
          {walletName && (
            <div className="text-xs text-black/40">{walletName}</div>
          )}
        </div>

        <GridIconSvg className="h-8 w-8" />
      </div>

      {available !== undefined && (
        <div className="flex items-center justify-between">
          <div className="text-black/80">Available</div>
          <span>
            <span>{numerable.format(available, '0,0')}</span>
            <span className="ml-1 text-xs text-black/40">USDT</span>
          </span>
        </div>
      )}
    </YellowCard>
  );
};

export default ExchangeButton;
