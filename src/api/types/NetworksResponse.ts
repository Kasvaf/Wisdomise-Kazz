export type NetworksResponse = PagedResponse<Network>;
export type CryptosResponse = PagedResponse<Crypto>;

interface PagedResponse<T> {
  count: number;
  next: any;
  previous: any;
  results: T[];
}

interface Crypto {
  key: string;
  name: string;
}

export interface Network {
  key: string;
  name: string;
  description: string;
  binance_info?: BinanceInfo;
}

interface BinanceInfo {
  network: string;
  coin: string;
  entityTag: string;
  withdrawIntegerMultiple: string;
  isDefault: boolean;
  depositEnable: boolean;
  withdrawEnable: boolean;
  depositDesc: string;
  withdrawDesc: string;
  specialTips: string;
  specialWithdrawTips?: string;
  name: string;
  resetAddressStatus: boolean;
  addressRegex: string;
  addressRule: string;
  memoRegex: string;
  withdrawFee: string;
  withdrawMin: string;
  withdrawMax: string;
  minConfirm: number;
  unLockConfirm: number;
  sameAddress: boolean;
  estimatedArrivalTime: number;
  busy: boolean;
  country: string;
  contractAddressUrl: string;
  contractAddress: string;
  depositDust?: string;
}
