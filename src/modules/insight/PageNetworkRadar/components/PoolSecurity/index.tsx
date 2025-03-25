import { clsx } from 'clsx';
import { type ReactNode, useMemo, type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { type NetworkRadarPool } from 'api/insight/network';
import { ReactComponent as MintIcon } from './mint.svg';
import { ReactComponent as FreezeIcon } from './freeze.svg';
import { ReactComponent as FireIcon } from './fire.svg';
import { ReactComponent as UserIcon } from './user.svg';

export const PoolSecurity: FC<{
  className?: string;
  imgClassName?: string;
  value?: NetworkRadarPool | null;
  type: 'grid' | 'row' | 'card';
}> = ({ className, imgClassName, value, type }) => {
  const { t } = useTranslation('network-radar');

  const items = useMemo(() => {
    let ret: Array<{
      key: string;
      icon: FC<{ className?: string }>;
      title: ReactNode;
      value: boolean;
    }> = [];

    // Mintable
    const mintAuth = value?.base_symbol_security.mintable.status === '0';
    ret = [
      ...ret,
      {
        key: 'mint_auth',
        value: mintAuth,
        icon: MintIcon,
        title: <Trans i18nKey="security.mint_auth" ns="network-radar" />,
      },
    ];

    // Freezable
    const freezAuth = value?.base_symbol_security.freezable.status === '0';
    ret = [
      ...ret,
      {
        key: 'freeze_auth',
        value: freezAuth,
        icon: FreezeIcon,
        title: <Trans i18nKey="security.freeze_auth" ns="network-radar" />,
      },
    ];

    // Lp Is Burned
    const lpIsBurned = value?.base_symbol_security.lp_is_burned.status === '1';
    ret = [
      ...ret,
      {
        key: 'lp_is_burned',
        value: lpIsBurned,
        icon: FireIcon,
        title: <Trans i18nKey="security.lp_burned" ns="network-radar" />,
      },
    ];

    // Top 10 Holders
    const topHoldersBalance =
      value?.base_symbol_security.holders.reduce((p, c) => {
        const balance = Number.isNaN(+c.balance) ? 0 : +c.balance;
        return p + balance;
      }, 0) ?? 0;
    const totalSupply = value?.update.base_market_data.total_supply ?? 0;
    const topHoldersAuth = topHoldersBalance <= (totalSupply / 100) * 20;
    ret = [
      ...ret,
      {
        key: 'top_holders_auth',
        value: topHoldersAuth,
        icon: UserIcon,
        title: <Trans i18nKey="security.top_holders" ns="network-radar" />,
      },
    ];
    return ret;
  }, [value]);

  return (
    <>
      {type === 'grid' ? (
        <div className={clsx('grid grid-cols-2 gap-1', className)}>
          {items.map(item => (
            <div
              key={item.key}
              className={clsx(
                'relative flex shrink-0 items-center justify-center rounded-full',
                item.value
                  ? 'bg-v1-background-positive fill-v1-background-positive-subtle stroke-v1-background-positive-subtle'
                  : 'bg-v1-background-negative fill-v1-background-negative-subtle stroke-v1-background-negative-subtle',
                imgClassName,
              )}
            >
              <item.icon className={clsx('size-full scale-75')} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={clsx(
            'rounded-lg p-2 text-xs bg-v1-surface-l-next',
            className,
          )}
        >
          <p className="mb-2 font-normal">{t('common.validation_insights')}</p>
          <div className="grid grid-cols-4 grid-rows-1 gap-1">
            {items.map(item => (
              <div
                key={item.key}
                className="flex flex-col items-center gap-1 text-center"
              >
                <div
                  className={clsx(
                    'relative flex items-center justify-center rounded-full',
                    item.value
                      ? 'bg-v1-background-positive fill-v1-background-positive-subtle stroke-v1-background-positive-subtle'
                      : 'bg-v1-background-negative fill-v1-background-negative-subtle stroke-v1-background-negative-subtle',
                    imgClassName,
                  )}
                >
                  <item.icon className={clsx('size-[85%]')} />
                </div>
                <p
                  className={clsx(
                    'font-normal leading-4',
                    !item.value && 'text-v1-content-secondary',
                  )}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
