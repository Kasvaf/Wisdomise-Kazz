import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import DropdownContainer from 'shared/DropdownContainer';
import { ReactComponent as Kucoin } from './images/kucoin.svg';
import { ReactComponent as Arrow } from './images/arrow.svg';

const EXCHANGES = [
  {
    name: 'Kucoin',
    icon: <Kucoin />,
    url: 'https://www.kucoin.com/price/WSDM',
  },
  { name: 'HTX', icon: <Kucoin />, url: 'https://www.htx.com/' },
  {
    name: 'Bitget',
    icon: <Kucoin />,
    url: 'https://www.bitget.com/price/wisdomise',
  },
  {
    name: 'Gate',
    icon: <Kucoin />,
    url: 'https://www.gate.io/trade/WSDM_USDT',
  },
  {
    name: 'MEXC',
    icon: <Kucoin />,
    url: 'https://www.mexc.com/',
  },
];

export default function BuyWSDM({ className }: { className?: string }) {
  const { t } = useTranslation('wisdomise-token');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExchangeName, setSelectedExchangeName] = useState('Kucoin');

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
          {t('balance.buy')}
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
