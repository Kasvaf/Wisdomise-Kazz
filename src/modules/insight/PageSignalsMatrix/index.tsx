import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, type TabsProps } from 'antd';
import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useHasFlag } from 'api';
import InsightDisclaimer from '../InsightDisclaimer';
import BestPerforming from './BestPerforming';
import SignalMatrix from './SignalMatrix';
import { SignalMatrixOnboarding } from './SignalMatrixOnboarding';

const PanelWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="overflow-x-scroll mobile:-mx-6">
      <div className="w-max min-w-full mobile:mx-6 mobile:min-w-[calc(100%-48px)]">
        {children}
      </div>
    </div>
  );
};

const PageSignalsMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const hasFlag = useHasFlag();
  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'matrix',
  );

  const items: TabsProps['items'] = [
    {
      key: 'matrix',
      label: t('matrix.latest-positions'),
      children: (
        <PanelWrapper>
          <SignalMatrix />
        </PanelWrapper>
      ),
    },
    {
      key: '7d',
      label: t('matrix.best-performing-7d'),
      children: (
        <PanelWrapper>
          <BestPerforming />
        </PanelWrapper>
      ),
    },
    {
      key: '30d',
      label: t('matrix.best-performing-30d'),
      children: (
        <PanelWrapper>
          <BestPerforming />
        </PanelWrapper>
      ),
    },
    ...(hasFlag('/insight/marketplace')
      ? [
          {
            key: 'marketplace',
            label: t('matrix.marketplace'),
            children: <Navigate to="/insight/marketplace" />,
          },
        ]
      : []),
  ];

  return (
    <PageWrapper>
      <InsightDisclaimer />
      <SignalMatrixOnboarding />
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
