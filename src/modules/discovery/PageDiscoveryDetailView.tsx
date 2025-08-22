import { clsx } from 'clsx';
import { ActiveQuoteProvider } from 'modules/autoTrader/useActiveQuote';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import type { DETAILS, LISTS } from './constants';
import { DetailView } from './DetailView';
import { DiscoveryViewChanger } from './DiscoveryViewChanger';
import { ListView } from './ListView';
import { useDiscoveryActiveParams, useDiscoveryBackdropParams } from './lib';

// full page / side by side detail view
export default function PageDiscoveryDetailView() {
  const activeyParams = useDiscoveryActiveParams();
  const [backdropParams] = useDiscoveryBackdropParams();
  const detail = activeyParams[0] as keyof typeof DETAILS;
  const list = backdropParams?.[0] as keyof typeof LISTS | undefined;
  if (!detail) throw new Error('unexpected');

  const isMobile = useIsMobile();

  return (
    <PageWrapper
      extension={<CoinExtensionsGroup />}
      mainClassName="!p-0 h-full"
    >
      <ActiveQuoteProvider>
        <div className="flex justify-start">
          {list && !isMobile && (
            <ListView
              className={clsx(
                'sticky top-(--desktop-content-top) z-30 h-(--desktop-content-height) w-72 min-w-72 max-w-72 overflow-auto',
                'scrollbar-none border-white/10 border-r bg-v1-surface-l0',
                'tablet:fixed mobile:block tablet:bg-v1-surface-l0/60 tablet:backdrop-blur-lg',
              )}
              expanded={false}
              focus={false}
              list={list}
            />
          )}

          <DetailView
            className="min-w-0 shrink grow p-3"
            detail={detail}
            expanded={!isMobile}
            focus
          />
        </div>
      </ActiveQuoteProvider>
      <DiscoveryViewChanger />
    </PageWrapper>
  );
}
