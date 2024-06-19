/* eslint-disable import/max-dependencies */
import { Avatar, type AvatarProps } from 'antd';
import type React from 'react';
import { useMemo } from 'react';

interface Props {
  maxShow?: number;
  className?: string;
  coins: string[] | string;
  size?: AvatarProps['size'];
}

export const cdnCoinIcon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${name}.svg`;

const CoinsIcons: React.FC<Props> = ({
  coins,
  maxShow = Number.POSITIVE_INFINITY,
  size,
  className,
}) => {
  const _coins = useMemo(() => {
    const coinsArray = Array.isArray(coins)
      ? coins
      : coins.split('#').map(c => c.split('_')[1]?.toUpperCase());

    return [...new Set(coinsArray)].filter(Boolean);
  }, [coins]);

  const fCoins =
    _coins.length > maxShow + 1 ? _coins.slice(0, maxShow) : _coins;
  const excessCoins = _coins.length - fCoins.length;

  return (
    <Avatar.Group className={className}>
      {fCoins.map(c => (
        <div
          key={c}
          className="z-[1] grow-0 self-center rounded-full bg-white p-[1px]"
        >
          <Avatar
            size={size}
            className="!border-0"
            src={c.startsWith('http') ? c : cdnCoinIcon(c.toLowerCase())}
          />
        </div>
      ))}
      {!!excessCoins && (
        <div className="z-[2] grow-0 self-center rounded-full bg-white p-[1px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5f5f62]">
            +{excessCoins}
          </div>
        </div>
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
