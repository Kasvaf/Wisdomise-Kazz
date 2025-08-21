import { Tabs } from 'antd';
import BtnInstantTrade from 'modules/autoTrader/BuySellTrader/BtnInstantTrade';
import AssetSwapsStream from './AssetSwapsStream';
import BuySellTrader from './BuySellTrader';
import type { TraderInputs } from './PageTrade/types';

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
        className="[&_.ant-tabs-nav]:!-mx-3 [&_.ant-tabs-tab]:!px-4 [&_.ant-tabs-tab]:!text-xs [&_.ant-tabs-nav]:mb-3"
        defaultActiveKey="terminal"
        items={items}
      />
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
