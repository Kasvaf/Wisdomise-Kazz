import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WithdrawNetworksResponse } from "./types/withdrawNetworksResponse";

export const useWithdrawNetworksQuery = ({
  exchangeAccountKey,
  symbol,
}: {
  symbol?: string;
  exchangeAccountKey?: string;
}) =>
  useQuery<WithdrawNetworksResponse["results"]>(
    ["withdrawNetworks"],
    async () => {
      const { data } = await axios.get<WithdrawNetworksResponse>(
        `market/symbols/${symbol}/networks?withdrawable=true&exchange_account_key=${exchangeAccountKey}`
      );

      return data.results;
    },
    { enabled: !!exchangeAccountKey && !!symbol }
  );
