import { Tabs, type TabsProps } from 'antd';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'modules/shared/useSearchParamAsState';
import TabApi from './TabApi';

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
    children: 'Config tab',
  },
  {
    key: 'perf',
    label: 'Performance',
    children: 'Content of Tab Pane 3',
  },
  {
    key: 'api',
    label: 'API',
    children: <TabApi />,
  },
];

export default function PageSignalerDetails() {
  const [activeTab, setActiveTab] = useSearchParamAsState<string>('tab', 'pos');

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
