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
import { type PresetFilter } from './presetFilters';

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
  excludeKeys,
  value,
  onChange,
  dialog,
  mini,
  size: _size,
  className,
  surface = 3,
  onOpen,
}: {
  presets?: Array<PresetFilter<T>>;
  sorts?: Array<PresetFilter<T>>;
  excludeKeys?: Array<keyof T>;
  value: Partial<T>;
  onChange?: (newValue: Partial<T>) => void;
  dialog?: (
    value: Partial<T>,
    setValue: Dispatch<SetStateAction<Partial<T>>>,
  ) => ReactNode;
  className?: string;
  mini?: boolean;
  size?: 'xs' | 'sm' | 'md';
  surface?: Surface;
  onOpen?: () => void;
}) {
  const { t } = useTranslation('coin-radar');
  const isMobile = useIsMobile();
  const isMini = typeof mini === 'boolean' ? mini : isMobile;
  const size = _size ?? (isMini ? 'sm' : 'md');
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const showLabels = (presets?.length ?? 0) > 0 || (sorts?.length ?? 0) > 0;

  const sortKeys = useMemo(() => {
    return [
      ...new Set(sorts?.map(x => Object.keys(x.filters)).flat()),
    ] as Array<keyof T>;
  }, [sorts]);

  const selectedPreset = useMemo(() => {
    return (
      value &&
      presets?.find(({ filters: presetFilters }) => {
        return (
          Object.entries(presetFilters).every(([fieldKey, fieldValue]) =>
            areEqual(fieldValue, value[fieldKey as keyof typeof value]),
          ) &&
          areEqual(
            Object.keys(value).filter(
              k =>
                !sortKeys.includes(k as never) &&
                !excludeKeys?.includes(k as never),
            ),
            Object.keys(presetFilters).sort(),
          )
        );
      })
    );
  }, [excludeKeys, presets, sortKeys, value]);

  const selectedSort = useMemo(() => {
    return (
      value &&
      sorts?.find(({ filters: sortFilters }) => {
        return (
          Object.entries(sortFilters).every(([fieldKey, fieldValue]) =>
            areEqual(fieldValue, value[fieldKey as keyof typeof value]),
          ) &&
          areEqual(
            Object.keys(value).filter(k => sortKeys.includes(k as never)),
            Object.keys(sortFilters).sort(),
          )
        );
      })
    );
  }, [sortKeys, sorts, value]);

  const isFiltersApplied = useMemo(
    () =>
      Object.entries(value ?? {}).some(
        ([fieldKey, fieldValue]) =>
          !sortKeys.includes(fieldKey as never) &&
          !excludeKeys?.includes(fieldKey as never) &&
          fieldValue !== undefined,
      ),
    [excludeKeys, sortKeys, value],
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={clsx('flex w-full gap-4', isMini && 'flex-col', className)}>
      <div className={clsx('max-w-max', isMini ? 'w-full' : 'min-w-64')}>
        {showLabels && (
          <p className="mb-1 text-xs">{t('common:filtered-by')}</p>
        )}
        <div className="flex items-start gap-2">
          {dialog && (
            <Button
              variant={
                isFiltersApplied && !selectedPreset && showLabels
                  ? 'primary'
                  : 'ghost'
              }
              size={size}
              fab
              onClick={() => {
                onOpen?.();
                setOpen(true);
              }}
              surface={isMini ? ((surface + 1) as never) : surface}
            >
              <Icon name={bxSliderAlt} size={16} />
            </Button>
          )}
          {(presets?.length ?? 0) > 0 && (
            <>
              <Button
                variant={
                  !isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'
                }
                size={size}
                onClick={() => {
                  onChange?.(
                    Object.fromEntries(
                      Object.entries(localValue).filter(
                        ([k]) =>
                          sortKeys.includes(k as never) ||
                          excludeKeys?.includes(k as never),
                      ),
                    ) as Partial<T>,
                  );
                }}
                surface={isMini ? ((surface + 1) as never) : surface}
              >
                <Icon name={bxGridAlt} size={16} />
                {t('common:all')}
              </Button>
              <ButtonSelect
                options={(presets ?? []).map(preset => ({
                  label: preset.label,
                  value: preset.filters,
                }))}
                value={
                  isFiltersApplied && !selectedPreset
                    ? undefined
                    : selectedPreset?.filters
                }
                onChange={newPresetFilter =>
                  onChange?.({
                    ...(Object.fromEntries(
                      Object.entries(localValue).filter(([k]) =>
                        sortKeys.includes(k as never),
                      ),
                    ) as Partial<T>),
                    ...newPresetFilter,
                  })
                }
                size={size}
                variant="primary"
                surface={surface}
              />
            </>
          )}
        </div>
      </div>
      {(sorts?.length ?? 0) > 0 && (
        <div className={clsx('w-1/2 min-w-48 max-w-max', isMini && 'w-full')}>
          {showLabels && (
            <p className="mb-1 text-xs">{t('common:sorted-by')}</p>
          )}
          <ButtonSelect
            options={(sorts ?? []).map(sort => ({
              label: sort.label,
              value: sort.filters,
            }))}
            value={selectedSort?.filters}
            onChange={newSortFilter =>
              onChange?.({
                ...(Object.fromEntries(
                  Object.entries(localValue).filter(
                    ([k]) => !sortKeys.includes(k as never),
                  ),
                ) as Partial<T>),
                ...newSortFilter,
              })
            }
            size={size}
            variant="default"
            surface={surface}
          />
        </div>
      )}
      {dialog !== undefined && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          contentClassName="p-4 w-[500px] mobile:w-auto"
          mode={isMobile ? 'drawer' : 'modal'}
          drawerConfig={{
            position: 'bottom',
            closeButton: true,
          }}
          modalConfig={{
            closeButton: true,
          }}
          surface={2}
          header={<h2 className="p-2 text-lg">{t('common:filters')}</h2>}
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                block
                onClick={() => {
                  onChange?.(
                    Object.fromEntries(
                      Object.entries(localValue).filter(
                        ([k]) =>
                          sortKeys.includes(k as never) ||
                          excludeKeys?.includes(k as never),
                      ),
                    ) as Partial<T>,
                  );
                  setOpen(false);
                }}
                className="shrink-0 grow"
              >
                {t('common:reset_filters')}
              </Button>
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => {
                  onChange?.(localValue);
                  setOpen(false);
                }}
                className="shrink-0 grow"
              >
                {t('common:apply_filters')}
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-6">
            {dialog?.(localValue, setLocalValue)}
          </div>
        </Dialog>
      )}
    </div>
  );
}
