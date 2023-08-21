import { useInvestorAssetStructuresQuery } from 'api';

export default function useMainQuote() {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;
  return mea?.quote.name || '';
}
