import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, type TabsProps } from 'antd';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import BestPerforming from './BestPerforming';
import SignalMatrix from './SignalMatrix';

const PageSignalsMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
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
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
