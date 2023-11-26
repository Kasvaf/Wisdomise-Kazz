import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useSignalsQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Locker from 'shared/Locker';
import SignalMatrix from './SignalMatrix';
import SignalsOverlay from './SignalsOverlay';

const PageSignalsMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const { data, isLoading: isLoadingSignals } = useSignalsQuery();
  const subscription = useSubscription();
  const canView =
    subscription.isActive && subscription.plan?.metadata.view_signal_matrix;

  return (
    <PageWrapper loading={subscription.isLoading || isLoadingSignals}>
      <h1 className="mb-7 mt-2 text-xl font-semibold text-white">
        {t('matrix.title')}
      </h1>
      <Locker overlay={!canView && <SignalsOverlay />}>
        {data && <SignalMatrix signals={data} />}
      </Locker>
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
