import { useState } from 'react';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import { ManualWalletForm } from './ManualWalletForm';
import { WalletLibrarySelection } from './WalletLibrarySelection';

export default function AddWalletDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'list' | 'manual'>('list');

  return (
    <Dialog
      contentClassName="p-3 md:w-[35rem] md:h-[40rem]"
      mode={isMobile ? 'drawer' : 'modal'}
      onClose={onClose}
      open={open}
    >
      <div className="flex h-full flex-col">
        <h1 className="mt-3 mb-5 text-lg">Wallet Library</h1>
        <ButtonSelect
          className="mb-5 shrink-0"
          onChange={value => setActiveTab(value)}
          options={
            [
              { label: 'Choose a List', value: 'list' },
              { label: 'Add Manually', value: 'manual' },
            ] as const
          }
          size="sm"
          value={activeTab}
          variant="white"
        />
        {activeTab === 'manual' && <ManualWalletForm onClose={onClose} />}
        {activeTab === 'list' && <WalletLibrarySelection onClose={onClose} />}
      </div>
    </Dialog>
  );
}
