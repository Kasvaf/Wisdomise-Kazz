import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { StatusChip } from 'modules/quest/PageQuests/StatusChip';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import useLeague from 'modules/quest/PageLeague/useLeague';
import { useLeaguesQuery } from 'api/gamification';
import bg from './bg.png';
import plate from './plate.png';

const League = () => {
  const { profile } = useLeague();
  const { data } = useLeaguesQuery();

  return (
    <NavLink
      to="/trader/quests/league"
      className="relative block overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 hover:saturate-200 md:h-[13rem]"
    >
      <img src={bg} alt="" className="absolute left-0 top-0 size-full" />
      <div className="relative">
        <h2 className="text-xl font-semibold">League</h2>
        <p className="mt-4 text-xs text-v1-content-secondary mobile:mt-2 mobile:max-w-52">
          Advance Through the Leagues and Win Prizes.
        </p>
        <StatusChip className="mb-6 mt-4">
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
            <p>
              {(profile?.trading_volume ?? 0) > 0
                ? `#${profile?.rank ?? ''}`
                : '-'}
            </p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Trade Volume</h3>
            <p className="text-sm">${profile?.trading_volume}</p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">Status</h3>
            <p className="text-sm capitalize">
              {profile?.promotion_status?.toLowerCase()}
            </p>
          </div>
          <div className="h-8 border-r border-v1-border-primary/30"></div>
          <div>
            <h3 className="mb-2 text-v1-content-secondary">League</h3>
            <p className="text-sm">{profile?.league?.name.split(' ')[0]}</p>
          </div>
        </div>
      </div>
      {profile.league_slug && (
        <div className="absolute right-4 top-4 flex flex-col items-center">
          <LeagueIcon
            slug={profile.league_slug}
            className="-mb-4 size-24"
            isActive={true}
          />
          <img src={plate} alt="plate" className="w-16" />
        </div>
      )}
    </NavLink>
  );
};

export default League;
