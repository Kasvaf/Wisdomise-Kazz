import { useLastPriceQuery } from 'api';
import {
  type CoinChart,
  type CoinCommunityData,
  type NCoinDeveloper,
  type NetworkSecurity,
  useCoinDetails,
  useDetailedCoins,
  useNCoinDetails,
} from 'api/discovery';
import { networkRadarGrpc } from 'api/grpc';
import type { ValidationData } from 'api/proto/network_radar';
import { useSymbolInfo } from 'api/symbol';
import type { Coin } from 'api/types/shared';
import {
  calcNCoinRiskLevel,
  doesNCoinHaveSafeTopHolders,
} from 'modules/discovery/ListView/NetworkRadar/lib';
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';

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
  const symbolInfo = useSymbolInfo(slug);
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
  };
  marketData: {
    currentPrice: number | null;
    totalSupply: number | null;
    marketCap: number | null;
    totalVolume: number | null;
    tradingVolume: number | null;
    boundingCurve: number | null;
    totalBuy: number | null;
    totalSell: number | null;
    totalNumBuys: number | null;
    totalNumSells: number | null;
  };
  validatedData: ValidationData | null;
  charts: CoinChart[];
  communityData: CoinCommunityData;
  risks: UnifiedRisks | null;
  goPlusSecurity: NetworkSecurity[];
  rugCheckSecurity: RugCheckSecurity | null;
  createdAt: string | null;
  developer: NCoinDeveloper | null;
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
  },
  marketData: {
    currentPrice: null,
    boundingCurve: null,
    marketCap: null,
    totalSupply: null,
    totalVolume: null,
    tradingVolume: null,
    totalBuy: null,
    totalSell: null,
    totalNumBuys: null,
    totalNumSells: null,
  },
  validatedData: null,
  charts: [],
  communityData: {},
  risks: null,
  goPlusSecurity: [],
  rugCheckSecurity: null,
  createdAt: null,
  developer: null,
  isInitiating: true,
});

