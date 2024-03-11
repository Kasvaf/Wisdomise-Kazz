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

const items: TabsProps['items'] = [
  {
    key: 'matrix',
    label: 'All Coins',
    children: <SignalMatrix />,
  },
  {
    key: '7d',
    label: 'Best Performing 7D',
    children: <BestPerforming />,
  },
  {
    key: '30d',
    label: 'Best Performing 30D',
    children: <BestPerforming />,
  },
];

const PageSignalsMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const subscription = useSubscription();
  const canView =
    subscription.isActive && subscription.plan?.metadata.view_signal_matrix;

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'matrix',
  );

  return (
    <PageWrapper loading={subscription.isLoading}>
      <h1 className="mb-7 mt-2 text-xl font-semibold text-white">
        {t('matrix.title')}
      </h1>
      <Locker overlay={null && !canView && <SignalsOverlay />}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </Locker>
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
