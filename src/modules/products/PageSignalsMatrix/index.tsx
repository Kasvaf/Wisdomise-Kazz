import type React from 'react';
import { bxLock } from 'boxicons-quasar';
import { useAccountQuery, useSignalsQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Locker from 'shared/Locker';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import SignalMatrix from './SignalMatrix';

const SignalsOverlay = () => (
  <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
    <div className="mb-4 rounded-full bg-white/10 p-4">
      <Icon name={bxLock} className="text-warning" size={40} />
    </div>

    <h1 className="text-white">You are not subscribed</h1>
    <div className="mt-2 text-slate-400">
      To reveal all signals, you need to{' '}
      <span className="text-white">Subscribe</span> or{' '}
      <span className="text-white">Upgrade</span> your current plan
    </div>

    <Button to="/account/billing" className="mt-6">
      Subscribe
    </Button>
  </Card>
);

const PageSignalsMatrix: React.FC = () => {
  const { data: account, isLoading: isLoadingAccount } = useAccountQuery();
  const { data, isLoading: isLoadingSignals } = useSignalsQuery();
  const canView =
    account?.subscription?.object?.plan.metadata.view_signal_matrix;

  return (
    <PageWrapper loading={isLoadingAccount || isLoadingSignals}>
      <h1 className="mb-7 mt-2 text-xl font-semibold text-white">
        Latest Positions
      </h1>
      <Locker overlay={!canView && <SignalsOverlay />}>
        {data && <SignalMatrix signals={data} />}
      </Locker>
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
