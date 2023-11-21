import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountQuery, useSignalsQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Locker from 'shared/Locker';
import SignalMatrix from './SignalMatrix';
import SignalsOverlay from './SignalsOverlay';

const PageSignalsMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const { data: account, isLoading: isLoadingAccount } = useAccountQuery();
  const { data, isLoading: isLoadingSignals } = useSignalsQuery();
  const canView =
    account?.subscription_item?.subscription_plan.metadata.view_signal_matrix;

  return (
    <PageWrapper loading={isLoadingAccount || isLoadingSignals}>
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
