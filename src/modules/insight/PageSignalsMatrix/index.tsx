import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, type TabsProps } from 'antd';
import { useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Locker from 'shared/Locker';
import SignalMatrix from './SignalMatrix';
import SignalsOverlay from './SignalsOverlay';
import BestPerforming from './BestPerforming';

const PageSignalsMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const subscription = useSubscription();
  const canView =
    subscription.isActive && subscription.plan?.metadata.view_signal_matrix;

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'matrix',
  );

  const items: TabsProps['items'] = [
    {
      key: 'matrix',
      label: t('matrix.latest-positions'),
      children: <SignalMatrix />,
    },
    {
      key: '7d',
      label: t('matrix.best-performing-7d'),
      children: <BestPerforming />,
    },
    {
      key: '30d',
      label: t('matrix.best-performing-30d'),
      children: <BestPerforming />,
    },
  ];

  return (
    <PageWrapper loading={subscription.isLoading}>
      <Locker overlay={null && !canView && <SignalsOverlay />}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </Locker>
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
