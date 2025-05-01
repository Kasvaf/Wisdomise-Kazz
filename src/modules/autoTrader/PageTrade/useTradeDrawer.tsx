import { useCallback, useState } from 'react';
import { DrawerModal } from 'shared/DrawerModal';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { type TraderInputs } from './types';
import Trader from './Trader';

type DrawerInputs = Omit<TraderInputs, 'quote' | 'setQuote'>;

export default function useTradeDrawer() {
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState<DrawerInputs>();
  const [quote, setQuote] = useState('tether');

  const component = (
    <div onClick={e => e.stopPropagation()}>
      <DrawerModal
        open={open}
        onClose={useCallback(() => setOpen(false), [])}
        maskClosable={true}
        closeIcon={null}
        width={400}
      >
        {inputs && open && (
          <ActiveNetworkProvider base={inputs.slug} quote={quote}>
            <Trader
              quote={quote}
              setQuote={setQuote}
              {...inputs}
              loadingClassName="bg-v1-surface-l4"
            />
          </ActiveNetworkProvider>
        )}
      </DrawerModal>
    </div>
  );

  return [
    component,
    (inputs: DrawerInputs & { quote?: string }) => {
      setInputs(inputs);
      setOpen(true);
    },
  ] as const;
}
