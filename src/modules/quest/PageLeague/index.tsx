import { Carousel } from 'antd';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import {
  useLeagueLeaderboardQuery,
  useLeagueProfileQuery,
} from 'api/gamification';
import Badge from 'shared/Badge';
import Leaderboard from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import useLeague from 'modules/quest/PageLeague/useLeague';

export default function PageLeague() {
  const { profile, details, isLoading } = useLeague();
  const [currentLeague, setCurrentLeague] = useState<number | undefined>();
  const { data: me } = useLeagueProfileQuery();
  const { data: participants } = useLeagueLeaderboardQuery(
    currentLeague === undefined ? undefined : details?.[currentLeague].slug,
  );

  useEffect(() => {
    if (profile.league && !currentLeague) {
      setCurrentLeague(profile.league.level);
    }
  }, [currentLeague, profile.league]);

  return (
    <PageWrapper loading={isLoading}>
      <PageTitle
        className="pt-8"
        title="Compete, Rise, and Conquer!"
        description="Compete Weekly, Earn Points, and Climb the Ranks. Top 10 Advance and Win Prizes. Stay Competitive and Aim for the Top!"
      />

      <div className="mx-auto my-8 h-48">
        {currentLeague === undefined ? null : (
          <Carousel
            initialSlide={currentLeague}
            swipeToSlide
            infinite={false}
            dots={false}
            draggable
            centerMode
            centerPadding="30%"
            afterChange={current => setCurrentLeague(current)}
          >
            {details?.map((item, index) => (
              <div key={item.slug}>
                <div className="relative mx-auto flex flex-col items-center">
                  {profile.league_slug === item.slug && (
                    <Badge
                      label="You are here"
                      color="orange"
                      className="absolute top-0"
                    />
                  )}
                  <LeagueIcon
                    className={clsx(
                      'mt-2 transition-all',
                      currentLeague === index ? 'size-40' : 'size-32',
                    )}
                    slug={item.slug}
                    isActive={currentLeague === index}
                  />
                  <h2>{item.name}</h2>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <Leaderboard participants={participants} me={me} />
    </PageWrapper>
  );
}
