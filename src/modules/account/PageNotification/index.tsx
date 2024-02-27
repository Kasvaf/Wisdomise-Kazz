import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { analytics } from 'config/segment';
import { useStrategiesList } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import SignalingTab from './SignalingTab';
import CustomNotificationTab from './CustomNotificationTab';

export default function PageNotification() {
  const { t } = useTranslation('notifications');
  const strategies = useStrategiesList();
  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'center',
  );

  const tabs: TabsProps['items'] = [
    {
      key: 'center',
      label: t('signaling.title'),
      children: <SignalingTab />,
    },
    {
      key: 'customize',
      label: t('customs.title'),
      children: <CustomNotificationTab />,
    },
  ];

  useEffect(() => {
    void analytics.track('click_on', {
      place: 'notification_center',
    });
  }, []);

  const tabChangeHandler = (v: string) => {
    setActiveTab(v);
    void analytics.track('click_on', {
      place: 'notification_' + v,
    });
  };

  return (
    <PageWrapper loading={strategies.isLoading}>
      <h1 className="mb-6 text-xl font-semibold">
        {t('base:menu.notification-center.title')}
      </h1>
      <p className="mb-4 text-white/60">{t('page.description')}</p>
      <Tabs activeKey={activeTab} items={tabs} onChange={tabChangeHandler} />
    </PageWrapper>
  );
}
