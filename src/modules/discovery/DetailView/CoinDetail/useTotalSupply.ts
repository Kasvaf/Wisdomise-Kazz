import { useTokenInfo } from 'api/token-info';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useEffect, useState } from 'react';

export const useTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState<number | undefined>(undefined);
  const { marketData, symbol } = useUnifiedCoinDetails();
  const { data: tokenInfo } = useTokenInfo({ slug: symbol.slug });

  useEffect(() => {
    if (symbol.slug) {
      setTotalSupply(undefined);
    }
  }, [symbol.slug]);

  useEffect(() => {
    if (totalSupply) return;
    if (tokenInfo?.total_supply) {
      setTotalSupply(tokenInfo.total_supply);
    } else if (marketData.totalSupply) {
      setTotalSupply(marketData.totalSupply);
    }
  }, [marketData.totalSupply, tokenInfo, totalSupply]);

  return { totalSupply };
};
