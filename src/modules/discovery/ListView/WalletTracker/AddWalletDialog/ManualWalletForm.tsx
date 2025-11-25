import { notification } from 'antd';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useState } from 'react';
import { isValidSolanaAddress } from 'services/chains/solana';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { useTrackedWallets } from '../useTrackedWallets';

export function ManualWalletForm({ onClose }: { onClose: () => void }) {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🐐');
  const { upsertImportedWallet } = useUserSettings();
  const trackedWallets = useTrackedWallets();
  const isLoggedIn = useIsLoggedIn();
  const [modal, open] = useModalLogin();

  const addWallet = () => {
    if (!isLoggedIn) {
      open();
      return;
    }

    if (!isValidSolanaAddress(address)) {
      notification.error({ message: 'Invalid wallet address' });
      return;
    }

    const alreadyTracked = trackedWallets.map(w => w.address).includes(address);
    if (alreadyTracked) {
      notification.error({ message: 'This wallet is already being tracked' });
      return;
    }

    upsertImportedWallet({ address, name, emoji });
    notification.success({ message: 'Wallet Added Successfully' });
    onClose();
  };

  return (
    <div className="flex grow flex-col text-xs">
      <h2 className="mb-2">Wallet Address</h2>
      <Input
        className="mb-5 w-full"
        onChange={newValue => setAddress(newValue)}
        size="sm"
        type="string"
        value={address}
      />
      <div>
        <h2 className="mb-2">Wallet Name</h2>
        <Input
          className="mb-5 w-full"
          onChange={newValue => setName(newValue)}
          size="sm"
          type="string"
          value={name}
        />
      </div>
      <div>
        <h2 className="mb-2">Emoji</h2>
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
          <Button className="!text-lg" size="sm" variant="outline">
            {emoji}
          </Button>
        </ClickableTooltip>
      </div>
      <Button
        className="mt-auto w-full"
        disabled={!address || !name}
        onClick={addWallet}
      >
        Add Wallet
      </Button>
      {modal}
    </div>
  );
}
