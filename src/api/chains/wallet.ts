import { solana } from '@reown/appkit/networks';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitState,
  useDisconnect,
  useWalletInfo,
} from '@reown/appkit/react';
import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { usePromiseOfEffect } from 'api/chains/utils';
import { useWalletsQuery } from 'api/wallets';
import { trackClick } from 'config/segment';
import { useActiveNetwork } from 'modules/base/active-network';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export const useConnectedWallet = () => {
  const net = useActiveNetwork();

  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const { address: appKitAddress, isConnected: isAppKitConnected } =
    useAppKitAccount();
  const appKitWalletInfo = useWalletInfo();
  const { caipNetwork } = useAppKitNetwork();

  const chainNameSpace = caipNetwork?.chainNamespace;
  const isValidChain =
    chainNameSpace === (net === 'solana' ? 'solana' : 'eip155');

  const awaitSolanaWalletConnect = useAwaitSolanaWalletConnection(
    net === 'the-open-network' ? undefined : net,
  );
  const awaitTonWalletConnect = useAwaitTonWalletConnection();

  return {
    address:
      net === 'the-open-network'
        ? tonAddress
        : net === 'solana' || net === 'polygon'
          ? appKitAddress
          : undefined,
    name:
      net === 'the-open-network'
        ? tonConnectUI.wallet?.device.appName
        : net === 'solana' || net === 'polygon'
          ? appKitWalletInfo.walletInfo?.name
          : undefined,
    connected:
      net === 'the-open-network'
        ? tonConnectUI.connected
        : net === 'solana' || net === 'polygon'
          ? isAppKitConnected && isValidChain
          : false,
    icon:
      net === 'solana' || net === 'polygon'
        ? appKitWalletInfo.walletInfo?.icon
        : undefined,

    connect: () => {
      trackClick('wallet_connect', { network: net })();
      if (net === 'the-open-network') {
        return awaitTonWalletConnect();
      }
      if (net === 'solana' || net === 'polygon') {
        return awaitSolanaWalletConnect();
      }
      return Promise.resolve();
    },
  };
};

export const useCustodialWallet = () => {
  const { data: wallets } = useWalletsQuery();
  const [cwKey, setCw] = useLocalStorage<string | undefined>(
    'custodial-key',
    undefined,
  );
  const cw = wallets?.results.find(w => w.key === cwKey);

  const delCw = () => {
    localStorage.removeItem('custodial-key');
  };

  useEffect(() => {
    if (cwKey === undefined && wallets?.results.length !== 0) {
      setCw(wallets?.results[0]?.key);
    }
  }, [cwKey, setCw, wallets]);

  return { cw, setCw, delCw };
};

export const useActiveWallet = () => {
  const { address, name, connected, connect } = useConnectedWallet();
  const net = useActiveNetwork();
  const { cw } = useCustodialWallet();
  const custodialSupported = cw && net === 'solana';

  return {
    address: custodialSupported ? cw.address : address,
    name: custodialSupported ? cw.name : name,
    connected: custodialSupported ? true : connected,
    isCustodial: custodialSupported,
    connect,
  };
};

export const useAllWallets = () => {
  const { data } = useWalletsQuery();
  const { address, connected } = useConnectedWallet();

  return useMemo(
    () => [
      ...(data?.results?.map(w => w.address) ?? []),
      ...(address && connected ? [address] : []),
    ],
    [data, address, connected],
  );
};

function useAwaitSolanaWalletConnection(net: 'solana' | 'polygon' = 'solana') {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { open: isOpen } = useAppKitState();
  const { caipNetwork, switchNetwork } = useAppKitNetwork();
  const chain = net === 'solana' ? 'solana' : 'eip155';
  const isValidChain = caipNetwork?.chainNamespace === chain;

  return usePromiseOfEffect({
    action: useCallback(async () => {
      if (isConnected && !isValidChain) {
        switchNetwork(solana);
      }

      if (!isConnected) {
        await open({
          view: 'Connect',
          namespace: chain,
        });
      }
    }, [chain, isConnected, isValidChain, open, switchNetwork]),
    done: isConnected || !isOpen,
    result: isConnected && isValidChain,
  });
}

function useAwaitTonWalletConnection() {
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();

  return usePromiseOfEffect({
    action: open,
    done: tonConnectUI.connected || tonConnectUI.modalState.status === 'closed',
    result: tonConnectUI.connected,
  });
}

export const useDisconnectAll = () => {
  const [{ disconnect: tonDisconnect }] = useTonConnectUI();
  const { disconnect } = useDisconnect();

  return async () => {
    try {
      await Promise.all([disconnect(), tonDisconnect()]);
    } catch {
    } finally {
      for (const key of Object.keys(localStorage)) {
        if (/^(wallet|ton|@appkit|binance|ethereum)/.test(key)) {
          localStorage.removeItem(key);
        }
      }
    }
  };
};
