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
      <BuySellTrader {...props} />
      <BtnInstantTrade
        className="!absolute top-0 right-0"
        quote={props.quote}
        setQuote={props.setQuote}
        slug={props.slug}
      />
    </div>
  );
};

export default TraderTrades;
