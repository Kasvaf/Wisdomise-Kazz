import { useCallback, useState } from 'react';
import { DrawerModal } from 'shared/DrawerModal';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import QuickSwapForm from './QuickSwapForm';
import useSwapState from './useSwapState';

export default function useQuickSwapDrawer() {
  const [open, setOpen] = useState(false);
  const state = useSwapState();

  const component = (
    <div onClick={e => e.stopPropagation()}>
      <DrawerModal
        open={open}
        onClose={useCallback(() => setOpen(false), [])}
        maskClosable={true}
        closeIcon={null}
        width={400}
        title={state.dir === 'buy' ? 'Quick Buy' : 'Quick Sell'}
      >
        {state.base && open && (
          <ActiveNetworkProvider base={state.base} quote={state.quote}>
            <QuickSwapForm state={state} />
          </ActiveNetworkProvider>
        )}
      </DrawerModal>
    </div>
  );

  return [
    component,
    ({ slug }: { slug: string }) => {
      state.setBase(slug);
      setOpen(true);
    },
  ] as const;
}
