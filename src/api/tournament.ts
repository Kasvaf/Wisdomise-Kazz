import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type TournamentStatus = 'live' | 'upcoming' | 'finished';

export interface Tournament {
  key: string;
  status: TournamentStatus;
  icon: string;
  name: string;
  description: string;
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

export function useTournaments(status?: TournamentStatus) {
  return useQuery(['tournaments', status], async () => {
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    const { data } = await axios.get<Tournament[]>(
      `trader/tournaments?${params.toString()}`,
    );
    return data;
  });
}

export function useTournament(key: string) {
  return useQuery(['tournaments', key], async () => {
    const { data } = await axios.get<Tournament>(`trader/tournaments/${key}`);
    return data;
  });
}

export function useTournamentLeaderboard(key: string) {
  return useQuery(['tournamentsLeaderboard', key], async () => {
    const { data } = await axios.get<TournamentParticipant[]>(
      `trader/tournaments/${key}/leaderboard`,
    );
    return data;
  });
}

export function useTournamentMe(key: string) {
  return useQuery(['tournamentsMe', key], async () => {
    const { data } = await axios.get<TournamentParticipant>(
      `trader/tournaments/${key}/me`,
    );
    return data;
  });
}
