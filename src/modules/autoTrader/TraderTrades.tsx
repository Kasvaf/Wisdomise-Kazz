import BuySellTrader from './BuySellTrader';
import type { TraderInputs } from './PageTrade/types';

const TraderTrades: React.FC<
  TraderInputs & {
    loadingClassName?: string;
  }
> = props => {
  return (
    <div className="relative">
      <BuySellTrader {...props} />
    </div>
  );
};

export default TraderTrades;
