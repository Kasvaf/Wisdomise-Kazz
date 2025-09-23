import { useLastPriceStream } from 'api';
import {
  type CoinNetwork,
  useCoinDetails,
  useDetailedCoins,
} from 'api/discovery';
import { useGrpc } from 'api/grpc-v2';
import type {
  DevData,
  RiskData,
  SymbolSocailAddresses,
  ValidationData,
} from 'api/proto/network_radar';
import { useSymbolInfo } from 'api/symbol';
import type { Coin } from 'api/types/shared';
import { doesNCoinHaveSafeTopHolders } from 'modules/discovery/ListView/NetworkRadar/lib';
import { createContext, type FC, type ReactNode, useContext } from 'react';
import { getGlobalNetwork, useGlobalNetwork } from 'shared/useGlobalNetwork';

export type ComplexSlug = {
  slug: string;
  network: string;
  contractAddress?: string;
};

export const useResolveComplexSlug = (slugs: string[]): ComplexSlug | null => {
  const [globalNetwork] = useGlobalNetwork();
  const isSlug = slugs.length === 1;
  const isNetworkCa = slugs.length === 2;
  const searchResult = useDetailedCoins({
    network: isNetworkCa ? slugs[0] : undefined,
    query: isNetworkCa ? slugs[1] : undefined,
  });
  const slug = isSlug
    ? (slugs[0] as string)
    : searchResult.data?.[0]?.symbol.slug ||
      (isNetworkCa ? slugs.join('_') : undefined);
  const symbolInfo = useSymbolInfo({ slug });
  const network = isSlug ? globalNetwork : isNetworkCa ? slugs[0] : undefined;
  const contractAddress = isSlug
    ? symbolInfo.data?.networks.find(x => x.network.slug === network)
        ?.contract_address || undefined
    : isNetworkCa
      ? slugs[1]
      : undefined;
  if (!slug || !network) return null;
  return {
    contractAddress,
    network,
    slug,
  };
};

export const generateTokenLink = (coinNetworks: CoinNetwork[]) => {
  const globalNetwork = getGlobalNetwork();
  return [
    '/token',
    globalNetwork,
    coinNetworks.find(x => x.network.slug === globalNetwork)?.contract_address,
  ]
    .filter(x => !!x)
    .join('/');
};

export type UnifiedRisks = {
  level: 'low' | 'medium' | 'high';
  list: {
    name?: string | undefined;
    description?: string | undefined;
    level?: 'danger' | 'warn' | undefined;
    score?: number | undefined;
    value?: string | undefined;
  }[];
  percentage: number;
};

export type RugCheckSecurity = {
  freezable: boolean;
  lpBurned: boolean;
  mintable: boolean;
  safeTopHolders: boolean;
  rugged: boolean;
};

export type UnifiedCoinDetailsContext = {
  symbol: {
    slug: string;
    network: string | null;
    abbreviation: string | null;
    name: string | null;
    contractAddress: string | null;
    logo: string | null;
    categories: NonNullable<Coin['categories']>;
    labels: string[];
    description: string | null;
  };
  socials: SymbolSocailAddresses | null;
  marketData: {
    currentPrice: number | null;
    totalSupply: number | null;
    marketCap: number | null;
    totalVolume: number | null;
    volume24h: number | null;
    boundingCurve: number | null;
    totalNumBuys24h: number | null;
    totalNumSells24h: number | null;
  };
  validatedData: ValidationData | null;
  risks: RiskData | null;
  securityData: RugCheckSecurity | null;
  createdAt: string | null;
  developer: DevData | null;
  isInitiating: boolean;
};

const unifiedCoinDetailsContext = createContext<UnifiedCoinDetailsContext>({
  symbol: {
    slug: '',
    network: null,
    abbreviation: null,
    name: null,
    contractAddress: null,
    logo: null,
    categories: [],
    labels: [],
    description: null,
  },
  socials: null,
  marketData: {
    currentPrice: null,
    totalSupply: null,
    marketCap: null,
    totalVolume: null,
    volume24h: null,
    boundingCurve: null,
    totalNumBuys24h: null,
    totalNumSells24h: null,
  },
  validatedData: null,
  risks: null,
  securityData: null,
  createdAt: null,
  developer: null,
  isInitiating: true,
});

