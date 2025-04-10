import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useHasFlag } from 'api';
import { DebugPin } from 'shared/DebugPin';
import useMenuItems, { type RootMenuItem } from './useMenuItems';

const TOUR_CLASS = 'tour-item-bottom-navbar';
const MenuItems: React.FC<{ horizontal?: boolean; className?: string }> = ({
  horizontal,
  className,
}) => {
  const { items: MenuItems } = useMenuItems();
  const hasFlag = useHasFlag();

  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));

  const renderItem = (item: RootMenuItem) => (
    <NavLink
      to={item.link}
      key={item.link}
      className={clsx(
        'group flex flex-1 items-center justify-center',
        horizontal ? 'gap-1' : 'flex-col',
        horizontal ? '[&>svg]:size-5' : '[&>svg]:size-7',
        'opacity-60 [&.active]:font-bold [&.active]:text-[#00A3FF] [&.active]:opacity-100',
      )}
    >
      <DebugPin title={item.link} color="orange" />
      {item.icon}
      <div className="mt-1 text-xs font-normal">{item.text}</div>
    </NavLink>
  );

  return (
    <div
      className={clsx(
        'flex w-full items-center justify-between text-white',
        TOUR_CLASS,
        className,
      )}
    >
      {items.map(renderItem)}
    </div>
  );
};

export default MenuItems;
