import { Tabs, type TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import TabUsage from './TabUsage';
import TabBuilder from './TabBuilder';
import TabPositions from './TabPositions';
import TabPerformance from './TabPerformance';

export default function PageFpDetails() {
  const { t } = useTranslation('builder');
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) {
      navigate('/marketplace/builder/fp');
    }
  }, [params.id, navigate]);

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'build',
  );

  const hasFlag = useHasFlag();
  const items: TabsProps['items'] = [
    {
      key: 'build',
      label: t('fp.tabs.product-builder'),
      children: <TabBuilder />,
    },
    {
      key: 'perf',
      label: t('fp.tabs.performance'),
      children: <TabPerformance />,
    },
    {
      key: 'pos',
      label: t('fp.tabs.positions'),
      children: <TabPositions />,
    },
    {
      key: 'usage',
      label: t('fp.tabs.usage'),
      children: <TabUsage />,
    },
  ].filter(x => hasFlag('?tab=' + x.key));
  // 🚩 /builder/fp/[id]?tab=key

  return (
    <PageWrapper>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </PageWrapper>
  );
}
