import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_ORIGIN } from 'config/constants';

export const usePassiveIncomeDefiQuery = () =>
  useQuery(['passiveIncomeDeFi'], async () => {
    const { data } = await axios.get(`${API_ORIGIN}/api/v0/delphi/protocol/`);
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
