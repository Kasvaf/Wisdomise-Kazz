import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useStrategiesQuery } from 'api/notification';
import PageWrapper from 'modules/base/PageWrapper';
import SignalingTab from './SignalingTab';
import CustomNotificationTab from './CustomNotificationTab';

export default function PageNotification() {
  const { t } = useTranslation('notifications');
  const strategies = useStrategiesQuery();

  const tabs: TabsProps['items'] = [
    {
      key: 'signaling',
      label: t('signaling.title'),
      children: <SignalingTab />,
    },
    {
      key: 'notification',
      label: t('customs.title'),
      children: <CustomNotificationTab />,
    },
  ];

  return (
    <PageWrapper loading={strategies.isLoading}>
      <h1 className="mb-6 text-xl font-semibold">
        {t('base:menu.notification-center.title')}
      </h1>
      <p className="mb-4 text-white/60">{t('page.description')}</p>
      <Tabs defaultActiveKey="signaling" items={tabs} />
    </PageWrapper>
  );
}
