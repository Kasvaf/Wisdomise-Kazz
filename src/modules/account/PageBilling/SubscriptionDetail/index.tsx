import { Tabs, type TabsProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import OverviewTab from './OverviewTab';
import InvoicesTab from './InvoicesTab';

export default function SubscriptionDetail() {
  const { t } = useTranslation('billing');
  const hasFlag = useHasFlag();

  const items = useMemo(() => {
    const tabs: TabsProps['items'] = [
      {
        key: 'overview',
        label: t('tabs.overview'),
        children: <OverviewTab />,
      },
    ];
    if (hasFlag('/account/billing?invoices')) {
      tabs.push({
        key: 'invoices',
        label: t('tabs.invoices'),
        children: <InvoicesTab />,
      });
    }
    return tabs;
  }, [t, hasFlag]);

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold capitalize text-white">
        {t('subscription-details.title')}
      </h1>
      <Tabs items={items} tabBarStyle={{ color: '#fff' }} />
    </>
  );
}
