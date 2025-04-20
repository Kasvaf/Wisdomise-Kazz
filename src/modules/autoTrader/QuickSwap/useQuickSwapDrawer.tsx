import { useCallback, useState } from 'react';
import { DrawerModal } from 'shared/DrawerModal';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { type QuickSwapInputs } from './types';
import QuickSwapForm from './QuickSwapForm';

type DrawerInputs = Omit<QuickSwapInputs, 'quote' | 'setQuote'>;

export default function useQuickSwapDrawer() {
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState<DrawerInputs>();
  const [quote, setQuote] = useState<AutoTraderSupportedQuotes>('tether');

  const component = (
    <div onClick={e => e.stopPropagation()}>
      <DrawerModal
        open={open}
        onClose={useCallback(() => setOpen(false), [])}
        maskClosable={true}
        closeIcon={null}
        width={400}
        title="Quick Swap"
      >
        {inputs && open && (
          <ActiveNetworkProvider base={inputs.slug} quote={quote}>
            <QuickSwapForm quote={quote} setQuote={setQuote} {...inputs} />
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
