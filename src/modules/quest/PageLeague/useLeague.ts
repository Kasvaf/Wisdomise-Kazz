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

  const enrichedLeague = league?.details.map(d => ({
    ...d,
    image: LEAGUE_ASSETS[d.slug].image,
  }));

  const findLeague = (slug?: string) => {
    return enrichedLeague?.find(l => l.slug === slug);
  };

  const currentLeague = findLeague(profile?.league_slug);
  const nextLeague = findLeague(profile?.promotion_detail?.next_league);
  const prevLeague = findLeague(profile?.promotion_detail?.prev_league);

  return {
    isLoading: leagueIsLoading || profileIsLoading,
    profile: {
      ...profile,
      league: currentLeague,
      promotion_detail: {
        ...profile?.promotion_detail,
        prev_league: prevLeague,
        next_league: nextLeague,
      },
    },
    details: enrichedLeague,
  };
}
