import { Tabs, type TabsProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import OverviewTab from './OverviewTab';
import InvoicesTab from './InvoicesTab';

export default function SubscriptionDetail() {
  const { t } = useTranslation('billing');

  const tabs = useMemo<TabsProps['items']>(
    () => [
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
    ],
    [t],
  );

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold capitalize text-white">
        {t('subscription-details.title')}
      </h1>
      <Tabs items={tabs} tabBarStyle={{ color: '#fff' }} />
    </>
  );
}
