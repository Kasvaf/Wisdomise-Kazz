import { TonConnectButton } from '@tonconnect/ui-react';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMatches, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useSupportedPairs } from 'api';
import useSearchParamAsState from 'shared/useSearchParamAsState';

const BtnWalletConnect: React.FC = () => {
  const { slug: baseSlug } = useParams<{ slug: string }>();
  const [quote] = useSearchParamAsState('quote', 'tether');
  const pageNeedsWallet =
    useMatches().some(x => (x.handle as any)?.wallet) && !!baseSlug;
  const { data: supportedPairs } = useSupportedPairs(
    pageNeedsWallet ? baseSlug : undefined,
  );

  const pair = useMemo(
    () => supportedPairs?.find(x => x.quote.slug === quote),
    [quote, supportedPairs],
  );

  const solanaWallet = useWallet();

  return !pair?.network_slugs ||
    pair.network_slugs.includes('the-open-network') ? (
    <TonConnectButton />
  ) : pair?.network_slugs?.includes('solana') ? (
    <WalletMultiButton
      style={{
        borderRadius: 20,
        height: 40,
        fontSize: 14,
        ...(solanaWallet.connected ? {} : { background: '#00a3ff' }),
      }}
    >
      {solanaWallet.connected ? 'Solana Wallet' : 'Connect Wallet'}
    </WalletMultiButton>
  ) : (
    <div />
  );
};

export default BtnWalletConnect;
