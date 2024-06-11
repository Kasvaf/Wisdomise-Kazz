import { bxLock } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';

const ValuesRow: React.FC<
  PropsWithChildren<{
    values: Array<{
      label: string;
      value?: string | number | null;
      isMuted?: boolean;
      isLocked?: boolean;
    }>;
    className?: string;
  }>
> = ({ values, className, children }) => {
  const { t } = useTranslation('strategy');
  return (
    <div className={clsx('flex items-center gap-2 px-3', className)}>
      <div className="flex grow flex-col items-center justify-center">
        {values.map(v => (
          <div key={v.label} className="flex w-full items-center justify-start">
            <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
              {v.label}
            </span>
            <div className="mx-1 grow basis-auto border-t border-white/5" />
            <span
              className={clsx(
                'grow-0 basis-auto text-xs text-white/90',
                v.isMuted && '!text-white/20',
              )}
            >
              {v.isLocked ? (
                <span className="flex items-center text-white/40">
                  <Icon name={bxLock} size={12} className="!inline-block" />
                  {t('matrix.locked')}
                </span>
              ) : (
                v.value ?? (
                  <span className="text-white/20">{t('matrix.none')}</span>
                )
              )}
            </span>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default ValuesRow;
