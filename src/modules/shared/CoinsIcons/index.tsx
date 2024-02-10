/* eslint-disable import/max-dependencies */
import { Avatar, type AvatarProps } from 'antd';
import type React from 'react';
import { useMemo } from 'react';

interface Props {
  size?: AvatarProps['size'];
  maxShow?: number;
  coins: string[] | string;
  className?: string;
}

const cdnIcon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${name}.svg`;

const CoinsIcons: React.FC<Props> = ({ coins, maxShow, size, className }) => {
  const [_coins, isMaxShowEnable] = useMemo(() => {
    const coinsArray = Array.isArray(coins)
      ? coins
      : coins.split('#').map(c => c.split('_')[1]?.toUpperCase());

    return [
      [...new Set(coinsArray)].filter(
        (name, i) => name && i < (maxShow || Number.POSITIVE_INFINITY),
      ),
      coinsArray.length > (maxShow || Number.POSITIVE_INFINITY),
    ];
  }, [coins, maxShow]);

  return (
    <Avatar.Group className={className}>
      {_coins.map(c => (
        <Avatar
          key={c}
          size={size}
          className="!border-0"
          src={cdnIcon(c.toLowerCase())}
        />
      ))}
      {isMaxShowEnable && (
        <p
          className="ml-2 ms-2 flex items-center text-white"
          style={{ marginInlineStart: '0.5rem' }}
        >
          {'. . .'}
        </p>
      )}
    </Avatar.Group>
  );
};

const coinsColors = {
  ADA: '#3468D1',
  BNB: '#F0B90B',
  BTC: '#F7931A',
  DOGE: '#BA9F33',
  ETH: '#687DE3',
  LTC: '#345D9D',
  TRX: '#FF0013',
  XRP: '#23292F',
  USDT: '#1BA27A',
  BUSD: '#F0B90B',
  MATIC: '#6c2ed8',
  SOL: '#9945FF',
  UNI: '#FF007A',
} as const;

const stableRandom: Record<string, string> = {};
export function getCoinColor(coin: string) {
  const exists = (coinsColors as any)[coin] || stableRandom[coin];
  if (exists) return exists;

  stableRandom[coin] =
    '#' + Math.floor(Math.random() * 16_777_215).toString(16);
  return stableRandom[coin];
}

export default CoinsIcons;
