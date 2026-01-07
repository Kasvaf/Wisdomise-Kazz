import { ActiveQuoteProvider } from 'modules/autoTrader/useActiveQuote';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { Draggable } from 'shared/v1-components/Draggable';
import useIsMobile from 'utils/useIsMobile';
import { LIST_NAMES } from './constants';
import { DetailView } from './DetailView';
import { ListView } from './ListView';
import { useDiscoveryListPopups, useDiscoveryUrlParams } from './lib';

export default function PageDiscovery() {
  const [popups, togglePopup] = useDiscoveryListPopups();
  const urlParams = useDiscoveryUrlParams();
  const isMobile = useIsMobile();

  return (
    <PageWrapper
      extension={<CoinExtensionsGroup />}
      mainClassName="!p-0 h-full"
    >
      <ActiveQuoteProvider>
        {/* Desktop Popups */}
        {!isMobile &&
          popups.map(popup => (
            <Draggable
              closable
              header={LIST_NAMES[popup.list]}
              id={`discovery-popup-${popup.list}`}
              key={popup.list}
              onClose={() => togglePopup(popup)}
              surface={1}
            >
              <ListView
                className="scrollbar-none h-[580px] w-[380px] overflow-auto bg-v1-surface-l0"
                expanded={false}
                focus={false}
                list={popup.list}
              />
            </Draggable>
          ))}

        <div className="flex justify-start">
          {/* List Full-Page Mode */}
          {urlParams.list && (
            <ListView
              className="w-full max-w-full"
              expanded={!isMobile}
              focus
              list={urlParams.list ?? 'trench'}
            />
          )}

          {/* Detail FullPage Mode */}
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
    </PageWrapper>
  );
}
