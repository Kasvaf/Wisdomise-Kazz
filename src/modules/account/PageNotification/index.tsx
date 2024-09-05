import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { analytics } from 'config/segment';
import { useStrategiesList } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { isProduction } from 'utils/version';
import { PageTitle } from 'shared/PageTitle';
import SignalingTab from './SignalingTab';
import CustomNotificationTab from './CustomNotificationTab';

export default function PageNotification() {
  const { t } = useTranslation('notifications');
  const strategies = useStrategiesList();
  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'center',
  );

  const tabs: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'center',
        label: t('signaling.title'),
        children: <SignalingTab />,
      },
      ...(isProduction
        ? []
        : [
            {
              key: 'customize',
              label: t('customs.title'),
              children: <CustomNotificationTab />,
            },
          ]),
    ],
    [t],
  );

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
      <PageTitle
        title={t('base:menu.notification-center.title')}
        description={t('base:menu.notification-center.subtitle')}
        className="mb-8"
      />
      <Tabs activeKey={activeTab} items={tabs} onChange={tabChangeHandler} />
    </PageWrapper>
  );
}
