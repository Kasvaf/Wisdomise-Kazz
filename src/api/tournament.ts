import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

export type GamificationStatus = 'live' | 'upcoming' | 'finished' | 'active';

export interface Tournament {
  key: string;
  status: GamificationStatus;
  icon: string;
  name: string;
  description: string;
  tooltip_content: string;
  start_time: string;
  end_time: string;
  prizes: LeaderboardPrize[];
}

export interface LeaderboardPrize {
  start_rank: number;
  end_rank: number;
  items: PrizeItem[];
}

export interface PrizeItem {
  symbol_slug: string;
  amount: string;
}

export interface LeaderboardParticipant {
  investor_key: string;
  name?: string;
  trading_volume: number;
  rank: number;
  league_slug?: string;
  promotion_status?: PromotionStatus;
  promotion_detail?: {
    prev_league: string;
    next_league: string;
    reward_items: PrizeItem[];
  };
}

export type PromotionStatus = 'DEMOTING' | 'PROMOTING' | 'NEUTRAL';

export function useTournaments(status?: GamificationStatus) {
  return useQuery({
    queryKey: ['tournaments', status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.set('status', status);
      }
      const data = await ofetch<{ results: Tournament[] } | Tournament[]>(
        `trader/tournaments?${params.toString()}`,
      );
      return 'results' in data ? data.results : data;
    },
  });
}

export function useTournamentQuery(key: string) {
  return useQuery({
    queryKey: ['tournaments', key],
    queryFn: async () => {
      const data = await ofetch<Tournament>(`trader/tournaments/${key}`);
      return data;
    },
  });
}

export function useTournamentLeaderboardQuery(key: string) {
  return useQuery({
    queryKey: ['tournamentsLeaderboard', key],
    queryFn: async () => {
      const data = await ofetch<TournamentParticipant[]>(
        `trader/tournaments/${key}/leaderboard`,
      );
      return data;
    },
  });
}

export function useTournamentProfileQuery(key: string) {
  return useQuery({
    queryKey: ['tournamentsMe', key],
    queryFn: async () => {
      const data = await ofetch<TournamentParticipant>(
        `trader/tournaments/${key}/me`,
      );
      return data;
    },
  });
}
