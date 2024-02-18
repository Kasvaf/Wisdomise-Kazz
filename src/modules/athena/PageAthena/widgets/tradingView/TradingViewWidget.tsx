import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { WidgetWrapper } from '../WidgetWrapper';
import chartIcon from './chart.svg';

interface Props {
  symbol: string;
  settings: TradingViewWidgetType['settings'];
}

export const TradingViewWidget = ({ settings, symbol }: Props) => {
  const { interval, timezone, style } = settings;

  return (
    <WidgetWrapper title="Chart" iconSrc={chartIcon} poweredBy="wisdomise">
      <section className="-mx-8 max-md:-mx-3">
        <AdvancedRealTimeChart
          theme="dark"
          width="100%"
          style={style}
          height="360"
          symbol={symbol}
          timezone={timezone}
          toolbar_bg="#f1f3f6"
          interval={interval ?? 'D'}
          hide_top_toolbar
          hide_side_toolbar
        />
      </section>
    </WidgetWrapper>
  );
};

TradingViewWidget.displayName = 'TradingViewWidget';

interface TradingViewWidgetType {
  symbol: string;
  type: 'price_chart';
  settings: {
    allow_symbol_change?: boolean;
    autosize?: boolean;
    container_id?: 'tradingview_adde9';
    enable_publishing?: boolean;
    interval?: 'D';
    locale?: 'en';
    style?: '1';
    theme?: 'dark';
    timezone?: 'Etc/UTC';
    toolbar_bg?: '#f1f3f6';
  };
}
