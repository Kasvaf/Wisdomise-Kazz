import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { JwtTokenKey } from 'config/constants';
import { tryParse } from 'utils/json';
import { DB } from '../config/keys';
import { type NetworksResponse } from './types/transferNetworks';

const horosBaseQuery = fetchBaseQuery({
  baseUrl: DB,
  prepareHeaders: (headers, api) => {
    const authToken = tryParse(localStorage.getItem(JwtTokenKey));
    if (authToken && typeof authToken === 'string') {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    return headers;
  },
});

const horosApiBaseQueryRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await horosBaseQuery(args, api, extraOptions);
  return result;
};

export const horosApi = createApi({
  reducerPath: 'horosApi',
  baseQuery: horosApiBaseQueryRefreshToken,
  keepUnusedDataFor: 0,
  tagTypes: ['userInfo'],
  endpoints: builder => ({
    getExchangeAccountHistoricalStatistic: builder.query<any, any>({
      query: (iasKey: string) => {
        return {
          url: `/api/v1/ias/investor-asset-structures/${iasKey}/historical-statistics?resolution=1d`,
        };
      },
    }),

    getDepositSymbol: builder.query<any, any>({
      query: () => ({
        url: '/api/v1/market/symbols?depositable=true',
      }),
    }),

    getDepositNetwork: builder.query<NetworksResponse, any>({
      query: (symbol: string) => ({
        url: `/api/v1/market/symbols/${symbol}/networks?depositable=true`,
      }),
    }),

    getDepositWalletAddress: builder.query<any, any>({
      query: (params: {
        exchangeAccountKey: string;
        symbol: string;
        network: string;
      }) => ({
        url: `/api/v1/ias/exchange-accounts/${params.exchangeAccountKey}/deposit-addresses?symbol_name=${params.symbol}&network_name=${params.network}`,
      }),
    }),

    getWithdrawSymbol: builder.query<any, any>({
      query: () => ({
        url: '/api/v1/market/symbols?withdrawable=true',
      }),
    }),

    createWithdraw: builder.mutation({
      query: (body: { exchangeAccountKey: string }) => {
        return {
          url: `/api/v1/ias/exchange-accounts/${body.exchangeAccountKey}/transactions`,
          method: 'POST',
          body: {
            ...body,
          },
        };
      },
    }),

    confirmWithdraw: builder.mutation({
      query: (params: {
        exchangeAccountKey: string;
        transactionKey: string;
        verificationCode: string;
      }) => {
        return {
          url: `/api/v1/ias/exchange-accounts/${params.exchangeAccountKey}/transactions/${params.transactionKey}?verification_code=${params.verificationCode}`,
          method: 'PATCH',
        };
      },
    }),

    resendEmailWithdraw: builder.mutation({
      query: (params: {
        exchangeAccountKey: string;
        transactionKey: string;
      }) => {
        return {
          url: `/api/v1/ias/exchange-accounts/${params.exchangeAccountKey}/transactions/${params.transactionKey}/verification-email`,
          method: 'POST',
        };
      },
    }),

    agreeToTerms: builder.mutation({
      query: data => ({
        url: '/api/v1/account/customers/me',
        method: 'PATCH',
        body: data,
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: data => ({
        url: '/api/v1/account/customers/me/verification-email',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyGetExchangeAccountHistoricalStatisticQuery,
  useGetDepositSymbolQuery,
  useLazyGetDepositNetworkQuery,
  useLazyGetDepositWalletAddressQuery,

  // withdraw
  useGetWithdrawSymbolQuery,
  useCreateWithdrawMutation,
  useConfirmWithdrawMutation,
  useResendEmailWithdrawMutation,

  // secondary form
  useAgreeToTermsMutation,

  // email verification
  useResendVerificationEmailMutation,
} = horosApi;
