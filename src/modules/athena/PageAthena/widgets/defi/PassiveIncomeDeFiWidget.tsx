import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReadableNumber } from 'shared/ReadableNumber';
import { WidgetWrapper } from '../WidgetWrapper';
import DeFiSrc from './passive-income-defi.svg';
import arrowSrc from './arrow-defi.svg';
import { usePassiveIncomeDefiQuery } from './usePassiveIncomeDefiQuery';

export default function PassiveIncomeDeFiWidget() {
  const { data } = usePassiveIncomeDefiQuery();

  return (
    <WidgetWrapper
      scroll
      iconSrc={DeFiSrc}
      poweredBy="wisdomise"
      title="Passive Income DeFi"
    >
      <div className="grid grid-cols-[1.3fr_1.3fr_1fr_1fr_0.5fr] items-center gap-x-2 pt-5 text-sm text-white/50 max-sm:text-xs">
        <div className="contents">
          <p>Project</p>
          <p>Category</p>
          <p>TVL</p>
          <p>MaxAPY</p>
          <p>More</p>
          <div className="col-span-5 mb-4 border-b border-white/10 pt-4" />
        </div>

        {data?.map(row => (
          <React.Fragment key={row.key}>
            <div className="contents text-white">
              <div className="flex max-w-[130px] items-center gap-2 max-sm:max-w-[100px]">
                <img src={row.logo_address} className="h-8 w-8 rounded-full" />
                <p className="truncate">{row.name}</p>
              </div>
              <p className="truncate">{row.category}</p>
              <ReadableNumber value={row.tvl_usd} label="$" />
              <ReadableNumber
                className="text-[#00FFA3]"
                value={row.max_apy / 100}
                label="%"
              />
              <NavLink
                rel="noreferrer"
                target="_blank"
                className="flex justify-center"
                to={'/investment/products-catalog/stake/' + row.key}
              >
                <img src={arrowSrc} />
              </NavLink>
            </div>
            <div className="col-span-5 mb-4 border-b border-white/10 pt-4 last:mb-0 last:border-transparent last:pt-5" />
          </React.Fragment>
        ))}
      </div>
    </WidgetWrapper>
  );
}
