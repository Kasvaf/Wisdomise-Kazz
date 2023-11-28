import { Tabs, type TabsProps } from 'antd';

import PageWrapper from 'modules/base/PageWrapper';
import TabTrade from './TabTrade';
import TabStake from './TabStake';

const PageProductsCatalog = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Stake',
      children: <TabStake />,
    },
    {
      key: '2',
      label: 'Trade',
      children: <TabTrade />,
    },
  ];

  return (
    <PageWrapper>
      <Tabs defaultActiveKey="1" items={items} />
    </PageWrapper>
  );
};

export default PageProductsCatalog;
