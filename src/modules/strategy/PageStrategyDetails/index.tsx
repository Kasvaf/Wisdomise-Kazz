import { Tabs, type TabsProps } from 'antd';
import PageWrapper from 'modules/base/PageWrapper';
import TabSettings from './TabSettings';
import TabCockpit from './TabCockpit';
import TabPositions from './TabPositions';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Cockpit',
    children: <TabCockpit />,
  },
  {
    key: '2',
    label: 'Back Test',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Positions',
    children: <TabPositions />,
  },
  {
    key: '4',
    label: 'Debug',
    children: 'Content of Tab Pane 3',
  },
  {
    key: '5',
    label: 'Settings',
    children: <TabSettings />,
  },
];

export default function PageNewStrategy() {
  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Strategy Panel</h1>

      <Tabs defaultActiveKey="1" items={items} />
    </PageWrapper>
  );
}