export const UnifiedCoinDetailsProvider: FC<{
  children?: ReactNode;
  slug: ComplexSlug;
}> = ({ children, slug }) => {
  const resp1 = useCoinDetails({ slug: slug.slug });
  const resp2 = useGrpc({
    service: 'network_radar',
    method: 'coinDetailStream',
    payload: {
      network: slug.network,
      base: slug.contractAddress,
    },
    enabled: !!slug.network && !!slug.contractAddress,
    history: 0,
  });
  const priceResp = useLastPriceStream({
    slug: slug.slug,
    quote: 'wrapped-solana',
    convertToUsd: true,
  });
  const data1 = resp1.data;
  const data2 = slug.contractAddress ? resp2.data : null;
  const price = priceResp.data;

  const symbol: UnifiedCoinDetailsContext['symbol'] = (() => {
    return {
      slug: slug.slug,
      abbreviation: data2?.symbol?.abbreviation ?? '',
      name: data2?.symbol?.name ?? '',
      categories: data1?.symbol.categories ?? [],
      labels: data1?.symbol_labels ?? [],
      contractAddress: slug.contractAddress ?? null,
      logo: data2?.symbol?.imageUrl ?? null,
      network: slug.network,
      description:
        data2?.symbol?.description ??
        data1?.community_data?.description ??
        null,
    };
  })();

  const socials: UnifiedCoinDetailsContext['socials'] = data2?.socials ?? null;

  const marketData: UnifiedCoinDetailsContext['marketData'] = (() => {
    const currentPrice = price ?? null;

    const totalSupply =
      (data2?.networkData?.totalSupply
        ? +data2?.networkData?.totalSupply
        : null) ?? null;

    const marketCap =
      typeof currentPrice === 'number' && typeof totalSupply === 'number'
        ? currentPrice * totalSupply
        : null;

    const totalVolume = data2?.networkData?.volume
      ? +data2?.networkData?.volume
      : null;

    const totalNumBuys24h = data2?.networkData?.totalBuy ?? null;
    const totalNumSells24h = data2?.networkData?.totalSell ?? null;

    const volume24h = data2?.networkData?.volume24
      ? +data2?.networkData?.volume24
      : null;

    const boundingCurve = data2?.networkData?.boundingCurve ?? null;

    return {
      currentPrice,
      totalSupply,
      marketCap,
      totalVolume,
      volume24h,
      boundingCurve,
      totalNumBuys24h,
      totalNumSells24h,
    };
  })();

  const validatedData: UnifiedCoinDetailsContext['validatedData'] =
    data2?.validatedData ?? null;

  const risks: UnifiedCoinDetailsContext['risks'] = data2?.riskData ?? null;

  const securityData: UnifiedCoinDetailsContext['securityData'] = (() => {
    if (typeof data2?.securityData?.freezable !== 'boolean') return null;
    return {
      freezable: data2?.securityData?.freezable,
      lpBurned: data2?.securityData?.lpBurned,
      mintable: data2?.securityData?.mintable,
      safeTopHolders: doesNCoinHaveSafeTopHolders({
        topHolders: data2?.validatedData?.top10Holding ?? 0,
        totalSupply: marketData.totalSupply ?? 0,
      }),
      rugged: data2?.securityData.rugged,
    };
  })();
  const createdAt: UnifiedCoinDetailsContext['createdAt'] =
    data2?.symbol?.createdAt ?? null;

  const developer: UnifiedCoinDetailsContext['developer'] =
    data2?.devData ?? null;

  return (
    <unifiedCoinDetailsContext.Provider
      value={{
        symbol,
        marketData,
        validatedData,
        socials,
        risks,
        securityData,
        createdAt,
        developer,
        isInitiating:
          !data2?.symbol?.abbreviation && !resp1.data?.symbol.abbreviation,
      }}
    >
      {children}
    </unifiedCoinDetailsContext.Provider>
  );
};

export const useUnifiedCoinDetails = () =>
  useContext(unifiedCoinDetailsContext);
