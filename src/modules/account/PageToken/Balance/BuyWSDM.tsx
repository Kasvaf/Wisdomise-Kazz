import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import DropdownContainer from 'shared/DropdownContainer';
import { ReactComponent as Bybit } from './images/bybit.svg';
import { ReactComponent as Kucoin } from './images/kucoin.svg';
import { ReactComponent as Bitmart } from './images/bitmart.svg';
import { ReactComponent as Uniswap } from './images/uniswap.svg';
import { ReactComponent as Arrow } from './images/arrow.svg';

const EXCHANGES = [
  { name: 'Bybit', icon: <Bybit />, url: 'https://www.bybit.com/' },
  { name: 'Kucoin', icon: <Kucoin />, url: 'https://www.kucoin.com/' },
  { name: 'Bitmart', icon: <Bitmart />, url: 'https://www.bitmart.com/' },
  {
    name: 'Uniswap',
    icon: <Uniswap className="h-4" />,
    url: 'https://uniswap.org/',
  },
];

export default function BuyWSDM({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExchangeName, setSelectedExchangeName] = useState('Bybit');

  const selectedExchange = EXCHANGES.find(
    exchange => exchange.name === selectedExchangeName,
  );

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer
        className="min-w-[240px] overflow-hidden bg-black/60 !p-0"
        setOpen={setIsOpen}
      >
        {EXCHANGES.map(exchange => (
          <div
            key={exchange.name}
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-black/70"
            onClick={() => setSelectedExchangeName(exchange.name)}
          >
            <span>{exchange.name}</span>
            {exchange.icon}
          </div>
        ))}
      </DropdownContainer>
    ),
    [],
  );

  return (
    <Button variant="primary-purple" className={clsx(className, '!p-0')}>
      <div className="flex w-full justify-between">
        <div
          className="text-nowrap px-6 py-4"
          onClick={() => window.open(selectedExchange?.url, '_blank')}
        >
          Buy WSDM
        </div>
        <Dropdown
          open={isOpen}
          trigger={['click']}
          onOpenChange={setIsOpen}
          placement="bottomRight"
          dropdownRender={dropDownFn}
          autoAdjustOverflow
        >
          <div className="flex items-center gap-4 rounded-e-xl bg-white/10 p-4">
            <span>{selectedExchange?.icon}</span>
            <Arrow />
          </div>
        </Dropdown>
      </div>
    </Button>
  );
}
