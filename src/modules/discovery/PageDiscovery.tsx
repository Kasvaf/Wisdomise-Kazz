import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { useDiscoveryParams } from './hooks/useDiscoveryParams';
import { ListView } from './components/ListView';
import { DetailView } from './components/DetailView';

export default function PageDiscovery() {
  const params = useDiscoveryParams();
  const isMobile = useIsMobile();
  // const navigateToList = useNavigateToList();

  return (
    <PageWrapper
      extension={<CoinExtensionsGroup />}
      mainClassName="!p-0 h-full"
    >
      <div className="flex min-h-[calc(100vh-76px)] flex-nowrap justify-between">
        <ListView
          className={clsx(params.view === 'both' && 'w-96 min-w-96 max-w-96')}
          list={params.list}
          expanded={params.view === 'list' && isMobile}
          focus={params.view === 'list'}
        />

        {params.view !== 'list' && (
          <DetailView
            className="grow"
            detail={params.detail}
            expanded={!isMobile}
            focus={true}
            slug={params.slug}
          />
        )}
      </div>
    </PageWrapper>
  );
}
