import { bxGridAlt, bxSliderAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import { type Surface } from 'utils/useSurface';

function areEqual<T = Array<string | number> | string | number | boolean>(
  first: T | undefined,
  second: T | undefined,
) {
  const isArray = Array.isArray(first) || Array.isArray(second);
  const isBoolean = typeof first === 'boolean' || typeof second === 'boolean';
  if (isBoolean) {
    return (first ?? false) === (second ?? false);
  }
  if (isArray) {
    const firstArr = Array.isArray(first) ? first : [];
    const secondArr = Array.isArray(second) ? second : [];
    return (
      firstArr.length === secondArr.length &&
      firstArr.every(x => secondArr.includes(x as never))
    );
  }
  return first === second;
}

export function Filters<T extends object>({
  presets,
  sorts,
  value,
  onChange,
  dialog,
  mini,
  className,
  surface,
}: {
  presets?: Array<{
    value: Partial<T>;
    label: ReactNode;
  }>;
  sorts?: Array<{
    value: Partial<T>;
    label: ReactNode;
  }>;
  value: Partial<T>;
  onChange?: (
    newValue: Partial<T>,
    initiatedBy: 'presets' | 'sorts' | 'manual',
  ) => void;
  dialog?: (
    value: Partial<T>,
    setValue: Dispatch<SetStateAction<Partial<T>>>,
  ) => ReactNode;
  className?: string;
  mini?: boolean;
  surface: Surface;
}) {
  const { t } = useTranslation('coin-radar');
  const isMobile = useIsMobile();
  const isMini = typeof mini === 'boolean' ? mini : isMobile;
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const selectedPreset = useMemo(() => {
    return (
      value &&
      presets?.find(({ value: presetValue }) => {
        return Object.entries(presetValue).every(([fieldKey, fieldValue]) =>
          areEqual(fieldValue, value[fieldKey as keyof typeof value]),
        );
      })
    );
  }, [presets, value]);

  const isFiltersApplied = useMemo(
    () =>
      Object.entries(value ?? {}).some(
        ([, fieldValue]) => fieldValue !== undefined,
      ),
    [value],
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={clsx('flex w-full gap-4', isMini && 'flex-col', className)}>
      <div className={clsx('min-w-64 max-w-max', isMini && 'w-full')}>
        <p className="mb-1 text-xs">{t('common:filtered-by')}</p>
        <div className="flex items-start gap-2">
          {dialog && (
            <Button
              variant={
                isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'
              }
              size={isMini ? 'sm' : 'md'}
              className={isMini ? 'w-sm' : 'w-md'}
              onClick={() => setOpen(true)}
              surface={isMini ? ((surface + 1) as never) : surface}
            >
              <Icon name={bxSliderAlt} size={16} />
            </Button>
          )}
          <Button
            variant={!isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'}
            size={isMini ? 'sm' : 'md'}
            onClick={() => onChange?.({}, 'presets')}
            surface={isMini ? ((surface + 1) as never) : surface}
          >
            <Icon name={bxGridAlt} size={16} />
            {t('common:all')}
          </Button>
          {(presets?.length ?? 0) > 0 && (
            <ButtonSelect
              options={presets ?? []}
              value={
                isFiltersApplied && !selectedPreset
                  ? undefined
                  : selectedPreset?.value
              }
              onChange={newPresetFilter =>
                onChange?.(newPresetFilter, 'presets')
              }
              size={isMini ? 'sm' : 'md'}
              variant="primary"
              surface={surface}
            />
          )}
        </div>
      </div>
      {(sorts?.length ?? 0) > 0 && (
        <div className={clsx('w-1/2 min-w-48 max-w-max', isMini && 'w-full')}>
          <p className="mb-1 text-xs">{t('common:sorted-by')}</p>
          <ButtonSelect
            options={sorts ?? []}
            value={
              isFiltersApplied && !selectedPreset
                ? undefined
                : selectedPreset?.value
            }
            onChange={newSortFilter => onChange?.(newSortFilter, 'sorts')}
            size={isMini ? 'sm' : 'md'}
            variant="primary"
            surface={surface}
          />
        </div>
      )}
      {dialog !== undefined && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className={clsx('w-[500px]', isMobile && 'w-auto')}
          contentClassName="p-3"
          mode={isMobile ? 'drawer' : 'modal'}
          drawerConfig={{
            position: 'bottom',
            closeButton: true,
          }}
          modalConfig={{
            closeButton: true,
          }}
          surface={2}
          header={t('common:filters')}
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                block
                onClick={() => {
                  setOpen(false);
                }}
                className="shrink-0 grow"
              >
                {t('common:actions.cancel')}
              </Button>
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => {
                  onChange?.(localValue, 'manual');
                  setOpen(false);
                }}
                className="shrink-0 grow"
              >
                {t('common:apply_filters')}
              </Button>
            </div>
          }
        >
          {dialog?.(localValue, setLocalValue)}
        </Dialog>
      )}
    </div>
  );
}
