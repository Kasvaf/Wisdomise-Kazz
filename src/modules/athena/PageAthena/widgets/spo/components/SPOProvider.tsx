import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { coinColors } from '../constants';
import { type Risk, type SPOContext } from '../types';
import { useSPOQuery } from '../useSPOQuery';

export interface Props {
  riskType?: 'low' | 'medium' | 'high';
}

export const SPOProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  riskType,
  ...props
}) => {
  const [risk, setRisk] = useState<Risk>(riskType ?? 'low');
  const spo = useSPOQuery(risk);
  const [coins, setCoins] = useState<SPOContext['coins']>([]);

  useEffect(() => {
    if (spo.data) {
      setCoins(
        spo.data?.coins.map((row, i) => ({
          fullAsset: row.asset,
          color: coinColors[i],
          weight: Number((row.weight * 100).toFixed(2)),
          asset: row.asset.replace('USDT', '').replace('BUSD', 'USD'),
        })),
      );
    }
  }, [spo.data]);

  return (
    <context.Provider
      value={{
        risk,
        coins,
        setRisk,
        ...props,
        isRefetching: spo.isRefetching,
        performancePercentageMaxDD:
          spo.data?.metrics?.performance_percentage_max_dd ?? 0.1,
      }}
    >
      {spo.data && children}
    </context.Provider>
  );
};

const context = createContext<SPOContext | null>(null);

export const useSPO = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('SPO context not found');
  }
  return ctx;
};
