import { useMutation, useQuery } from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { INVESTMENT_ORIGIN, TEMPLE_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';

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
      const data = await ofetch<PageResponse<Friend>>(
        `${INVESTMENT_ORIGIN}/api/v1/gamification/user/friend`,
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
  user_attributes: Array<
    | { attribute: 'gameboy_skin'; value: string }
    | { attribute: 'usdt_balance'; value: number }
  >;
}

export const useSyncDataMutation = () => {
  return useMutation(async (body: SyncDataRequest) => {
    const data = await ofetch<SyncDataResponse>(
      `${INVESTMENT_ORIGIN}/api/v1/gamification/user/sync-data`,
      { body, method: 'post' },
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
    const data = await ofetch<CheckEligibilityResponse[]>(
      `${INVESTMENT_ORIGIN}/api/v1/gamification/user/check-eligibility`,
      { body, method: 'post' },
    );
    return data;
  });

type UserTickets = Record<TicketType, number[]>;

export const useUserTicketsQuery = () =>
  useQuery(
    ['userTickets'],
    async () => {
      const data = await ofetch<UserTickets>(
        `${INVESTMENT_ORIGIN}/api/v1/gamification/user/tickets`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

interface WithdrawRequest {
  token: 'ton' | 'usdt';
}

export const useWithdrawMutation = () =>
  useMutation(async (body: WithdrawRequest) => {
    const data = await ofetch(
      `${INVESTMENT_ORIGIN}/api/v1/gamification/user/withdraw`,
      { body, method: 'post' },
    );
    return data;
  });

interface GamificationProfile {
  profile: {
    userId: string;
    customAttributes: {
      sevenDaysTradingStreakMissionActiveTask: string;
      sevenDaysTradingStreakMissionCurrentTask: string;
    };
  };
  rewards: Array<{
    fieldName: string;
    statistical?: { count: number; sum: number };
  }>;
}

export const useGamificationProfile = () =>
  useQuery(['gamificationProfile'], async () => {
    return await ofetch<GamificationProfile>(
      `${TEMPLE_ORIGIN}/api/v1/gamification/user/withdraw`,
      { method: 'get' },
    );
  });

export const useGamification = () => {
  const { data } = useGamificationProfile();
  const activeDay = +(
    data?.profile.customAttributes.sevenDaysTradingStreakMissionActiveTask ?? 0
  );
  const currentDay = +(
    data?.profile.customAttributes.sevenDaysTradingStreakMissionCurrentTask ??
    -1
  );

  return {
    activeDay,
    currentDay,
    enableClaim: activeDay === 6 && currentDay === 6,
    completedToday: activeDay !== -1 && currentDay === activeDay,
  };
};
