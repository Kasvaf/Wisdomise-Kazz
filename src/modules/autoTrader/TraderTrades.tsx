import BtnInstantTrade from 'modules/autoTrader/BuySellTrader/BtnInstantTrade';
import BuySellTrader from './BuySellTrader';
import type { TraderInputs } from './PageTrade/types';

const TraderTrades: React.FC<
  TraderInputs & {
    loadingClassName?: string;
  }
> = props => {
  return (
    <div className="relative">
      <div className="my-2 flex justify-end">
        <BtnInstantTrade
          quote={props.quote}
          setQuote={props.setQuote}
          slug={props.slug}
        />
      </div>
      <BuySellTrader {...props} />
    </div>
  );
};

export default TraderTrades;
