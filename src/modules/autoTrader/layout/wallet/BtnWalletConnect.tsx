import { TonConnectButton } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useActiveNetwork from 'modules/autoTrader/layout/useActiveNetwork';
import Button from 'shared/Button';
import '@solana/wallet-adapter-react-ui/styles.css';

const BtnSolanaWalletConnect = () => {
  const { setVisible } = useWalletModal();
  const solanaWallet = useWallet();
  const addr = solanaWallet.publicKey?.toString() || '';

  return (
    <Button
      variant={solanaWallet.connected ? 'alternative' : 'brand'}
      className="h-10 rounded-[20px] !px-5 !py-0"
      onClick={() => setVisible(true)}
    >
      {solanaWallet.connected ? (
        <>
          <img
            src={solanaWallet.wallet?.adapter.icon}
            className="mr-2 size-6"
          />
          {addr.substring(0, 4) + '...' + addr.substr(-4)}
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};

const BtnWalletConnect: React.FC = () => {
  const net = useActiveNetwork();
  return net === 'the-open-network' ? (
    <TonConnectButton />
  ) : net === 'solana' ? (
    <BtnSolanaWalletConnect />
  ) : (
    <div />
  );
};

export default BtnWalletConnect;
