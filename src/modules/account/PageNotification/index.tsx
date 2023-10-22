import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useStrategiesQuery } from 'api/notification';
import PageWrapper from 'modules/base/PageWrapper';
import SignalingTab from './SignalingTab';
import CustomNotificationTab from './CustomNotificationTab';

export default function PageNotification() {
  const strategies = useStrategiesQuery();

  return (
    <PageWrapper loading={strategies.isLoading}>
      <h1 className="mb-6 text-xl font-semibold">Notification Center</h1>
      <p className="mb-4 text-white/60">
        Here you can filter your notifications
      </p>
      <Tabs defaultActiveKey="signaling" items={tabs} />
    </PageWrapper>
  );
}

const tabs: TabsProps['items'] = [
  {
    key: 'signaling',
    label: 'Signaling',
    children: <SignalingTab />,
  },
  {
    key: 'notification',
    label: 'Customize Notification',
    children: <CustomNotificationTab />,
  },
];
