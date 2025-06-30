import Tabs from 'shared/Tabs';
import { type TraderInputs } from './PageTrade/types';
import BuySellTrader from './BuySellTrader';
import Trades from './Trades';

const TraderTrades: React.FC<
  TraderInputs & {
    loadingClassName?: string;
  }
> = props => {
  const items = [
    {
      key: 'terminal',
      label: 'Terminal',
      children: <BuySellTrader {...props} />,
    },
    {
      key: 'trades',
      label: 'Trades',
      children: <Trades slug={props.slug} />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="terminal"
      items={items}
      className="[&_.ant-tabs-nav]:-mx-3 [&_.ant-tabs-nav]:mb-3 [&_.ant-tabs-tab]:px-4 [&_.ant-tabs-tab]:text-xs"
    />
  );
};

export default TraderTrades;
