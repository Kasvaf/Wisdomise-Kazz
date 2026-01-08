import { solana } from '@reown/appkit/networks';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitState,
  useDisconnect,
  useWalletInfo,
} from '@reown/appkit/react';
import { notification } from 'antd';
import { trackClick } from 'config/segment';
import { useActiveNetwork } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { usePromiseOfEffect } from '../chains/utils';
import { useWalletsQuery } from '../rest/wallets';

export const useConnectedWallet = () => {
  const net = useActiveNetwork();

  const { address: appKitAddress, isConnected: isAppKitConnected } =
    useAppKitAccount();
  const appKitWalletInfo = useWalletInfo();
  const { caipNetwork } = useAppKitNetwork();

  const chainNameSpace = caipNetwork?.chainNamespace;
  const isValidChain =
    chainNameSpace === (net === 'solana' ? 'solana' : 'eip155');

  const awaitSolanaWalletConnect = useAwaitSolanaWalletConnection(
    net === 'solana' ? net : undefined,
  );

  return {
    address: net === 'solana' ? appKitAddress : undefined,
    name: net === 'solana' ? appKitWalletInfo.walletInfo?.name : undefined,
    connected: net === 'solana' ? isAppKitConnected && isValidChain : false,
    icon: net === 'solana' ? appKitWalletInfo.walletInfo?.icon : undefined,
    network: net,

    connect: () => {
      trackClick('wallet_connect', { network: net })();
      if (net === 'solana') {
        return awaitSolanaWalletConnect();
      }
      return Promise.resolve();
    },
  };
};

export interface UserWallet {
  address?: string;
  network: string;
  key?: string;
  name?: string;
  icon?: string;
  isCustodial: boolean;
  isPrimary: boolean;
  isSelected: boolean;
  connected: boolean;
}

interface SelectedWallet {
  address: string;
  network: string;
}

export const useWallets = () => {
  const isLoggedIn = useIsLoggedIn();
  const { data: cWallets } = useWalletsQuery();
  const {
    address: connectedAddress,
    connected,
    network,
    icon,
    name,
  } = useConnectedWallet();

  const [isCustodial, setIsCustodial] = useLocalStorage('custodial', true);
  const [selected, setSelected] = useLocalStorage<SelectedWallet[]>(
    'selected-wallets',
    [],
  );

  const isSelected = useCallback(
    ({ address, network }: SelectedWallet) => {
      return (
        isCustodial &&
        selected.some(
          wallet => wallet.address === address && wallet.network === network,
        )
      );
    },
    [selected, isCustodial],
  );

  const custodialWallets = useMemo(() => {
    return (
      cWallets?.results.map((w, index) => ({
        address: w.address,
        network: w.network_slug,
        key: w.key,
        name: w.name,
        isCustodial: true,
        isPrimary: index === 0,
        isSelected: isSelected({ address: w.address, network: w.network_slug }),
        connected: true,
      })) ?? []
    );
  }, [cWallets, isSelected]);

  const connectedWallet = useMemo(
    () => ({
      address: connectedAddress,
      network: network,
      name: name ?? 'Connected Wallet',
      icon: icon,
      isCustodial: false,
      isPrimary: false,
      isSelected: !isCustodial,
      connected: connected,
    }),
    [connected, connectedAddress, network, isCustodial, icon, name],
  );

  const primaryWallet = useMemo(() => custodialWallets[0], [custodialWallets])!;

  const singleWallet = useMemo(
    () => (isCustodial ? primaryWallet : connectedWallet),
    [isCustodial, connectedWallet, primaryWallet],
  );

  const allWallets = useMemo(() => {
    return [...custodialWallets, connectedWallet];
  }, [custodialWallets, connectedWallet]);

  const selectedWallets = useMemo(
    () => allWallets.filter(w => w.isSelected),
    [allWallets],
  );

  const toggleWallet = ({ address, network }: SelectedWallet) => {
    const alreadySelected = selected.some(
      wallet => wallet.address === address && wallet.network === network,
    );
    if (alreadySelected) {
      deselectWallet({ address, network });
    } else {
      selectWallet({ address, network });
    }
  };

  const selectWallet = ({ address, network }: SelectedWallet) => {
    setSelected(prev => [...prev, { address, network }]);
  };

  const selectPrimaryWallet = () => {
    setIsCustodial(true);
    setSelected([
      {
        address: primaryWallet.address,
        network: primaryWallet.network,
      },
    ]);
  };

  const deselectWallet = ({ address, network }: SelectedWallet) => {
    if (selected.length === 1) {
      notification.error({ message: 'At least one wallet should be selected' });
      return;
    }

    const index = selected.findIndex(
      wallet => wallet.address === address && wallet.network === network,
    );
    if (index !== -1) {
      setSelected(prev => prev.toSpliced(index, 1));
    }
  };

  const selectAll = () => {
    setSelected(
      custodialWallets.map(w => ({ address: w.address!, network: w.network })),
    );
  };

  const deselectAll = () => {
    if (primaryWallet) {
      selectPrimaryWallet();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <selected>
  useEffect(() => {
    if (isLoggedIn) {
      if (selected.length === 0 && primaryWallet) {
        setSelected([{ address: primaryWallet.address, network: 'solana' }]);
      }
    } else {
      setSelected([]);
    }
  }, [setSelected, isLoggedIn, primaryWallet]);

  return {
    custodialWallets,
    connectedWallet,
    allWallets,
    selectedWallets,
    primaryWallet,
    singleWallet,
    isCustodial,
    setIsCustodial,
    toggleWallet,
    selectAll,
    selectPrimaryWallet,
    enableSelectAll: selectedWallets.length !== custodialWallets.length,
    deselectAll,
  };
};

export const useWalletsAddresses = () => {
  const { allWallets } = useWallets();

  return useMemo(
    () => allWallets?.map(w => w.address).filter(Boolean) ?? [],
    [allWallets],
  ) as string[];
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

export const useDisconnectWallet = () => {
  const { disconnect } = useDisconnect();

  return async () => {
    try {
      await disconnect();
    } catch {
    } finally {
      for (const key of Object.keys(localStorage)) {
        if (/^(wallet|@appkit|binance|ethereum)/.test(key)) {
          localStorage.removeItem(key);
        }
      }
    }
  };
};
