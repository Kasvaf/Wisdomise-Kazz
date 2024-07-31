import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { analytics } from 'config/segment';
import { useHasFlag, useStrategiesList } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { isProduction } from 'utils/version';
import { PageTitle } from 'shared/PageTitle';
import SignalingTab from './SignalingTab';
import AlertsTab from './AlertsTab';
import CustomNotificationTab from './CustomNotificationTab';

export default function PageNotification() {
  const { t } = useTranslation('notifications');
  const strategies = useStrategiesList();
  const hasFlag = useHasFlag();
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
      ...(hasFlag('/account/notification-center?tab=alerts')
        ? [
            {
              key: 'alerts',
              label: t('alerts.title'),
              children: <AlertsTab />,
            },
          ]
        : []),
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
    [hasFlag, t],
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
