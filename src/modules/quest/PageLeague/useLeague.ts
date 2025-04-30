import { useCallback, useMemo } from 'react';
import {
  type LeagueDetail,
  useLeagueProfileQuery,
  useLeaguesQuery,
} from 'api/gamification';
import summit from './images/summit.png';
import pioneer from './images/pioneer.png';
import horizon from './images/horizon.png';

const LEAGUE_ASSETS: Record<LeagueDetail['slug'], any> = {
  'summit-league': { image: summit },
  'pioneer-league': { image: pioneer },
  'horizon-league': { image: horizon },
};

export default function useLeague() {
  const { data: league, isLoading: leagueIsLoading } = useLeaguesQuery();
  const { data: profile, isLoading: profileIsLoading } =
    useLeagueProfileQuery();

  const enrichedLeague = useMemo(
    () =>
      league?.details.map(d => ({
        ...d,
        image: LEAGUE_ASSETS[d.slug].image,
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
