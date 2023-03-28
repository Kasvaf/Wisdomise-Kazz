export interface Network {
  name: string;
  description: string;
  key: string;
  binance_info: {
    withdrawFee: string;
  };
}

export interface NetworksResponse {
  results: Network[];
}