export const UnifiedCoinDetailsProvider: FC<{
  children?: ReactNode;
  slug: ComplexSlug;
}> = ({ children, slug }) => {
  const resp1 = useCoinDetails({ slug: slug.slug });
  const resp2 = useNCoinDetails({ slug: slug.slug });
  const resp3 = networkRadarGrpc.useCoinDetailStreamLastValue({
    network: slug.network,
    base: slug.contractAddress,
  });
  const priceResp = useLastPriceQuery({
    slug: slug.slug,
    quote: 'wrapped-solana',
    convertToUsd: true,
  });
  const data1 = resp1.data;
  const data2 = resp2.data;
  const data3 = slug.contractAddress ? resp3.data : null;
  const price = priceResp.data;

  const symbol = useMemo<UnifiedCoinDetailsContext['symbol']>(() => {
    return {
      slug: slug.slug,
      abbreviation: data3?.symbol?.abbreviation ?? '',
      name: data3?.symbol?.name ?? '',
      categories: data2?.base_symbol?.categories ?? [],
      labels: data2?.base_symbol_labels ?? [],
      contractAddress: slug.contractAddress ?? null,
      logo: data3?.symbol?.imageUrl ?? null,
      network: slug.network,
    };
  }, [
    slug.slug,
    slug.contractAddress,
    slug.network,
    data3?.symbol?.abbreviation,
    data3?.symbol?.name,
    data3?.symbol?.imageUrl,
    data2?.base_symbol.categories,
    data2?.base_symbol_labels,
  ]);

  const marketData = useMemo<UnifiedCoinDetailsContext['marketData']>(() => {
    const currentPrice = price ?? null;

    const totalSupply =
      (data3?.networkData?.totalSupply
        ? +data3?.networkData?.totalSupply
        : null) ??
      data2?.update.base_market_data.total_supply ??
      data1?.data?.total_supply ??
      null;

    const marketCap =
      typeof currentPrice === 'number' && typeof totalSupply === 'number'
        ? currentPrice * totalSupply
        : null;

    const totalVolume = data3?.networkData?.volume
      ? +data3?.networkData?.volume
      : null;

    const totalBuy = data3?.networkData?.totalBuy ?? null;
    const totalSell = data3?.networkData?.totalSell ?? null;
    const tradingVolume =
      typeof totalBuy === 'number' || typeof totalSell === 'number'
        ? (totalBuy ?? 0) + (totalSell ?? 0)
        : null;

    const totalNumBuys = data2?.update.total_num_buys ?? null;
    const totalNumSells = data2?.update.total_num_sells ?? null;

    const boundingCurve = data3?.networkData?.boundingCurve ?? null;

    return {
      currentPrice,
      totalSupply,
      marketCap,
      totalVolume,
      tradingVolume,
      boundingCurve,
      totalBuy,
      totalSell,
      totalNumBuys,
      totalNumSells,
    };
  }, [
    price,
    data3?.networkData?.totalSupply,
    data2?.update.base_market_data.total_supply,
    data1?.data?.total_supply,
    data3?.networkData?.volume,
    data3?.networkData?.totalBuy,
    data3?.networkData?.totalSell,
    data2?.update.total_num_buys,
    data2?.update.total_num_sells,
    data3?.networkData?.boundingCurve,
  ]);

  const validatedData: UnifiedCoinDetailsContext['validatedData'] =
    data3?.validatedData ?? null;

  const charts = useMemo<UnifiedCoinDetailsContext['charts']>(() => {
    return [...(data2?.charts ?? []), ...(data1?.charts ?? [])].filter(
      (x, i, s) => s.findIndex(y => y.id === x.id) === i,
    );
  }, [data2?.charts, data1?.charts]);

  const communityData: UnifiedCoinDetailsContext['communityData'] = (() => {
    return (
      (data3
        ? {
            telegram_channel_identifier: data3.socials?.telegram,
            twitter_screen_name: data3.socials?.twitter,
            homepage: data3.socials?.website ? [data3.socials?.website] : [],
            description: data3.symbol?.description,
          }
        : null) ??
      data2?.base_community_data ??
      data1?.community_data ??
      {}
    );
  })();

  const risks = useMemo<UnifiedCoinDetailsContext['risks']>(() => {
    return data2?.risks && data2?.risk_percent
      ? {
          level: calcNCoinRiskLevel({
            riskPercent: data2?.risk_percent ?? 0,
          }),
          list: data2.risks ?? [],
          percentage: data2.risk_percent ?? 0,
        }
      : null;
  }, [data2?.risk_percent, data2?.risks]);

  const goPlusSecurity: UnifiedCoinDetailsContext['goPlusSecurity'] = (() => {
    return data1?.security_data
      ? data1.security_data.map(x => x.symbol_security)
      : [];
  })();
  const rugCheckSecurity = useMemo<
    UnifiedCoinDetailsContext['rugCheckSecurity']
  >(() => {
    if (typeof data3?.securityData?.freezable !== 'boolean') return null;
    return {
      freezable: data3?.securityData?.freezable,
      lpBurned: data3?.securityData?.lpBurned,
      mintable: data3?.securityData?.mintable,
      safeTopHolders: doesNCoinHaveSafeTopHolders({
        topHolders: data3?.validatedData?.top10Holding ?? 0,
        totalSupply: marketData.totalSupply ?? 0,
      }),
      rugged: data2?.rugged ?? false,
    };
  }, [
    data3?.securityData?.freezable,
    data3?.securityData?.lpBurned,
    data3?.securityData?.mintable,
    data3?.validatedData?.top10Holding,
    marketData.totalSupply,
    data2?.rugged,
  ]);

  const createdAt: UnifiedCoinDetailsContext['createdAt'] = (() => {
    return data2?.creation_datetime ?? null;
  })();

  const developer: UnifiedCoinDetailsContext['developer'] = (() => {
    return data2?.dev ?? null;
  })();

  return (
    <unifiedCoinDetailsContext.Provider
      value={{
        symbol,
        marketData,
        validatedData,
        charts,
        communityData,
        risks,
        goPlusSecurity,
        rugCheckSecurity,
        createdAt,
        developer,
        isInitiating:
          !data3?.symbol?.abbreviation || resp2.isLoading || resp1.isLoading,
      }}
    >
      {children}
    </unifiedCoinDetailsContext.Provider>
  );
};

export const useUnifiedCoinDetails = () =>
  useContext(unifiedCoinDetailsContext);
