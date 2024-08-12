import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, type TabsProps } from 'antd';
import { bxLock } from 'boxicons-quasar';
import { useHasFlag } from 'api';
import { useSignalerQuery } from 'api/builder';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Icon from 'shared/Icon';
import TabApi from './TabApi';
import TabConfig from './TabConfig';
import TabTerminal from './TabTerminal';
import TabPositions from './TabPositions';
import TabPerformance from './TabPerformance';

const Lockable: React.FC<{ label: string; isLocked?: boolean }> = ({
  label,
  isLocked,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center',
        isLocked && 'cursor-not-allowed !text-white/20',
      )}
    >
      {label + ' '}
      {isLocked && <Icon name={bxLock} className="ml-1" size={16} />}
    </div>
  );
};

export default function PageSignalerDetails() {
  const { t } = useTranslation('builder');
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) {
      navigate('/builder/signalers');
    }
  }, [params.id, navigate]);

  const [activeTab, setActiveTab] = useSearchParamAsState<string>(
    'tab',
    'config',
  );

  const hasFlag = useHasFlag();
  const { data: signaler } = useSignalerQuery(params.id);
  const isLocked = !signaler?.assets.length;

  const items: TabsProps['items'] = [
    {
      key: 'config',
      label: t('signaler.tabs.configuration'),
      children: <TabConfig />,
    },
    {
      key: 'term',
      label: (
        <Lockable label={t('signaler.tabs.terminal')} isLocked={isLocked} />
      ),
      children: <TabTerminal />,
    },
    {
      key: 'pos',
      label: (
        <Lockable label={t('signaler.tabs.positions')} isLocked={isLocked} />
      ),
      children: <TabPositions />,
    },
    {
      key: 'perf',
      label: (
        <Lockable label={t('signaler.tabs.performance')} isLocked={isLocked} />
      ),
      children: <TabPerformance />,
    },
    {
      key: 'api',
      label: <Lockable label={t('signaler.tabs.api')} isLocked={isLocked} />,
      children: <TabApi />,
    },
  ].filter(x => hasFlag('?tab=' + x.key));
  // 🚩 /builder/signalers/[id]?tab=key

  return (
    <PageWrapper>
      <Tabs
        activeKey={activeTab}
        onChange={x => !isLocked && setActiveTab(x)}
        items={items}
      />
    </PageWrapper>
  );
}
