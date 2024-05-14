import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import DropdownContainer from 'shared/DropdownContainer';
import { ReactComponent as Kucoin } from './images/kucoin.svg';
import { ReactComponent as Bitget } from './images/bitget.svg';
import { ReactComponent as Gate } from './images/gate.svg';
import { ReactComponent as HTX } from './images/htx.svg';
import { ReactComponent as MEXC } from './images/mexc.svg';
import { ReactComponent as Arrow } from './images/arrow.svg';

const EXCHANGES = [
  {
    name: 'Kucoin',
    icon: <Kucoin />,
    url: 'https://www.kucoin.com/trade/WSDM-USDT',
  },
  {
    name: 'Gate',
    icon: <Gate />,
    url: 'https://www.gate.io/trade/WSDM_USDT',
  },
  {
    name: 'HTX',
    icon: <HTX />,
    url: 'https://www.htx.com/trade/wsdm_usdt?type=spot',
  },
  {
    name: 'MEXC',
    icon: <MEXC />,
    url: 'https://www.mexc.com/exchange/WSDM_USDT?_from=search_spot_trade',
  },
  {
    name: 'Bitget',
    icon: <Bitget />,
    url: 'https://www.bitget.com/spot/WSDMUSDT?type=spot',
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
            <div>{selectedExchange?.icon}</div>
            <Arrow />
          </div>
        </Dropdown>
      </div>
    </Button>
  );
}
