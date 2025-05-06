import { useCallback, useMemo } from 'react';
import { useLeagueProfileQuery, useLeaguesQuery } from 'api/gamification';
import summit from './images/summit.png';
import pioneer from './images/pioneer.png';
import horizon from './images/horizon.png';

const LEAGUE_ASSETS = {
  'summit-league': {
    image: summit,
    description: '+ 3 randomly chosen winners who each receive $100.',
  },
  'pioneer-league': {
    image: pioneer,
    description: '+ 3 randomly chosen winners who each receive $50.',
  },
  'horizon-league': {
    image: horizon,
    description: '+ 3 randomly chosen winners who each receive $20.',
  },
};

export default function useLeague() {
  const { data: league, isLoading: leagueIsLoading } = useLeaguesQuery();
  const { data: profile, isLoading: profileIsLoading } =
    useLeagueProfileQuery();

  const enrichedLeague = useMemo(
    () =>
      league?.details.map(d => ({
        ...d,
        ...LEAGUE_ASSETS[d.slug],
      })),
    [league?.details],
  );

  const findLeague = useCallback(
    (slug?: string) => {
      return enrichedLeague?.find(l => l.slug === slug);
    },
    [enrichedLeague],
  );

  const currentLeague = useMemo(
    () => findLeague(profile?.league_slug),
    [findLeague, profile?.league_slug],
  );
  const nextLeague = useMemo(
    () => findLeague(profile?.result?.next_league_slug),
    [findLeague, profile?.result?.next_league_slug],
  );

  return useMemo(
    () => ({
      isLoading: leagueIsLoading || profileIsLoading,
      profile: {
        ...profile,
        league: currentLeague,
        result: {
          ...profile?.result,
          next_league: nextLeague,
        },
      },
      league: {
        ...league,
        details: enrichedLeague?.sort((l1, l2) => l1.level - l2.level),
      },
    }),
    [
      currentLeague,
      enrichedLeague,
      league,
      leagueIsLoading,
      nextLeague,
      profile,
      profileIsLoading,
    ],
  );
}
