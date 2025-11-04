import { LibrarySelection } from 'modules/discovery/ListView/WalletTracker/AddWalletDialog/LibrarySelection';
import { AddFromList } from 'modules/discovery/ListView/XTracker/BtnAddHandle/AddFromList';
import { useState } from 'react';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';

export default function BtnAddHandle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="ml-3 w-max shrink-0"
        onClick={() => setOpen(true)}
        size="md"
        variant="outline"
      >
        Add Handles
      </Button>
      <AddHandleDialog onClose={() => setOpen(false)} open={open} />
    </>
  );
}

function AddHandleDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'lib' | 'list' | 'manual'>('lib');

  return (
    <Dialog
      contentClassName="p-3 md:w-[35rem] md:h-[40rem]"
      mode={isMobile ? 'drawer' : 'modal'}
      onClose={onClose}
      open={open}
    >
      <div className="flex h-full flex-col">
        <h1 className="mt-3 mb-5 text-lg">X Tracker Library</h1>
        <ButtonSelect
          className="mb-5 shrink-0"
          onChange={value => setActiveTab(value)}
          options={
            [
              { label: 'Choose a List', value: 'lib' },
              { label: 'Add From List', value: 'list' },
            ] as const
          }
          size="sm"
          value={activeTab}
          variant="white"
        />
        {activeTab === 'lib' && (
          <LibrarySelection onClose={onClose} type="x-account" />
        )}
        {activeTab === 'list' && <AddFromList onClose={onClose} />}
      </div>
    </Dialog>
  );
}
