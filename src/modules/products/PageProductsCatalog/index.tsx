import { Tabs, type TabsProps } from 'antd';

import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'modules/shared/useSearchParamAsState';
import TabTrade from './TabTrade';
import TabStake from './TabStake';

const PageProductsCatalog = () => {
  const { t } = useTranslation('products');
  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'stake',
  );

  const items: TabsProps['items'] = [
    {
      key: 'stake',
      label: t('product-detail.type.stake'),
      children: <TabStake />,
    },
    {
      key: 'trade',
      label: t('product-detail.type.trade'),
      children: <TabTrade />,
    },
  ];

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
};

export default PageProductsCatalog;
