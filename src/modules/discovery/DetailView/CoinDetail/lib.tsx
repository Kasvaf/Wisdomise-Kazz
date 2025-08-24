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
  convertNCoinSecurityFieldToBool,
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

  const value = useMemo<UnifiedCoinDetailsContext>(() => {
    const symbol: UnifiedCoinDetailsContext['symbol'] = (() => {
      return {
        slug: slug.slug,
        abbreviation:
          data3?.symbol?.abbreviation ??
          data2?.base_symbol?.abbreviation ??
          data1?.symbol?.abbreviation ??
          'Loading...',
        name:
          data3?.symbol?.name ??
          data2?.base_symbol?.name ??
          data1?.symbol?.name ??
          '',
        logo_url:
          data3?.symbol?.imageUrl ??
          data2?.base_symbol?.logo_url ??
          data1?.symbol?.logo_url ??
          null,
        categories:
          data2?.base_symbol?.categories ?? data1?.symbol?.categories ?? [],
        labels: data2?.base_symbol_labels ?? data1?.symbol_labels ?? [],
        contractAddress: slug.contractAddress ?? null,
        logo: data2?.base_symbol.logo_url ?? data1?.symbol.logo_url ?? null,
        network: slug.network,
      };
    })();

    const marketData: UnifiedCoinDetailsContext['marketData'] = (() => {
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

      const totalNumBuys =
        data3?.networkData?.totalBuy ?? data2?.update.total_num_buys ?? null;
      const totalNumSells =
        data3?.networkData?.totalSell ?? data2?.update.total_num_sells ?? null;

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
    })();

    const validatedData: UnifiedCoinDetailsContext['validatedData'] =
      data3?.validatedData ?? null;

    const charts: UnifiedCoinDetailsContext['charts'] = (() => {
      return [...(data2?.charts ?? []), ...(data1?.charts ?? [])].filter(
        (x, i, s) => s.findIndex(y => y.id === x.id) === i,
      );
    })();

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

    const risks: UnifiedCoinDetailsContext['risks'] = (() => {
      return data2?.risks && data2?.risk_percent
        ? {
            level: calcNCoinRiskLevel({
              riskPercent: data2?.risk_percent ?? 0,
            }),
            list: data2.risks ?? [],
            percentage: data2.risk_percent ?? 0,
          }
        : null;
    })();

    const goPlusSecurity: UnifiedCoinDetailsContext['goPlusSecurity'] = (() => {
      return data1?.security_data
        ? data1.security_data.map(x => x.symbol_security)
        : [];
    })();

    const rugCheckSecurity: UnifiedCoinDetailsContext['rugCheckSecurity'] =
      (() => {
        return {
          freezable:
            data3?.securityData?.freezable ??
            convertNCoinSecurityFieldToBool({
              value: data2?.base_symbol_security.freezable ?? '0',
              type: 'freezable',
            }),
          lpBurned:
            data3?.securityData?.lpBurned ??
            convertNCoinSecurityFieldToBool({
              value: data2?.base_symbol_security.lp_is_burned ?? '0',
              type: 'lpBurned',
            }),
          mintable:
            data3?.securityData?.mintable ??
            convertNCoinSecurityFieldToBool({
              value: data2?.base_symbol_security.mintable ?? '0',
              type: 'mintable',
            }),
          safeTopHolders: doesNCoinHaveSafeTopHolders({
            topHolders:
              data3?.validatedData?.top10Holding ??
              data2?.base_symbol_security.holders.map(x => x.balance) ??
              0,
            totalSupply: marketData.totalSupply ?? 0,
          }),
          rugged: data2?.rugged ?? false,
        };
      })();

    const createdAt: UnifiedCoinDetailsContext['createdAt'] = (() => {
      return data2?.creation_datetime ?? null;
    })();

    const developer: UnifiedCoinDetailsContext['developer'] = (() => {
      return data2?.dev ?? null;
    })();

    return {
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
    };
  }, [data1, data2, data3, price, slug]);
  return (
    <unifiedCoinDetailsContext.Provider value={value}>
      {children}
    </unifiedCoinDetailsContext.Provider>
  );
};

export const useUnifiedCoinDetails = () =>
  useContext(unifiedCoinDetailsContext);
