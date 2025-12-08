import { NavLink } from 'react-router-dom';
import bg from './bg.png';

// under maintenance
const League = () => {
  return (
    <NavLink
      className="relative block overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 hover:saturate-200 md:h-[13rem]"
      to="/trader/quests/league"
    >
      <img alt="" className="absolute top-0 left-0 size-full" src={bg} />
      <div className="relative">
        <h2 className="font-semibold text-xl">League</h2>
        <p className="mt-4 max-w-lg text-v1-content-secondary text-xs max-md:mt-2 max-md:max-w-52">
          We’re updating our gamification system, including the League. The
          current format is paused while we work on a better rewards experience.
          Stay tuned!
        </p>
      </div>
    </NavLink>
  );
};

export default League;
