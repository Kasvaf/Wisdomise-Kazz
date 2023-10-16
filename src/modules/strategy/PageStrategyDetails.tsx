import { Tabs, type TabsProps } from 'antd';
import { useCallback } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import TabSettings from './TabSettings';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Cockpit',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Back Test',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Debug',
    children: 'Content of Tab Pane 3',
  },
  {
    key: '4',
    label: 'Settings',
    children: <TabSettings />,
  },
];

export default function PageNewStrategy() {
  const onChange = useCallback((key: string) => {
    console.log(key);
  }, []);

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Strategy Panel</h1>

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </PageWrapper>
  );
}
