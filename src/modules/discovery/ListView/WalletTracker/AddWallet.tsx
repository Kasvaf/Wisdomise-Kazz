import { notification } from 'antd';
import { isValidSolanaAddress } from 'api/chains/solana';
import { useLibrariesQuery } from 'api/library';
import { bxCheck, bxPlus } from 'boxicons-quasar';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useEffect, useState } from 'react';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import { Input } from 'shared/v1-components/Input';
import useIsMobile from 'utils/useIsMobile';
import libBg from './lib-bg.png';

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
        {activeTab === 'manual' && <AddWalletManually onClose={onClose} />}
        {activeTab === 'list' && <AddWalletLibrary onClose={onClose} />}
      </div>
    </Dialog>
  );
}

function AddWalletManually({ onClose }: { onClose: () => void }) {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🐐');
  const { upsertImportedWallet } = useUserSettings();
  const trackedWallets = useTrackedWallets();

  const addWallet = () => {
    if (!isValidSolanaAddress(address)) {
      notification.error({ message: 'Invalid wallet address' });
      return;
    }

    if (trackedWallets.map(w => w.address).includes(address)) {
      notification.error({ message: 'This wallet is already being tracked' });
      return;
    }

    upsertImportedWallet({ address, name, emoji });
    notification.success({ message: 'Wallet Added Successfully' });
    onClose();
  };

  return (
    <div className="flex grow flex-col text-xs">
      <div className="mb-1">Wallet Address</div>
      <Input
        className="mb-3 w-full"
        onChange={newValue => setAddress(newValue)}
        size="sm"
        type="string"
        value={address}
      />
      <div className="flex items-start gap-2">
        <ClickableTooltip
          chevron={false}
          title={
            <EmojiPicker
              height={400}
              onEmojiClick={data => setEmoji(data.emoji)}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled={true}
              theme={Theme.DARK}
            />
          }
        >
          <Button className="!text-lg mt-5" size="sm" variant="outline">
            {emoji}
          </Button>
        </ClickableTooltip>
        <div className="grow">
          <div className="mb-1">Wallet Name</div>
          <Input
            className="mb-3 w-full"
            onChange={newValue => setName(newValue)}
            size="sm"
            type="string"
            value={name}
          />
        </div>
      </div>
      <Button
        className="mt-auto w-full"
        disabled={!address || !name}
        onClick={addWallet}
      >
        Add Wallet
      </Button>
    </div>
  );
}

function AddWalletLibrary({ onClose }: { onClose: () => void }) {
  const { settings, updateSelectedLibs } = useUserSettings();
  const [selected, setSelected] = useState<string[]>([]);
  const { data: libs } = useLibrariesQuery();

  useEffect(() => {
    setSelected(settings.wallet_tracker.selected_libraries.map(l => l.key));
  }, [settings.wallet_tracker.selected_libraries]);

  const toggleLib = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? [...prev.filter(l => l !== key)] : [...prev, key],
    );
  };

  const save = () => {
    updateSelectedLibs(selected.map(s => ({ key: s })));
    onClose();
  };

  return (
    <div className="flex grow flex-col overflow-hidden">
      <div className="grid grow grid-cols-3 gap-3 overflow-auto border-white/10 border-y py-3">
        {libs?.results
          .filter(l => l.type === 'wallet')
          .map(lib => (
            <div
              className="relative flex h-60 flex-col rounded-xl bg-v1-surface-l2 p-3"
              key={lib.key}
            >
              <Button
                className="!absolute top-2 right-2 z-10"
                fab
                onClick={() => toggleLib(lib.key)}
                size="xs"
                surface={2}
                variant={selected.includes(lib.key) ? 'primary' : 'outline'}
              >
                <Icon name={selected.includes(lib.key) ? bxCheck : bxPlus} />
              </Button>
              <div className="relative">
                <img alt="" src={libBg} />
                <div className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 size-16 overflow-hidden rounded-xl border border-white/5 p-1">
                  <img
                    alt=""
                    className="size-full rounded-lg bg-v1-surface-l1"
                    src={lib.icon}
                  />
                </div>
              </div>
              <h2 className="mt-auto mb-1 text-sm">{lib.name}</h2>
              <p className="text-white/70 text-xs">{lib.description}</p>
            </div>
          ))}
      </div>
      <Button className="mt-3 w-full shrink-0" onClick={save}>
        Add
      </Button>
    </div>
  );
}
