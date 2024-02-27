import { Tabs, type TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import TabApi from './TabApi';
import TabConfig from './TabConfig';
import TabTerminal from './TabTerminal';
import TabPositions from './TabPositions';
import TabPerformance from './TabPerformance';

const items: TabsProps['items'] = [
  {
    key: 'config',
    label: 'Configuration',
    children: <TabConfig />,
  },
  {
    key: 'term',
    label: 'Terminal',
    children: <TabTerminal />,
  },
  {
    key: 'pos',
    label: 'Positions',
    children: <TabPositions />,
  },
  {
    key: 'perf',
    label: 'Performance',
    children: <TabPerformance />,
  },
  {
    key: 'api',
    label: 'API',
    children: <TabApi />,
  },
];

export default function PageSignalerDetails() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) {
      navigate('/builder/signalers');
    }
  }, [params.id, navigate]);

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'config',
  );

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
