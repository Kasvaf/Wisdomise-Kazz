import { Tabs, type TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useHasFlag } from 'api';
import TabApi from './TabApi';
import TabConfig from './TabConfig';
import TabTerminal from './TabTerminal';
import TabPositions from './TabPositions';
import TabPerformance from './TabPerformance';

export default function PageSignalerDetails() {
  const { t } = useTranslation('builder');
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) {
      navigate('/marketplace/builder/signalers');
    }
  }, [params.id, navigate]);

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'config',
  );

  const hasFlag = useHasFlag();
  const items: TabsProps['items'] = [
    {
      key: 'config',
      label: t('signaler.tabs.configuration'),
      children: <TabConfig />,
    },
    {
      key: 'term',
      label: t('signaler.tabs.terminal'),
      children: <TabTerminal />,
    },
    {
      key: 'pos',
      label: t('signaler.tabs.positions'),
      children: <TabPositions />,
    },
    {
      key: 'perf',
      label: t('signaler.tabs.performance'),
      children: <TabPerformance />,
    },
    {
      key: 'api',
      label: t('signaler.tabs.api'),
      children: <TabApi />,
    },
  ].filter(x => hasFlag('?tab=' + x.key));
  // 🚩 /builder/signalers/[id]?tab=key

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
