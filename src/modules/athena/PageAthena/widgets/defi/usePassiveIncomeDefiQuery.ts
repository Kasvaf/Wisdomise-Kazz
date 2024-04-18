import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';

export const usePassiveIncomeDefiQuery = () =>
  useQuery(['passiveIncomeDeFi'], async () => {
    const { data } = await axios.get(
      `${TEMPLE_ORIGIN}/api/v1/delphi/protocols/`,
    );
    return data.protocols as DefiProtocol[];
  });

interface DefiProtocol {
  key: string;
  name: string;
  logo_address: string;
  category: string;
  tvl_usd: number;
  max_apy: number;
  symbol: {
    symbol: string;
    name: string;
    contract_address: string;
    network: string;
  };
}
