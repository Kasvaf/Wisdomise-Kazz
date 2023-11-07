import { Tabs, type TabsProps } from 'antd';
import { Outlet } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserFirstPaymentMethod } from 'api';
import OverviewTab from './OverviewTab';
import InvoicesTab from './InvoicesTab';
import PaymentMethodsTab from './PaymentMethodsTab';

export default function SubscriptionDetail() {
  const { t } = useTranslation('billing');
  const firstPaymentMethod = useUserFirstPaymentMethod();

  const tabs = useMemo<TabsProps['items']>(() => {
    const tabs: TabsProps['items'] = [
      {
        key: 'overview',
        label: 'Overview',
        children: <OverviewTab />,
      },
      {
        key: 'invoices',
        label: 'Invoices',
        children: <InvoicesTab />,
      },
    ];
    if (firstPaymentMethod === 'FIAT') {
      tabs.push({
        key: 'payment-methods',
        label: 'Payment Methods',
        children: <PaymentMethodsTab />,
      });
    }
    return tabs;
  }, [firstPaymentMethod]);

  return (
    <>
      <h1 className="mb-4 text-base font-semibold text-white">
        {t('subscription-details.title')}
      </h1>
      <Tabs items={tabs} tabBarStyle={{ color: '#fff' }} />
      <Outlet />
    </>
  );
}
