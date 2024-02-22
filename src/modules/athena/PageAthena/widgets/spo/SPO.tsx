import { clsx } from 'clsx';
import { WidgetWrapper } from '../WidgetWrapper';
import { CoinsTable } from './components/CoinsTable';
import { PieChart } from './components/PieChart';
import { useSPO } from './components/SPOProvider';
import { risks } from './constants';
import SPOIcon from './icons/spo.svg';

export const SPO = () => {
  const { risk, setRisk } = useSPO();

  return (
    <WidgetWrapper
      title="SPO"
      iconSrc={SPOIcon}
      poweredBy="wisdomise"
      rightHeader={
        <p className="text-sm text-white/70">Smart Portfolio Optimization</p>
      }
    >
      <section className="-mx-8 flex flex-col bg-black/20 px-8 py-6">
        <section className="mb-6 flex justify-between gap-2">
          {risks.map(btnRisk => (
            <button
              key={btnRisk}
              onClick={() => setRisk(btnRisk)}
              className={clsx(
                'max-w-[140px] grow rounded-lg bg-white/10 px-4 py-3 text-xs capitalize leading-none text-white opacity-50 transition-colors hover:bg-white/30 hover:opacity-100',
                risk === btnRisk && '!bg-white/30 !opacity-100',
                'max-md:grow-0 max-md:gap-2 max-md:px-6 max-xs:px-4',
              )}
            >
              {btnRisk + ' risk'}
            </button>
          ))}
        </section>

        <section className="max-[1290px]:gap-0 flex gap-8 max-xs:gap-4">
          <section className="basis-1/2 pr-3 max-xs:pr-0">
            <CoinsTable />
          </section>
          <section className="basis-1/2">
            <PieChart />
          </section>
        </section>
      </section>
    </WidgetWrapper>
  );
};
