import { bxRotateLeft } from 'boxicons-quasar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { Filters } from 'modules/discovery/ListView/Filters';
import type { MetaFilters } from 'modules/discovery/PageMeta/index';
import type { MetaTab } from 'modules/discovery/PageMeta/lib';
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useMemo,
  useState,
} from 'react';
import Icon from 'shared/Icon';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Input } from 'shared/v1-components/Input';

export default function MetaTabsFilters({
  initialTab,
}: {
  initialTab: MetaTab;
}) {
  const { settings, updateMetaFilters } = useUserSettings();
  const [tab, setTab] = useState<MetaTab>(initialTab);

  return (
    <Filters
      className="w-min"
      dialog={(value, setValue) => (
        <div>
          <div>
            <ButtonSelect
              onChange={setTab}
              options={[
                {
                  value: 'new',
                  label: (
                    <FiltersTab
                      activeTab={tab}
                      label="New Meta"
                      onReset={setValue}
                      state={value}
                      value="new"
                    />
                  ),
                },
                {
                  value: 'trend',
                  label: (
                    <FiltersTab
                      activeTab={tab}
                      label="Trend"
                      onReset={setValue}
                      state={value}
                      value="trend"
                    />
                  ),
                },
                {
                  value: 'high_mc',
                  label: (
                    <FiltersTab
                      activeTab={tab}
                      label="High MC"
                      onReset={setValue}
                      state={value}
                      value="high_mc"
                    />
                  ),
                },
              ]}
              size="sm"
              value={tab}
              variant="white"
            />
          </div>

          <div className="mt-5 flex flex-col items-start gap-2">
            <p className="text-xs">Total MarketCap ($)</p>
            <div className="flex w-full items-center gap-3">
              <Input
                block
                className="basis-1/2"
                min={0}
                onChange={min =>
                  setValue(p => ({
                    ...p,
                    [tab]: {
                      ...p[tab],
                      minTotalMarketCap: min,
                    },
                  }))
                }
                placeholder="Min"
                size="sm"
                type="number"
                value={value[tab]?.minTotalMarketCap}
              />
              <Input
                block
                className="basis-1/2"
                min={0}
                onChange={max =>
                  setValue(p => ({
                    ...p,
                    [tab]: {
                      ...p[tab],
                      maxTotalMarketCap: max,
                    },
                  }))
                }
                placeholder="Max"
                size="sm"
                type="number"
                value={value[tab]?.maxTotalMarketCap}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-start gap-2">
            <p className="text-xs">Total Volume ($)</p>
            <div className="flex w-full items-center gap-3">
              <Input
                block
                className="basis-1/2"
                min={0}
                onChange={min =>
                  setValue(p => ({
                    ...p,
                    [tab]: {
                      ...p[tab],
                      minTotalVolume: min,
                    },
                  }))
                }
                placeholder="Min"
                size="sm"
                type="number"
                value={value[tab]?.minTotalVolume}
              />
              <Input
                block
                className="basis-1/2"
                min={0}
                onChange={max =>
                  setValue(p => ({
                    ...p,
                    [tab]: {
                      ...p[tab],
                      maxTotalVolume: max,
                    },
                  }))
                }
                placeholder="Max"
                size="sm"
                type="number"
                value={value[tab]?.maxTotalVolume}
              />
            </div>
          </div>
        </div>
      )}
      mini
      onChange={updateMetaFilters}
      resetValue={{ new: {}, trend: {}, high_mc: {} }}
      size="xs"
      value={settings.meta.filters}
    />
  );
}

const FiltersTab: FC<{
  state?: Partial<MetaFilters>;
  onReset: Dispatch<SetStateAction<Partial<MetaFilters>>>;
  label: ReactNode;
  value: MetaTab;
  activeTab: MetaTab;
}> = ({ state, onReset, label, value, activeTab }) => {
  const hasCustomFilters = useMemo(
    () => Object.entries(state?.[value] ?? {}).some(([, val]) => !!val),
    [state, value],
  );
  return (
    <div className="flex items-center gap-2">
      {label}
      {hasCustomFilters && '*'}{' '}
      {hasCustomFilters && (
        <button
          onClick={() => {
            if (value !== activeTab) return;
            onReset(p => ({ ...p, [value]: {} }));
          }}
          type="button"
        >
          <Icon name={bxRotateLeft} size={18} />
        </button>
      )}
    </div>
  );
};
