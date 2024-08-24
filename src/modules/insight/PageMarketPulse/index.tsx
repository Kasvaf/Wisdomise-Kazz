import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useRsiDivergence, useRsiOverness } from 'api/market-pulse';
import { RsiDetails } from './RsiDetails';
import { IndicatorSelect } from './IndicatorSelect';

export default function PageMarketPulse() {
  const { t } = useTranslation('market-pulse');
  const [indicator, setIndicator] = useSearchParamAsState<'rsi' | 'macd'>(
    'indicator',
    'rsi',
  );

  useRsiOverness();
  useRsiDivergence();

  return (
    <PageWrapper className="leading-none mobile:leading-normal">
      <PageTitle
        title={t('base:menu.market-pulse.title')}
        description={t('base:menu.market-pulse.subtitle')}
        className="mb-8"
        badge="new"
      />
      <div className="flex flex-col gap-4">
        <IndicatorSelect value={indicator} onChange={setIndicator} />
        {indicator === 'rsi' && <RsiDetails />}
      </div>
    </PageWrapper>
  );
}
