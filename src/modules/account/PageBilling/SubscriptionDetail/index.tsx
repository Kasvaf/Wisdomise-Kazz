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
        label: t('tabs.overview'),
        children: <OverviewTab />,
      },
      {
        key: 'invoices',
        label: t('tabs.invoices'),
        children: <InvoicesTab />,
      },
    ];
    if (firstPaymentMethod === 'FIAT') {
      tabs.push({
        key: 'payment-methods',
        label: t('tabs.payment-methods'),
        children: <PaymentMethodsTab />,
      });
    }
    return tabs;
  }, [firstPaymentMethod, t]);

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
