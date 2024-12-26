import { Trans, useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { MarketPulseOnboarding } from './components/MarketPulseOnboarding';
import { TechnicalOverviewWidget } from './components/TechnicalOverviewWidget';
import MarketPulseAlertButton from './components/MarketPulseAlertButton';
import { ConfirmationWidget } from './components/ConfirmationWidget';
import { RsiHeatmapWidget } from './components/RsiHeatmapWidget';

export default function PageMarketPulse() {
  const { t } = useTranslation('base');
  return (
    <PageWrapper>
      <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
        <div className="col-span-full flex flex-wrap items-center justify-between gap-6">
          <PageTitle
            title={t('menu.ai-indicators.title')}
            description={
              <p className="[&_b]:font-medium [&_b]:text-v1-content-primary">
                <Trans ns="base" i18nKey="menu.ai-indicators.subtitle" />
              </p>
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
