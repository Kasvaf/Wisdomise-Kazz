import { Tabs, type TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import TabApi from './TabApi';
import TabConfig from './TabConfig';
import TabPerformance from './TabPerformance';

const items: TabsProps['items'] = [
  {
    key: 'pos',
    label: 'Positions',
    children: 'Positions tab',
  },
  {
    key: 'term',
    label: 'Terminal',
    children: 'Content of Tab Pane 2',
  },
  {
    key: 'config',
    label: 'Configuration',
    children: <TabConfig />,
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

  const [activeTab, setActiveTab] = useSearchParamAsState<string>('tab', 'pos');

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
