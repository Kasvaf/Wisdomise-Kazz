import { ActiveQuoteProvider } from 'modules/autoTrader/useActiveQuote';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import type { LISTS } from './constants';
import { DiscoveryViewChanger } from './DiscoveryViewChanger';
import { ListView } from './ListView';
import { useDiscoveryActiveParams } from './lib';

// only full page list view
export default function PageDiscoveryListView() {
  const activeyParams = useDiscoveryActiveParams();
  const list = activeyParams?.[0] as keyof typeof LISTS | undefined;
  if (!list) throw new Error('unexpected');

  const isMobile = useIsMobile();

  return (
    <PageWrapper
      extension={<CoinExtensionsGroup />}
      mainClassName="!p-0 h-full"
    >
      <ActiveQuoteProvider>
        <ListView
          className="w-full max-w-full"
          expanded={!isMobile}
          focus
          list={list}
        />
      </ActiveQuoteProvider>
      <DiscoveryViewChanger />
    </PageWrapper>
  );
}
