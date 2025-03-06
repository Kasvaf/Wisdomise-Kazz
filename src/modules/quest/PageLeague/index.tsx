import { Carousel } from 'antd';
import { useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import BtnBack from 'modules/base/BtnBack';
import {
  useLeagueLeaderboardQuery,
  useLeagueProfileQuery,
  useLeaguesQuery,
} from 'api/gamification';
import Badge from 'shared/Badge';
import Leaderboard from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';
import summit from './images/summit.png';

export default function PageLeague() {
  const { data: leagues } = useLeaguesQuery();
  const [currentLeague, setCurrentLeague] = useState(0);
  const { data: me } = useLeagueProfileQuery();
  const { data: participants } = useLeagueLeaderboardQuery(
    leagues?.details[currentLeague].slug,
  );

  console.log(currentLeague);

  return (
    <PageWrapper>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="w-1/2">
          <BtnBack />
        </div>
        <div className="shrink-0 text-center text-base font-medium">League</div>
        <div className="w-1/2"></div>
      </div>
      <PageTitle
        title="Compete, Rise, and Conquer!"
        description="Compete Weekly, Earn Points, and Climb the Ranks. Top 10 Advance and Win Prizes. Stay Competitive and Aim for the Top!"
      />

      <div>
        <Carousel
          swipeToSlide
          draggable
          centerMode
          arrows={true}
          afterChange={current => setCurrentLeague(current)}
        >
          {leagues?.details.map(item => (
            <div key={item.slug}>
              <div className="flex flex-col items-center">
                <Badge label="You are here" color="orange" />
                <img src={summit} />
                <h2>{item.name}</h2>
              </div>
            </div>
          ))}
        </Carousel>
        {me && participants && (
          <Leaderboard participants={participants} me={me} />
        )}
      </div>
    </PageWrapper>
  );
}
