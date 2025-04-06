import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { PageResponse } from 'api/types/page';
import {
  ACCOUNT_PANEL_ORIGIN,
  INVESTMENT_ORIGIN,
  TEMPLE_ORIGIN,
} from 'config/constants';
import { ofetch } from 'config/ofetch';
import { isProduction } from 'utils/version';

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
        { meta: { gameAuth: true } },
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
      { body, method: 'post', meta: { gameAuth: true } },
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
      { body, method: 'post', meta: { gameAuth: true } },
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
        { meta: { gameAuth: true } },
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
      { body, method: 'post', meta: { gameAuth: true } },
    );
    return data;
  });

interface GamificationProfile {
  profile: {
    userId: string;
    customAttributes: {
      boxRewardAmount: string;
      boxRewardType: string;
      sevenDaysTradingStreakMissionActiveTask: string;
      sevenDaysTradingStreakMissionCurrentTask: string;
      sevenDaysTradingStreakMissionLastTaskCompletedAt: string;
    };
  };
  rewards: Array<{
    name: string;
    statistical?: { count: number; sum: number };
  }>;
}

export const useGamificationProfile = () =>
  useQuery(
    ['gamificationProfile'],
    async () => {
      return await ofetch<GamificationProfile>(
        `${TEMPLE_ORIGIN}/api/v1/gamification/profile`,
        { method: 'get' },
      );
    },
    { refetchInterval: 30 * 1000, retry: false },
  );

export interface GamificationActionBody {
  event_name: 'claim';
  attributes?: Record<string, string>;
}

export const useGamificationAction = () =>
  useMutation(async (body: GamificationActionBody) => {
    const data = await ofetch(`${TEMPLE_ORIGIN}/api/v1/gamification/action`, {
      body,
      method: 'post',
    });
    return data;
  });

const AFTER_TRADE_PERIOD = (isProduction ? 24 * 60 : 1) * 60 * 1000;
const STREAK_END_PERIOD = (isProduction ? 24 * 60 : 15) * 60 * 1000;

export const useGamification = () => {
  const { data } = useGamificationProfile();
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const activeDay = +(
    data?.profile.customAttributes.sevenDaysTradingStreakMissionActiveTask ?? 0
  );
  const currentDay = +(
    data?.profile.customAttributes.sevenDaysTradingStreakMissionCurrentTask ??
    -1
  );
  const nextDayStartTimestamp =
    +(
      data?.profile.customAttributes
        .sevenDaysTradingStreakMissionLastTaskCompletedAt ?? 0
    ) + AFTER_TRADE_PERIOD;

  useEffect(() => {
    setRewardClaimed(
      +(data?.profile.customAttributes.boxRewardAmount ?? 0) === 0,
    );
  }, [data]);

  return {
    activeDay,
    currentDay,
    completedAll: activeDay === 6 && currentDay === 6,
    rewardClaimed,
    setRewardClaimed,
    completedToday: currentDay === activeDay,
    nextDayStartTimestamp,
    nextDayEndTimestamp: nextDayStartTimestamp + STREAK_END_PERIOD,
  };
};

export const useGamificationRewards = () => {
  const { data } = useGamificationProfile();

  const findMissionReward = (rewardName: string) => {
    return (
      data?.rewards.find(r => r.name === rewardName)?.statistical?.sum ?? 0
    );
  };

  return {
    daily: findMissionReward('tether_daily'),
    tradeReferral: findMissionReward('tether_trade-referral'),
    subReferral: findMissionReward('tether_sub-referral'),
    total: findMissionReward('tether'),
    claimed: findMissionReward('claimed_claimed'),
  };
};

interface RewardHistoryItem {
  address: string;
  amount_usd: number;
  status: 'pending' | 'confirmed' | 'rejected';
  transaction_hash?: string;
}

export const useRewardsHistoryQuery = () =>
  useQuery(
    ['rewardsHistory'],
    async () => {
      return await ofetch<RewardHistoryItem[]>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/reward`,
      );
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

interface ClaimRewardBody {
  solana_wallet_address: string;
}

export const useWithdrawRewardMutation = () => {
  const client = useQueryClient();
  return useMutation(
    async (body: ClaimRewardBody) => {
      return await ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/reward`, {
        body,
        method: 'post',
      });
    },
    { onSuccess: () => client.invalidateQueries(['rewardsHistory']) },
  );
};
