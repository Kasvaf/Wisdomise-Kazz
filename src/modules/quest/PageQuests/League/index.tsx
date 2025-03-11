import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { StatusChip } from 'modules/quest/PageQuests/StatusChip';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import useLeague from 'modules/quest/PageLeague/useLeague';
import { useLeaguesQuery } from 'api/gamification';
import gradient from './gradient.png';

const League = () => {
  const { profile } = useLeague();
  const { data } = useLeaguesQuery();

  return (
    <NavLink
      to="/trader-quests/league"
      className="relative mb-4 block overflow-hidden rounded-2xl bg-v1-surface-l2 p-4"
    >
      <img
        src={gradient}
        alt=""
        className="absolute left-0 top-0 h-full w-full"
      />
      <div className="relative">
        <h2 className="text-xl font-semibold">League</h2>
        <p className="mt-3 max-w-52 text-xs text-v1-content-secondary">
          Advance Through the Leagues and Win Prizes.
        </p>
        <StatusChip className="mb-8 mt-3">
          <div className="flex gap-2 text-xs">
            <div className="text-xxs text-v1-content-secondary">
              Weekly Countdown
            </div>
            <div>{dayjs(data?.end_time).fromNow(true)} Left</div>
          </div>
        </StatusChip>
        <div className="flex items-center justify-around text-center text-xs">
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Rank</h3>
            <p>#{profile?.rank}</p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Trade Volume</h3>
            <p>${profile?.trading_volume}</p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Status</h3>
            <p>{profile?.promotion_status}</p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">League</h3>
            <p>{profile?.league?.name}</p>
          </div>
        </div>
      </div>
      {profile.league_slug && (
        <LeagueIcon
          slug={profile.league_slug}
          className="absolute right-2 top-4 -mb-8 h-24 w-24"
          isActive={true}
        />
      )}
    </NavLink>
  );
};

export default League;
