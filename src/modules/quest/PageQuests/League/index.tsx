import { NavLink } from 'react-router-dom';
import bg from './bg.png';

// under maintenance
const League = () => {
  return (
    <NavLink
      to="/trader/quests/league"
      className="relative block overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 hover:saturate-200 md:h-[13rem]"
    >
      <img src={bg} alt="" className="absolute left-0 top-0 size-full" />
      <div className="relative">
        <h2 className="text-xl font-semibold">League</h2>
        <p className="mt-4 max-w-lg text-xs text-v1-content-secondary mobile:mt-2 mobile:max-w-52">
          We’re updating our gamification system, including the League. The
          current format is paused while we work on a better rewards experience.
          Stay tuned!
        </p>
      </div>
    </NavLink>
  );
};

export default League;
