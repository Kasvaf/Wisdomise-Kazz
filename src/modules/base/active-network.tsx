import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { type SupportedNetworks, useSupportedNetworks } from 'api/trader';
import { isMiniApp } from 'utils/version';

const ActiveNetworkContext = createContext<SupportedNetworks | undefined>(
  undefined,
);
const LayoutActiveNetworkContext = createContext<
  | {
      setNetwork: (net: SupportedNetworks) => void;
      unsetNetwork: () => void;
    }
  | undefined
>(undefined);

export const useActiveNetwork = () => {
  return (
    useContext(ActiveNetworkContext) ??
    (isMiniApp ? 'the-open-network' : 'solana')
  );
};

export const ActiveNetworkProvider: React.FC<
  PropsWithChildren<{
    network?: SupportedNetworks;
    base?: string;
    quote?: string;
    setOnLayout?: boolean;
  }>
> = ({ network, base, quote, setOnLayout, children }) => {
  const supportedNet = useSupportedNetworks(base, quote)?.[0];
  const activeNet = network ?? supportedNet;

  const layoutNet = useContext(LayoutActiveNetworkContext);
  useEffect(() => {
    if (activeNet && setOnLayout) {
      layoutNet?.setNetwork(activeNet);
      return () => layoutNet?.unsetNetwork();
    }
  }, [activeNet, layoutNet, setOnLayout]);

  return (
    <ActiveNetworkContext.Provider value={activeNet}>
      {children}
    </ActiveNetworkContext.Provider>
  );
};

// an active-network provided inside page, should be available outside in whole layout
export const LayoutActiveNetworkProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [activeNetworks, setActiveNetworks] = useState<SupportedNetworks[]>([]);
  const ctx = useMemo(
    () => ({
      setNetwork: (net: SupportedNetworks) =>
        setActiveNetworks(x => [...x, net]),
      unsetNetwork: () => setActiveNetworks(x => x.slice(0, -1)),
    }),
    [],
  );

  return (
    <LayoutActiveNetworkContext.Provider value={ctx}>
      <ActiveNetworkProvider
        network={activeNetworks[activeNetworks.length - 1]}
      >
        {children}
      </ActiveNetworkProvider>
    </LayoutActiveNetworkContext.Provider>
  );
};
