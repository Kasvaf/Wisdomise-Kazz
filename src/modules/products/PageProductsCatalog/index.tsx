import { Tabs, type TabsProps } from 'antd';

import { useTranslation } from 'react-i18next';
import { trackClick } from 'config/segment';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { isProduction } from 'utils/version';
import TabTrade from './TabTrade';
import TabStake from './TabStake';

const PageProductsCatalog = () => {
  const { t } = useTranslation('products');
  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'trade',
  );

  const items: TabsProps['items'] = [
    {
      key: 'trade',
      label: t('product-detail.type.trade'),
      children: <TabTrade />,
    },
    ...(isProduction
      ? []
      : [
          {
            key: 'stake',
            label: t('product-detail.type.stake'),
            children: <TabStake />,
          },
        ]),
  ];

  const onTabChange = (newTab: string) => {
    trackClick(newTab + '_tab')();
    setActiveTab(newTab);
  };

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={onTabChange} items={items} />
    </PageWrapper>
  );
};

export default PageProductsCatalog;
