import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { ActiveQuoteProvider } from 'modules/autoTrader/useActiveQuote';
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
      <ActiveQuoteProvider>
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
                        'sticky top-(--desktop-content-top) z-30 h-(--desktop-content-height) w-72 min-w-72 max-w-72 overflow-auto',
                        'border-r border-white/10 bg-v1-surface-l0 scrollbar-none',
                        'mobile:block tablet:fixed tablet:bg-v1-surface-l0/60 tablet:backdrop-blur-lg',
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
      </ActiveQuoteProvider>
      <ListExpander />
    </PageWrapper>
  );
}
