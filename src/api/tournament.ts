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
  prizes: TournamentPrize[];
}

export interface TournamentPrize {
  start_rank: number;
  end_rank: number;
  items: TournamentPrizeItem[];
}

export interface TournamentPrizeItem {
  symbol_slug: string;
  amount: string;
}

export interface TournamentParticipant {
  investor_key: string;
  name: string;
  trading_volume: number;
  rank: number;
}

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

export function useTournament(key: string) {
  return useQuery({
    queryKey: ['tournaments', key],
    queryFn: async () => {
      const data = await ofetch<Tournament>(`trader/tournaments/${key}`);
      return data;
    },
  });
}

export function useTournamentLeaderboard(key: string) {
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

export function useTournamentMe(key: string) {
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
