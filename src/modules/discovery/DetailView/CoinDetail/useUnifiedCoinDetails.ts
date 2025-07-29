import { useMemo } from 'react';
import {
  type CoinCommunityData,
  type CoinNetwork,
  type NetworkRadarNCoinDetails,
  useCoinDetails,
  useNCoinDetails,
} from 'api/discovery';
import { networkRadarGrpc } from 'api/grpc';
import { type Coin } from 'api/types/shared';
import {
  calcNCoinRiskLevel,
  convertNCoinSecurityFieldToBool,
  doesNCoinHaveSafeTopHolders,
} from 'modules/discovery/ListView/NetworkRadar/lib';

export const useUnifiedCoinDetails = ({ slug }: { slug: string }) => {
  const [network, base] = slug.startsWith('solana_')
    ? slug.split('_')
    : ['', ''];
  const resp1 = useCoinDetails({ slug });
  const resp2 = useNCoinDetails({ slug });
  const resp3 = networkRadarGrpc.useCoinDetailStreamLastValue({
    network,
    base,
  });

  const data1 = resp1.data;
  const data2 = resp2.data;
  const data3 = network.length > 0 && base.length > 0 ? resp3.data : null;

  const isLoading = !data1 && !data2 && !data3;

  const symbol = useMemo<Coin>(() => {
    return {
      slug,
      abbreviation:
        data3?.symbol?.abbreviation ??
        data2?.base_symbol?.abbreviation ??
        data1?.symbol?.abbreviation ??
        slug,
      name:
        data3?.symbol?.name ??
        data2?.base_symbol?.name ??
        data1?.symbol?.name ??
        slug,
      logo_url:
        data3?.symbol?.imageUrl ??
        data2?.base_symbol?.logo_url ??
        data1?.symbol?.logo_url ??
        '',
      categories:
        data2?.base_symbol?.categories ?? data1?.symbol?.categories ?? [],
    };
  }, [data1, data2, data3, slug]);

  const labels = useMemo<string[]>(() => {
    return data2?.base_symbol_labels ?? data1?.symbol_labels ?? [];
  }, [data1, data2]);

  const networks = useMemo<CoinNetwork[]>(() => {
    if (data1?.networks) return data1.networks;
    if (data2?.network) {
      return [
        {
          network: data2?.network,
          contract_address: data2.base_contract_address,
          symbol_network_type: data2.base_contract_address ? 'TOKEN' : 'COIN',
        },
      ];
    }
    if (data3?.symbol?.contractAddress) {
      return [
        {
          contract_address: data3?.symbol?.contractAddress,
          network: {
            name: 'Solana',
            slug: network,
            icon_url: '',
          },
          symbol_network_type: data3?.symbol?.contractAddress
            ? 'TOKEN'
            : 'COIN',
        },
      ];
    }
    return [];
  }, [data1, data2, data3, network]);

  const marketData = useMemo(() => {
    const currentPrice =
      data2?.update.base_market_data.current_price ??
      data1?.data?.current_price ??
      null;
    const priceChange24h =
      data2?.update.base_market_data.price_change_24h ??
      data1?.data?.price_change_24h ??
      null;
    const priceChangePercentage24h =
      currentPrice && priceChange24h
        ? (currentPrice / (currentPrice + priceChange24h)) * 100 - 100
        : null;
    const marketCap =
      (data3?.networkData?.marketCap
        ? +data3?.networkData?.marketCap
        : undefined) ??
      data2?.update.base_market_data.market_cap ??
      data1?.data?.market_cap;
    const marketCapChangePercentage24h =
      data1?.data?.market_cap_change_percentage_24h ?? null;

    const totalVolume =
      (data3?.networkData?.volume ? +data3?.networkData?.volume : undefined) ??
      data2?.update.base_market_data.total_volume ??
      data1?.data?.total_volume;
    const totalVolumeChangePercentage24h =
      data2?.update.base_market_data.volume_change_1d ?? null;

    const tradingVolume24h =
      data2?.update.trading_volume.usd ??
      (data3?.networkData?.volume ? +data3?.networkData?.volume : null) ??
      null;

    const fullyDilutedValuation = data1?.data?.fully_diluted_valuation ?? null;

    const totalSupply =
      (data3?.networkData?.totalSupply
        ? +data3?.networkData?.totalSupply
        : null) ??
      data2?.update.base_market_data.total_supply ??
      data1?.data?.total_supply ??
      null;
    const maxSupply = data1?.data?.max_supply ?? null;
    const circulatingSupply = data1?.data?.circulating_supply ?? null;

    const boundingCurve = data3?.networkData?.boundingCurve ?? null;

    return {
      current_price: currentPrice,
      price_change_24h: priceChange24h,
      price_change_percentage_24h: priceChangePercentage24h,
      market_cap: marketCap,
      market_cap_change_percentage_24h: marketCapChangePercentage24h,
      total_volume: totalVolume,
      total_volume_change_percentage_24h: totalVolumeChangePercentage24h,
      fully_diluted_valuation: fullyDilutedValuation,
      total_supply: totalSupply,
      max_supply: maxSupply,
      circulating_supply: circulatingSupply,
      bounding_curve: boundingCurve,
      trading_volume_24h: tradingVolume24h,
    };
  }, [data1, data2, data3]);

  const goPlusSecurity = useMemo(() => {
    return data1?.security_data
      ? data1.security_data.map(x => x.symbol_security)
      : null;
  }, [data1]);

  const rugCheckSecurity = useMemo(() => {
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
        totalSupply: marketData.total_supply ?? 0,
      }),
      rugged: data2?.rugged ?? false,
    };
  }, [data2, data3, marketData]);

  const charts = useMemo(() => {
    return [...(data2?.charts ?? []), ...(data1?.charts ?? [])].filter(
      (x, i, s) => s.findIndex(y => y.id === x.id) === i,
    );
  }, [data2, data1]);

  const risks = useMemo<{
    level: 'low' | 'medium' | 'high';
    list: NonNullable<NetworkRadarNCoinDetails['risks']>;
    percentage: number;
  } | null>(() => {
    return data2?.risks && data2?.risk_percent
      ? {
          level: calcNCoinRiskLevel({
            riskPercent: data2?.risk_percent ?? 0,
          }),
          list: data2.risks ?? [],
          percentage: data2.risk_percent ?? 0,
        }
      : null;
  }, [data2]);

  const validatedData = useMemo(() => data3?.validatedData ?? null, [data3]);

  const links = useMemo<CoinCommunityData['links'] | null>(() => {
    return (
      data2?.base_community_data.links ??
      data1?.community_data?.links ??
      (data3
        ? {
            telegram_channel_identifier: data3.socials?.telegram,
            twitter_screen_name: data3.socials?.twitter,

            homepage: data3.socials?.website ? [data3.socials?.website] : [],
          }
        : null) ??
      null
    );
  }, [data3, data2, data1]);

  const createdAt = useMemo(() => {
    return data2?.creation_datetime ?? null;
  }, [data2]);

  const developer = useMemo(() => {
    return data2?.dev ?? null;
  }, [data2]);

  const tradesData = useMemo(() => {
    const totalNumBuys =
      data3?.networkData?.totalBuy ?? data2?.update.total_num_buys ?? null;
    const totalNumSells =
      data3?.networkData?.totalSell ?? data2?.update.total_num_sells ?? null;
    return typeof totalNumBuys === 'number' && typeof totalNumSells === 'number'
      ? {
          total_num_buys: totalNumBuys,
          total_num_sells: totalNumSells,
        }
      : null;
  }, [data2, data3]);

  const pools = useMemo(() => {
    return data2?.pools ?? data1?.symbol_pools ?? [];
  }, [data1, data2]);

  const exchanges = useMemo(() => data1?.exchanges ?? [], [data1]);

  return {
    data: isLoading
      ? undefined
      : {
          symbol,
          labels,
          networks,
          marketData,
          goPlusSecurity,
          rugCheckSecurity,
          validatedData,
          links,
          risks,
          createdAt,
          developer,
          tradesData,
          pools,
          charts,
          exchanges,
        },
    rawData: {
      data1,
      data2,
      data3,
    },
    isLoading,
  };
};
