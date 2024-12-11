import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { MarketPulseOnboarding } from './components/MarketPulseOnboarding';
import { TechnicalOverviewWidget } from './components/TechnicalOverviewWidget';
import MarketPulseAlertButton from './components/MarketPulseAlertButton';
import { ConfirmationWidget } from './components/ConfirmationWidget';
import { RsiHeatmapWidget } from './components/RsiHeatmapWidget';

export default function PageMarketPulse() {
  return (
    <PageWrapper>
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-full flex flex-wrap items-center justify-between gap-6 pt-2">
          <PageTitle
            title="~Technical Radar"
            description={
              <p
                className="[&_b]:font-normal [&_b]:text-v1-content-primary"
                dangerouslySetInnerHTML={{
                  __html:
                    '~Navigate The Market with Technical Radar—Your Hub for Top Crypto Rankings, Trends, and Powerful <b>RSI/MACD Insights</b>',
                }}
              ></p>
            }
            className="max-w-xl grow"
          />
          <MarketPulseAlertButton className="mobile:w-full mobile:grow" />
        </div>
        <TechnicalOverviewWidget className="col-span-full" />
        <ConfirmationWidget indicator="rsi" type="bullish" />
        <ConfirmationWidget indicator="macd" type="bullish" />
        <RsiHeatmapWidget className="col-span-full" />
        <ConfirmationWidget indicator="rsi" type="bearish" />
        <ConfirmationWidget indicator="macd" type="bearish" />
      </div>

      <MarketPulseOnboarding />
    </PageWrapper>
  );
}
