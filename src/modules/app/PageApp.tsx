import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { ListView } from './ListView';
import { DetailView } from './DetailView';
import { useAppRouteMeta } from './useAppRouteMeta';
import { ListExpander } from './ListExpander';

export default function PageDiscovery() {
  const { params } = useAppRouteMeta(true);
  const isMobile = useIsMobile();

  return (
    <PageWrapper
      extension={<CoinExtensionsGroup />}
      mainClassName="!p-0 h-full"
    >
      <ListExpander />

      <div className="flex justify-between">
        {params.view !== 'detail' && (
          <ListView
            className={clsx(
              'max-w-full p-3',
              params.view === 'list'
                ? 'w-full'
                : 'fixed top-[4.75rem] z-20 h-[calc(100svh-4.75rem)] w-96 min-w-96 max-w-96 overflow-auto border-r border-white/10 bg-v1-surface-l1 scrollbar-none mobile:block mobile:h-auto',
            )}
            list={params.list}
            expanded={params.view === 'list' && !isMobile}
            focus={params.view === 'list'}
          />
        )}

        {params.view !== 'list' && (
          <DetailView
            className={clsx(
              'min-w-0 shrink grow p-3',
              params.view === 'both' && 'ms-96',
            )}
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
