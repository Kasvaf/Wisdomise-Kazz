import { bxGridAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import type { Surface } from 'utils/useSurface';
import { ReactComponent as FilterIcon } from './filter.svg';
import type { PresetFilter } from './presetFilters';

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
  surface = 2,
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
    return [...new Set(sorts?.flatMap(x => Object.keys(x.filters)))] as Array<
      keyof T
    >;
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
              className="shrink-0"
              fab
              onClick={() => {
                onOpen?.();
                setOpen(true);
              }}
              size={size}
              surface={isMini ? ((surface + 1) as never) : surface}
              variant={
                isFiltersApplied && !selectedPreset && showLabels
                  ? 'primary'
                  : 'ghost'
              }
            >
              <FilterIcon className="!size-4" />
            </Button>
          )}
          {(presets?.length ?? 0) > 0 && (
            <>
              <Button
                className="shrink-0"
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
                size={size}
                surface={isMini ? ((surface + 1) as never) : surface}
                variant={
                  !isFiltersApplied && !selectedPreset ? 'primary' : 'ghost'
                }
              >
                <Icon name={bxGridAlt} size={16} />
                {t('common:all')}
              </Button>
              <ButtonSelect
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
                options={(presets ?? []).map(preset => ({
                  label: preset.label,
                  value: preset.filters,
                }))}
                size={size}
                surface={surface}
                value={
                  isFiltersApplied && !selectedPreset
                    ? undefined
                    : selectedPreset?.filters
                }
                variant="primary"
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
            options={(sorts ?? []).map(sort => ({
              label: sort.label,
              value: sort.filters,
            }))}
            size={size}
            surface={surface}
            value={selectedSort?.filters}
            variant="default"
          />
        </div>
      )}
      {dialog !== undefined && (
        <Dialog
          contentClassName="p-4 w-[500px] mobile:w-auto"
          drawerConfig={{
            position: 'bottom',
            closeButton: true,
          }}
          footer={
            <div className="flex items-center gap-2">
              <Button
                block
                className="shrink-0 grow"
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
                size="lg"
                surface={2}
                variant="ghost"
              >
                {t('common:reset_filters')}
              </Button>
              <Button
                block
                className="shrink-0 grow"
                onClick={() => {
                  onChange?.(localValue);
                  setOpen(false);
                }}
                size="lg"
                variant="primary"
              >
                {t('common:apply_filters')}
              </Button>
            </div>
          }
          header={<h2 className="p-2 text-lg">{t('common:filters')}</h2>}
          modalConfig={{
            closeButton: true,
          }}
          mode={isMobile ? 'drawer' : 'modal'}
          onClose={() => setOpen(false)}
          open={open}
        >
          <div className="flex flex-col gap-6">
            {dialog?.(localValue, setLocalValue)}
          </div>
        </Dialog>
      )}
    </div>
  );
}
