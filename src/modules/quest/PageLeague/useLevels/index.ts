import L1BronzeIcon from './01-bronze.png';
import L2SilverIcon from './02-silver.png';
import L3GoldIcon from './03-gold.png';
import L4PlatinumIcon from './04-platinum.png';
import L5DiamondIcon from './05-diamond.png';
import L6GodLikeIcon from './06-godlike.png';
import L7GoatIcon from './07-goat.png';

export const useLeagueLevels = () => {
  const levels: { name: string; icon: string }[] = [
    { name: 'Bronze', icon: L1BronzeIcon },
    { name: 'Silver', icon: L2SilverIcon },
    { name: 'Gold', icon: L3GoldIcon },
    { name: 'Platinum', icon: L4PlatinumIcon },
    { name: 'Diamond', icon: L5DiamondIcon },
    { name: 'GodLike', icon: L6GodLikeIcon },
    { name: 'Goat', icon: L7GoatIcon },
  ];
  return levels;
};
