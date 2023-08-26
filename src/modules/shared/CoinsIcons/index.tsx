/* eslint-disable import/max-dependencies */
import { Avatar, type AvatarProps } from 'antd';
import type React from 'react';
import { useMemo } from 'react';
import ADA from './icons/ada.svg';
import BNB from './icons/bnb.svg';
import BTC from './icons/btc.svg';
import BUSD from './icons/busd.svg';
import DOGE from './icons/doge.svg';
import ETH from './icons/eth.svg';
import LTC from './icons/ltc.svg';
import TRX from './icons/trx.svg';
import USDT from './icons/usdt.svg';
import XRP from './icons/xrp.svg';

interface Props {
  size?: AvatarProps['size'];
  maxShow?: number;
  coins: string[] | string;
}

const CoinsIcons: React.FC<Props> = ({ coins, maxShow, size }) => {
  const [_coins, isMaxShowEnable] = useMemo(() => {
    const coinsArray = Array.isArray(coins)
      ? coins
      : coins.split('#').map(c => c.split('_')[1]?.toUpperCase());

    return [
      [...new Set(coinsArray.filter(c => c in coinsIcons))].filter(
        (_, i) => i < (maxShow || Number.POSITIVE_INFINITY),
      ),
      coinsArray.length > (maxShow || Number.POSITIVE_INFINITY),
    ];
  }, [coins, maxShow]);

  return (
    <Avatar.Group>
      {_coins.map(c => (
        <Avatar
          size={size}
          className="!border-0"
          key={coinsIcons[c as keyof typeof coinsIcons].name}
          src={coinsIcons[c as keyof typeof coinsIcons].src}
        />
      ))}
      {isMaxShowEnable && (
        <p
          className="ml-2 ms-2 flex items-center text-white"
          style={{ marginInlineStart: '0.5rem' }}
        >
          . . .
        </p>
      )}
    </Avatar.Group>
  );
};

export const coinsIcons = {
  ADA: {
    name: 'ADA',
    color: '#3468D1',
    src: ADA,
  },
  BNB: {
    name: 'BNB',
    color: '#F0B90B',
    src: BNB,
  },
  BTC: {
    name: 'BTC',
    color: '#F7931A',
    src: BTC,
  },
  DOGE: {
    name: 'DOGE',
    color: '#BA9F33',
    src: DOGE,
  },
  ETH: {
    name: 'ETH',
    color: '#687DE3',
    src: ETH,
  },
  LTC: {
    name: 'LTC',
    color: '#345D9D',
    src: LTC,
  },
  TRX: {
    name: 'TRON',
    color: '#FF0013',
    src: TRX,
  },
  XRP: {
    name: 'XRP',
    color: '#23292F',
    src: XRP,
  },
  USDT: {
    name: 'USDT',
    color: '#1BA27A',
    src: USDT,
  },
  BUSD: {
    name: 'BUSD',
    color: '#F0B90B',
    src: BUSD,
  },
} as const;

export default CoinsIcons;
