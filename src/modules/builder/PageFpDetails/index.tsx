import { Tabs, type TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import TabUsage from './TabUsage';
import TabBuilder from './TabBuilder';
import TabPositions from './TabPositions';
import TabPerformance from './TabPerformance';

const items: TabsProps['items'] = [
  {
    key: 'build',
    label: 'Product Builder',
    children: <TabBuilder />,
  },
  {
    key: 'perf',
    label: 'Performance',
    children: <TabPerformance />,
  },
  {
    key: 'pos',
    label: 'Positions',
    children: <TabPositions />,
  },
  {
    key: 'usage',
    label: 'Usage',
    children: <TabUsage />,
  },
];

export default function PageFpDetails() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) {
      navigate('/builder/fp');
    }
  }, [params.id, navigate]);

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'build',
  );

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
