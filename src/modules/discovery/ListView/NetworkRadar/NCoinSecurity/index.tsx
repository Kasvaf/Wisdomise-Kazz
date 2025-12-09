import { clsx } from 'clsx';
import { type FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReactComponent as FireIcon } from './fire.svg';
import { ReactComponent as FreezeIcon } from './freeze.svg';
import { ReactComponent as MintIcon } from './mint.svg';
import { ReactComponent as UserIcon } from './user.svg';

export const NCoinSecurity: FC<{
  className?: string;
  imgClassName?: string;
  value?: {
    mintable?: boolean;
    freezable?: boolean;
    lpBurned?: boolean;
    safeTopHolders?: boolean;
  } | null;
  type: 'grid' | 'row' | 'row2' | 'card';
}> = memo(({ className, imgClassName, value, type }) => {
  const { t } = useTranslation('network-radar');

  const items = useMemo(() => {
    let ret: Array<{
      key: string;
      icon: FC<{ className?: string }>;
      title: string;
      value: boolean;
    }> = [];

    // Mintable
    if (typeof value?.mintable === 'boolean') {
      ret = [
        ...ret,
        {
          key: 'mint_auth',
          value: !value?.mintable,
          icon: MintIcon,
          title: t('network-radar:security.mint_auth'),
        },
      ];
    }

    // Freezable
    if (typeof value?.freezable === 'boolean') {
      ret = [
        ...ret,
        {
          key: 'freeze_auth',
          value: !value?.freezable,
          icon: FreezeIcon,
          title: t('network-radar:security.freeze_auth'),
        },
      ];
    }

    // Lp Is Burned
    if (typeof value?.lpBurned === 'boolean') {
      ret = [
        ...ret,
        {
          key: 'lp_is_burned',
          value: !!value?.lpBurned,
          icon: FireIcon,
          title: 'LP Burned',
        },
      ];
    }

    // Top 10 Holders
    if (typeof value?.safeTopHolders === 'boolean') {
      ret = [
        ...ret,
        {
          key: 'top_holders_auth',
          value: !!value?.safeTopHolders,
          icon: UserIcon,
          title: t('network-radar:security.top_holders'),
        },
      ];
    }
    return ret;
  }, [value, t]);

  return (
    <>
      {type === 'grid' ? (
        <div className={clsx('grid grid-cols-2 grid-rows-2 gap-1', className)}>
          {items.map(item => (
            <div
              className={clsx(
                'relative flex shrink-0 items-center justify-center rounded-full',
                item.value
                  ? 'bg-v1-background-positive fill-v1-background-positive-subtle stroke-v1-background-positive-subtle'
                  : 'bg-v1-background-negative fill-v1-background-negative-subtle stroke-v1-background-negative-subtle',
                imgClassName,
              )}
              key={item.key}
            >
              <item.icon className={clsx('size-full scale-75')} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={clsx(
            'text-xs',
            type === 'card' && 'rounded-lg bg-v1-surface-l-next p-2',
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
                placement="bottom"
                title={item.title}
              >
                <div className={clsx('flex items-center gap-2 text-center')}>
                  <div
                    className={clsx(
                      'relative flex items-center justify-center rounded-full',
                      item.value
                        ? 'bg-v1-background-positive fill-v1-background-positive-subtle stroke-v1-background-positive-subtle'
                        : 'bg-v1-background-negative fill-v1-background-negative-subtle stroke-v1-background-negative-subtle',
                      imgClassName,
                    )}
                  >
                    <item.icon className={clsx('size-full scale-75')} />
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
                </div>
              </HoverTooltip>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
