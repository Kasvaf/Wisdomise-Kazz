import { useEffect, useState, type FC, type PropsWithChildren } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type TraderProfile } from 'api';
import PriceChange from 'shared/PriceChange';

const PerformanceItem: FC<
  PropsWithChildren<{
    label: string;
    className?: string;
  }>
> = ({ label, className, children }) => (
  <div
    className={clsx(
      'flex min-w-48 shrink-0 grow basis-0 flex-col items-center justify-between gap-3 rounded-lg bg-black/30 p-3',
      className,
    )}
  >
    <h3 className="text-xs font-light">{label}</h3>
    <div>{children}</div>
  </div>
);

const useAutoResetState = (initialState: unknown) => {
  const state = useState(initialState);
  const [currentState, setState] = state;
  useEffect(() => {
    if (currentState === initialState) return;
    const timeout = setTimeout(() => {
      setState(initialState);
    }, 10);
    return () => clearTimeout(timeout);
  }, [currentState, initialState, setState]);
  return state;
};

export const PerformanceContent: FC<{
  className?: string;
  data?: TraderProfile['performance']['week'];
}> = ({ className, data }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useAutoResetState(true);
  useEffect(() => {
    setIsVisible(false);
  }, [data, setIsVisible]);

  return (
    <div
      className={clsx(
        'flex items-start gap-4',
        isVisible ? 'transition-all duration-500' : 'opacity-0',
        className,
      )}
    >
      <PerformanceItem label={t('users:page-profile.performance-content.pl')}>
        <PriceChange
          value={data?.pnl || 0}
          colorize
          valueToFixed
          textClassName="!text-lg !font-bold"
        />
      </PerformanceItem>
      <PerformanceItem
        label={t('users:page-profile.performance-content.positions')}
      >
        <b className="!text-lg !font-bold">{data?.positions || 0}</b>
      </PerformanceItem>
      <PerformanceItem
        label={t('users:page-profile.performance-content.max_drawdown')}
      >
        <PriceChange
          value={data?.max_drawdown || 0}
          valueToFixed
          textClassName="!text-lg !font-bold"
        />
      </PerformanceItem>
    </div>
  );
};
