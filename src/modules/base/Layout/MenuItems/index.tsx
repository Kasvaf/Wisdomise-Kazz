import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useHasFlag } from 'api';
import { DebugPin } from 'shared/DebugPin';
import useMenuItems from './useMenuItems';

const TOUR_CLASS = 'tour-item-bottom-navbar';
const MenuItems: React.FC<{
  horizontal?: boolean;
  className?: string;
  itemsClassName?: string;
}> = ({ horizontal, className, itemsClassName }) => {
  const { items: MenuItems } = useMenuItems();
  const hasFlag = useHasFlag();

  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));

  return (
    <div
      className={clsx(
        'flex w-full items-stretch justify-between text-white',
        TOUR_CLASS,
        className,
      )}
    >
      {items.map(item => (
        <NavLink
          to={item.link}
          key={item.link}
          className={clsx(
            'group flex flex-1 items-center justify-center',
            horizontal ? 'gap-1' : 'flex-col',
            horizontal ? '[&>svg]:size-5' : '[&>svg]:size-7',
            '[&.active]:font-bold [&.active]:text-v1-content-brand',
            'hover:text-v1-content-link-hover',
            itemsClassName,
          )}
        >
          <DebugPin title={item.link} color="orange" />
          {item.icon}
          <div className="mt-1 text-xs font-normal">{item.text}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
