import { clsx } from 'clsx';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as BlackFriday } from './BlackFriday.svg';
import { ReactComponent as BgAbstract } from './BgAbstract.svg';

const BlackFridayBanner: React.FC<{ className?: string }> = ({ className }) => {
  const isMobile = useIsMobile();

  return (
    <NavLink
      to="/account/billing"
      className={clsx(
        'flex h-9 items-center justify-center bg-black text-white hover:bg-v1-background-accent/50 mobile:px-1',
        className,
      )}
    >
      {!isMobile && (
        <>
          <BgAbstract />
          <div className="grow" />
        </>
      )}

      <BlackFriday />
      <span className="ml-1 mobile:text-sm">
        Get Your Pro Plan With 60% Discount!
      </span>

      {!isMobile && (
        <>
          <Icon name={bxRightArrowAlt} />
          <div className="grow" />
          <BgAbstract />
        </>
      )}
    </NavLink>
  );
};

export default BlackFridayBanner;
