import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { ListView } from './ListView';
import { DetailView } from './DetailView';
import { useDiscoveryRouteMeta } from './useDiscoveryRouteMeta';
import { ListExpander } from './ListExpander';

export default function PageDiscovery() {
  const { params } = useDiscoveryRouteMeta();
  const isMobile = useIsMobile();

  return (
    <PageWrapper
      extension={<CoinExtensionsGroup />}
      mainClassName="!p-0 h-full"
    >
      <div className="flex justify-start">
        {(isMobile ? params.view === 'list' : true) && (
          <ListView
            className={clsx(
              'max-w-full',
              params.view === 'list'
                ? 'w-full'
                : params.view === 'detail'
                ? 'hidden'
                : [
                    'sticky top-[76px] z-30 h-[calc(100svh-76px)] w-96 min-w-96 max-w-96 overflow-auto',
                    'border-r border-white/10 bg-v1-surface-l1 scrollbar-none',
                    'mobile:block tablet:fixed tablet:bg-v1-surface-l1/60 tablet:backdrop-blur-lg',
                  ],
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
              params.detail === 'coin' && '!p-0 mobile:p-3',
            )}
            detail={params.detail}
            expanded={!isMobile}
            focus={true}
          />
        )}
      </div>
      <ListExpander />
    </PageWrapper>
  );
}
