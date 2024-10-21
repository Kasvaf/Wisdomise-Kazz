import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTonAddress } from '@tonconnect/ui-react';
import type { PageResponse } from 'api/types/page';
import { TEMPLE_ORIGIN } from 'config/constants';

const WSDM_CONTRACT_ADDRESS = import.meta.env
  .VITE_WSDM_CONTRACT_ADDRESS as string;
const TON_API_BASE_URL = import.meta.env.VITE_TON_API_BASE_URL as string;

export interface Friend {
  telegram_id: number;
  level: number;
  kp: number;
  name: string;
}

export const useFriends = () =>
  useQuery(
    ['friends'],
    async () => {
      const { data } = await axios.get<PageResponse<Friend>>(
        `${TEMPLE_ORIGIN}/api/v1/investment/gamification/user/friend`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export interface SyncDataRequest {
  wallet_address?: string;
  new_taps?: number;
  new_item?: string;
  new_task_done?: string;
  block_question_answer?: string;
  bet?: unknown;
  bet_amount?: number;
  bet_question_answer?: string;
  spin?: boolean;
}

export interface SyncDataResponse {
  storage_capacity: number;
  next_burst: unknown;
  bp: number;
  item_list_key: string[];
  kp: number;
  level_key: string;
  unconverted_kp: number;
  task_done_list_key: string[];
  updated_at: string;
  unused_anti_virus: number;
  block: unknown;
  boost_data: unknown;
  bet?: unknown;
  spin?: unknown;
  ton_balance: 0;
  wsdm_balance: 0;
  total_bets: 0;
  total_bets_won: 0;
  wallet_address: string;
  joined_waitlist_at?: string;
  tickets: {
    golden_ticket: number;
    plat_ticket: number;
    silver_ticket: number;
  };
}

export const useSyncDataMutation = () => {
  return useMutation(async (body: SyncDataRequest) => {
    const { data } = await axios.post<SyncDataResponse>(
      `${TEMPLE_ORIGIN}/api/v1/investment/gamification/user/sync-data`,
      body,
    );
    return data;
  });
};

export type TicketType = 'silver_ticket';

interface CheckEligibilityResponse {
  ticket_number: number;
  status: 'claimed' | 'winner' | 'looser';
  reward: number;
}

interface CheckEligibilityRequest {
  ticket_type: TicketType;
}

export const useCheckEligibilityMutation = () =>
  useMutation(async (body: CheckEligibilityRequest) => {
    const { data } = await axios.post<CheckEligibilityResponse[]>(
      `${TEMPLE_ORIGIN}/api/v1/investment/gamification/user/check-eligibility`,
      body,
    );
    return data;
  });

type UserTickets = Record<TicketType, number[]>;

export const useUserTicketsQuery = () =>
  useQuery(
    ['userTickets'],
    async () => {
      const { data } = await axios.get<UserTickets>(
        `${TEMPLE_ORIGIN}/api/v1/investment/gamification/user/tickets`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

interface WithdrawRequest {
  token: 'wsdm' | 'ton';
}

export const useWithdrawMutation = () =>
  useMutation(async (body: WithdrawRequest) => {
    const { data } = await axios.post(
      `${TEMPLE_ORIGIN}/api/v1/investment/gamification/user/withdraw`,
      body,
    );
    return data;
  });

export const useWaitlistMutation = () =>
  useMutation(async () => {
    return await axios.post<unknown>(
      `${TEMPLE_ORIGIN}/api/v1/investment/gamification/user/wait-list`,
    );
  });

export interface AccountJettonBalance {
  balance: string;
}

export const useAccountJettonBalance = () => {
  const address = useTonAddress();
  return useQuery(
    ['accountJettonBalance', address],
    async () => {
      const { data } = await axios.get<AccountJettonBalance>(
        `${TON_API_BASE_URL}/v2/accounts/${address}/jettons/${WSDM_CONTRACT_ADDRESS}`,
        {
          transformRequest: [
            (data, headers) => {
              delete headers.Authorization;
              return data;
            },
          ],
        },
      );
      return data;
    },
    { enabled: !!address },
  );
};
