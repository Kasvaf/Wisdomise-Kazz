import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { useDiscoveryParams } from './hooks/useDiscoveryParams';
import { ListView } from './components/ListView';
import { DetailView } from './components/DetailView';

export default function PageDiscovery() {
  const [params] = useDiscoveryParams();
  const isMobile = useIsMobile();

  return (
    <PageWrapper extension={<CoinExtensionsGroup />}>
      {params.view === 'both' && (
        <div className="flex flex-nowrap justify-between">
          <div className="block w-1/4 min-w-96 max-w-96">
            <ListView list={params.list} expanded={false} focus={false} />
          </div>
          <div className={clsx('relative w-full grow')}>
            <DetailView
              detail={params.detail}
              expanded={true}
              focus={true}
              slug={params.slug}
            />
          </div>
        </div>
      )}

      {params.view === 'list' && (
        <ListView list={params.list} expanded={!isMobile} focus={true} />
      )}

      {params.view === 'detail' && (
        <DetailView
          detail={params.detail}
          expanded={!isMobile}
          focus={true}
          slug={params.slug}
        />
      )}
    </PageWrapper>
  );
}
