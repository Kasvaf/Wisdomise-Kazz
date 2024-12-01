import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { ReactComponent as BgAbstract } from './BgAbstract.svg';
import imgStars from './stars.png';

const BlackFridayBanner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <NavLink
      to="/account/billing"
      className={clsx(
        'relative flex h-9 items-center justify-center overflow-hidden text-white mobile:px-1',
        'hover:saturate-150',
        'text-sm mobile:text-sm',
        className,
      )}
      style={{
        background:
          'linear-gradient(90deg, #1A1F37 0%, #5C15B9 50%, #1A1F37 100%)',
      }}
    >
      <BgAbstract className="absolute left-0 shrink" />
      <div className="grow" />

      <img src={imgStars} className="absolute shrink-0 mix-blend-lighten" />

      <span className="z-10 ml-1 mr-2 whitespace-nowrap uppercase mobile:hidden">
        Become An <strong>ai trader</strong>
      </span>
      <div
        className="z-10 shrink-0 whitespace-nowrap rounded-full px-3"
        style={{
          background:
            'linear-gradient(87deg, #FF00C7 -90.22%, #00A3FF 145.57%)',
        }}
      >
        <span>Promo Code: </span>
        <strong className="font-extrabold">BLKFRIDAY24</strong>
      </div>
      <div className="z-10 ml-1 mr-2 whitespace-nowrap uppercase">
        get 60% off
      </div>

      <div className="grow" />
      <BgAbstract className="absolute right-0 shrink -scale-x-100" />
    </NavLink>
  );
};

export default BlackFridayBanner;
