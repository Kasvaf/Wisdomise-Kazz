import { useCallback, useMemo } from 'react';
import type { ColumnType } from 'antd/es/table';
import { Table } from 'antd';
import {
  useAccountQuery,
  useInvoicesQuery,
  usePlansQuery,
  useSubscription,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { DebugPin } from 'shared/DebugPin';
import useModal from 'shared/useModal';
import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { Button } from 'shared/v1-components/Button';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import SubscriptionDetail from 'modules/account/PageBilling/SubscriptionDetail';
import { ReactComponent as Check } from './images/check2.svg';

export default function PageBilling() {
  const plans = usePlansQuery();
  const invoices = useInvoicesQuery();
  const subscription = useSubscription();
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();
  const { data: account } = useAccountQuery();

  const datasource = [
    { feature: 'Whale Radar', free: <Check />, vip: <Check /> },
    { feature: 'Radar +', free: <Check />, vip: <Check /> },
    { feature: 'Technical Radar', free: '-', vip: <Check /> },
    { feature: 'Social Radar', free: '-', vip: <Check /> },
    { feature: 'Alert Screener', free: '-', vip: <Check /> },
    { feature: 'Trade Fee (%)', free: 0.8, vip: 0.6 },
  ] as const;

  const columns = useMemo<Array<ColumnType<any>>>(
    () => [
      {
        title: '',
        dataIndex: 'feature',
        render: (_, { feature }) => <p>{feature}</p>,
      },
      {
        title: 'Free',
        dataIndex: 'free',
        render: (_, { free }) => <p>{free}</p>,
      },
      {
        title: 'VIP',
        dataIndex: 'vip',
        render: (_, { vip }) => <p>{vip}</p>,
      },
    ],
    [],
  );

  const isLoading =
    (account?.info && invoices.isLoading) ||
    plans.isLoading ||
    subscription.isLoading;

  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const onLockClick = useCallback(async () => {
    if (!plans.data?.results[0]) return;
    const isLoggedIn = await ensureAuthenticated();
    if (isLoggedIn) {
      void openTokenPaymentModal({ plan: plans.data?.results[0] });
    }
  }, [ensureAuthenticated, openTokenPaymentModal, plans.data?.results]);

  return (
    <PageWrapper
      hasBack
      className="h-full"
      loading={isLoading}
      mountWhileLoading
      title={null}
    >
      {subscription.group === 'free' ||
      subscription.group === 'initial' ||
      !account?.info ? (
        <div className="flex flex-col items-center">
          <h1 className="mt-10 text-6xl">Stake 1000$ for VIP access</h1>
          <p className="mt-4 text-v1-content-secondary">
            and earn your share of 50% of Wisdomize’s revenue (read more)
          </p>
          <Button onClick={onLockClick} className="mt-10">
            <DebugPin
              title="/account/billing?payment_method=lock"
              color="orange"
            />
            <div className="flex items-center gap-2">Stake WSDM</div>
          </Button>
          {/* <Wallet /> */}
          {tokenPaymentModal}
          {ModalLogin}
          <div className="mt-10 w-[800px]">
            <Table
              columns={columns}
              dataSource={datasource}
              pagination={false}
            />
          </div>
        </div>
      ) : (
        <SubscriptionDetail />
      )}
      {/* <SuccessfulPaymentMessage /> */}
    </PageWrapper>
  );
}
