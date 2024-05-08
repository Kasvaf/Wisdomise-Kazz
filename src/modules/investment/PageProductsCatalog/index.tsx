import { Tabs, type TabsProps } from 'antd';

import { useTranslation } from 'react-i18next';
import { trackClick } from 'config/segment';
import { useHasFlag } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { ProductsCatalogOnboarding } from './ProductsCatalogOnboarding';
import TabTrade from './TabTrade';
import TabStake from './TabStake';

const PageProductsCatalog = () => {
  const { t } = useTranslation('products');
  const hasFlag = useHasFlag();
  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'trade',
  );

  const items: TabsProps['items'] = [
    {
      key: 'trade',
      label: t('product-detail.type.trade'),
      children: <TabTrade type="WISDOMISE" />,
    },
    {
      key: 'mine',
      label: t('product-detail.type.mine'),
      children: <TabTrade type="MINE" />,
    },
    {
      key: 'stake',
      label: t('product-detail.type.stake'),
      children: <TabStake />,
    },
  ].filter(x => hasFlag('?tab=' + x.key));
  // 🚩 /investment/products-catalog?tab=[key]

  const onTabChange = (newTab: string) => {
    trackClick(newTab + '_tab')();
    setActiveTab(newTab);
  };

  return (
    <PageWrapper>
      <ProductsCatalogOnboarding />
      <Tabs activeKey={activeTab} onChange={onTabChange} items={items} />
    </PageWrapper>
  );
};

export default PageProductsCatalog;
