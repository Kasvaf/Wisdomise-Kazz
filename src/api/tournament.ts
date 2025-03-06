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
  items: TournamentPrizeItem[];
}

export interface TournamentPrizeItem {
  symbol_slug: string;
  amount: string;
}

export interface LeaderboardParticipant {
  investor_key: string;
  name: string;
  trading_volume: number;
  rank: number;
}

export function useTournaments(status?: GamificationStatus) {
  return useQuery(['tournaments', status], async () => {
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    const data = await ofetch<{ results: Tournament[] } | Tournament[]>(
      `trader/tournaments?${params.toString()}`,
    );
    return 'results' in data ? data.results : data;
  });
}

export function useTournamentQuery(key: string) {
  return useQuery(['tournaments', key], async () => {
    const data = await ofetch<Tournament>(`trader/tournaments/${key}`);
    return data;
  });
}

export function useTournamentLeaderboardQuery(key: string) {
  return useQuery(['tournamentsLeaderboard', key], async () => {
    const data = await ofetch<LeaderboardParticipant[]>(
      `trader/tournaments/${key}/leaderboard`,
    );
    return data;
  });
}

export function useTournamentProfileQuery(key: string) {
  return useQuery(['tournamentsMe', key], async () => {
    const data = await ofetch<LeaderboardParticipant>(
      `trader/tournaments/${key}/me`,
    );
    return data;
  });
}
