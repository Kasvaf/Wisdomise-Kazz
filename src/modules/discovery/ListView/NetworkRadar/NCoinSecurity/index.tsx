import { clsx } from 'clsx';
import { type ReactNode, useMemo, type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReactComponent as MintIcon } from './mint.svg';
import { ReactComponent as FreezeIcon } from './freeze.svg';
import { ReactComponent as FireIcon } from './fire.svg';
import { ReactComponent as UserIcon } from './user.svg';

export const NCoinSecurity: FC<{
  className?: string;
  imgClassName?: string;
  value?: {
    mintable: boolean;
    freezable: boolean;
    lpBurned: boolean;
    safeTopHolders: boolean;
  } | null;
  type: 'grid' | 'row' | 'row2' | 'card';
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
    ret = [
      ...ret,
      {
        key: 'mint_auth',
        value: !value?.mintable,
        icon: MintIcon,
        title: <Trans i18nKey="security.mint_auth" ns="network-radar" />,
      },
    ];

    // Freezable
    ret = [
      ...ret,
      {
        key: 'freeze_auth',
        value: !value?.freezable,
        icon: FreezeIcon,
        title: <Trans i18nKey="security.freeze_auth" ns="network-radar" />,
      },
    ];

    // Lp Is Burned
    ret = [
      ...ret,
      {
        key: 'lp_is_burned',
        value: !!value?.lpBurned,
        icon: FireIcon,
        title: <Trans i18nKey="security.lp_burned" ns="network-radar" />,
      },
    ];

    // Top 10 Holders
    ret = [
      ...ret,
      {
        key: 'top_holders_auth',
        value: !!value?.safeTopHolders,
        icon: UserIcon,
        title: <Trans i18nKey="security.top_holders" ns="network-radar" />,
      },
    ];
    return ret;
  }, [value]);

  return (
    <>
      {type === 'grid' ? (
        <div className={clsx('grid grid-cols-2 grid-rows-2 gap-1', className)}>
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
            'text-xs',
            type === 'card' && 'rounded-lg p-2 bg-v1-surface-l-next',
            className,
          )}
        >
          {type === 'card' && (
            <p className="mb-2 font-normal">
              {t('common.validation_insights')}
            </p>
          )}
          <div
            className={clsx(
              '',
              type === 'card'
                ? 'grid grid-cols-4 grid-rows-1 gap-1'
                : [
                    'flex items-start',
                    type === 'row' ? 'gap-1' : 'justify-between gap-6',
                  ],
            )}
          >
            {items.map(item => (
              <HoverTooltip
                key={item.key}
                className={clsx('flex items-center gap-2 text-center')}
                title={item.title}
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
                {type !== 'row' && (
                  <p
                    className={clsx(
                      'whitespace-nowrap font-normal leading-snug',
                      !item.value && 'text-v1-content-secondary',
                    )}
                  >
                    {item.title}
                  </p>
                )}
              </HoverTooltip>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
