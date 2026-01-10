import { clsx } from 'clsx';
import { ActiveQuoteProvider } from 'modules/autoTrader/useActiveQuote';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { DetailView } from './DetailView';
import { ListView } from './ListView';
import {
  DiscoveryExpandCollapser,
  useDiscoveryBackdropParams,
  useDiscoveryUrlParams,
} from './lib';

export default function PageDiscovery() {
  const [backdropParams] = useDiscoveryBackdropParams();
  const urlParams = useDiscoveryUrlParams();
  const isMobile = useIsMobile();

  // Only lock scroll on mobile for detail pages (token/coin pages), not list pages (trench/bluechip)
  const mainClassName = clsx(
    '!p-0 h-full',
    urlParams.detail && 'max-md:overflow-hidden',
  );

  return (
    <PageWrapper
      className="h-full"
      extension={<CoinExtensionsGroup />}
      mainClassName={mainClassName}
    >
      <ActiveQuoteProvider>
        <div className="flex h-full justify-start">
          {/* List Sidebar Mode */}
          {!urlParams.list && backdropParams.list && !isMobile && (
            <ListView
              className={clsx(
                'max-w-full',
                'sticky top-(--desktop-content-top) z-30 h-(--desktop-content-height) w-72 min-w-72 max-w-72 overflow-auto',
                'scrollbar-none border-white/10 border-r bg-v1-surface-l0',
                'tablet:bg-v1-surface-l0/60 max-md:block md:max-xl:fixed md:max-xl:backdrop-blur-lg',
              )}
              expanded={false}
              focus={false}
              list={backdropParams.list ?? 'trench'}
            />
          )}

          {/* List Full-Page Mode */}
          {urlParams.list && (
            <ListView
              className="w-full max-w-full"
              expanded={!isMobile}
              focus
              list={urlParams.list ?? 'trench'}
            />
          )}

          {/* Detail FullPage/Semi-HalfPage Mode */}
          {urlParams.detail && (
            <DetailView
              className="min-w-0 shrink grow"
              detail={urlParams.detail}
              expanded={!isMobile}
              focus
            />
          )}
        </div>
      </ActiveQuoteProvider>
      <DiscoveryExpandCollapser />
    </PageWrapper>
  );
}
