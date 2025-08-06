import { Tabs } from 'antd';
import BtnInstantTrade from 'modules/autoTrader/BuySellTrader/BtnInstantTrade';
import { type TraderInputs } from './PageTrade/types';
import BuySellTrader from './BuySellTrader';
import AssetSwapsStream from './AssetSwapsStream';

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
      children: <AssetSwapsStream slug={props.slug} />,
    },
  ];

  return (
    <div className="relative">
      <Tabs
        defaultActiveKey="terminal"
        items={items}
        className="[&_.ant-tabs-nav]:!-mx-3 [&_.ant-tabs-nav]:mb-3 [&_.ant-tabs-tab]:!px-4 [&_.ant-tabs-tab]:!text-xs"
      />
      <BtnInstantTrade
        className="!absolute right-0 top-0"
        slug={props.slug}
        quote={props.quote}
        setQuote={props.setQuote}
      />
    </div>
  );
};

export default TraderTrades;
