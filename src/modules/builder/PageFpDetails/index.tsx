import { Tabs, type TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import TabUsage from './TabUsage';

const items: TabsProps['items'] = [
  {
    key: 'config',
    label: 'Product Builder',
    children: <>Product Builder</>,
  },
  {
    key: 'perf',
    label: 'Performance',
    children: <>Performance</>,
  },
  {
    key: 'pos',
    label: 'Positions',
    children: <>Positions</>,
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
    'config',
  );

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
