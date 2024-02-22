import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type Asset } from './signaler';

export const useSignalerAllowedAssetsQuery = (strategyKey?: string) =>
  useQuery(
    ['signalerAllowedAssets', strategyKey],
    async () => {
      if (!strategyKey) throw new Error('unexpected');
      const { data } = await axios.get<{ assets: Asset[] }>(
        `/factory/strategies/${strategyKey}/allowed-assets`,
      );
      return data.assets;
    },
    {
      enabled: strategyKey != null,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

// ======================================================================

export const useSignalerAssetPrice = ({
  strategyKey,
  assetName,
}: {
  strategyKey?: string;
  assetName?: string;
}) =>
  useQuery(
    ['signalerAssetPrice', strategyKey, assetName],
    async () => {
      if (!strategyKey) throw new Error('unexpected');
      const { data } = await axios.get<{ price: number }>(
        `/factory/strategies/${strategyKey}/asset-price`,
        { params: { asset_name: assetName } },
      );
      return data.price;
    },
    {
      enabled: !!strategyKey && !!assetName,
      staleTime: 60 * 1000, // 1 minute valid
    },
  );
