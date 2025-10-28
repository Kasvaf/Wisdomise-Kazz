import { useGrpc } from 'api/grpc-v2';
import { bxRotateLeft, bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
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
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Input } from 'shared/v1-components/Input';
import { hasAnyValue } from 'utils/object';
import { Filters } from '../Filters';
import type { NetworkRadarStreamFilters, NetworkRadarTab } from './lib';

const FiltersTab: FC<{
  state?: Partial<NetworkRadarStreamFilters>;
  onReset: Dispatch<SetStateAction<Partial<NetworkRadarStreamFilters>>>;
  label: ReactNode;
  value: NetworkRadarTab;
  activeTab: NetworkRadarTab;
}> = ({ state, onReset, label, value, activeTab }) => {
  const hasCustomFilters = useMemo(
    () =>
      Object.entries(state?.[value] ?? {}).some(([, val]) =>
        typeof val === 'object' && Array.isArray(val)
          ? val.length > 0 && val.every(x => !!x)
          : !!val,
      ),
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

export const NetworkRadarFilters: FC<{
  initialTab: NetworkRadarTab;
  searchShortcut?: boolean;
}> = ({ initialTab, searchShortcut, ...props }) => {
  const { settings, updateTrenchFilters } = useUserSettings();
  const [tab, setTab] = useState<NetworkRadarTab>(initialTab);

  const [subTab, setSubTab] = useState<'audit' | 'metrics' | 'socials'>(
    'audit',
  );

  const { data: protocols } = useGrpc({
    service: 'network_radar',
    method: 'trenchProtocols',
    payload: {},
    enabled: true,
    history: 0,
  });
  const currentTabProtocols = useMemo(() => {
    return (
      (tab === 'final_stretch'
        ? protocols?.finalStretchProtocols
        : tab === 'migrated'
          ? protocols?.migratedProtocols
          : protocols?.newBornProtocols) ?? []
    );
  }, [tab, protocols]);

  const isFiltersApplied = useMemo(() => {
    return hasAnyValue(settings.trench_filters[initialTab]);
  }, [settings.trench_filters, initialTab]);

  return (
    <>
      {searchShortcut && (
        <Input
          className="!px-2 absolute right-9 z-10 w-9 focus-within:w-72 focus-within:px-3"
          onChange={newVal =>
            updateTrenchFilters({
              ...settings.trench_filters,
              [initialTab]: {
                ...settings.trench_filters[initialTab],
                searchKeywords: newVal.split(','),
              },
            })
          }
          placeholder="Search by Name/Address (2+ chars)"
          prefixIcon={<Icon name={bxSearch} />}
          size="xs"
          surface={2}
          type="string"
          value={
            settings.trench_filters[initialTab]?.searchKeywords?.join(',') ?? ''
          }
        />
      )}
      <Filters
        className="w-min"
        dialog={(state, setState) => (
          <>
            {/* Tab */}
            <div>
              <ButtonSelect
                onChange={setTab}
                options={[
                  {
                    value: 'new_pairs',
                    label: (
                      <FiltersTab
                        activeTab={tab}
                        label="New Pairs"
                        onReset={setState}
                        state={state}
                        value="new_pairs"
                      />
                    ),
                  },
                  {
                    value: 'final_stretch',
                    label: (
                      <FiltersTab
                        activeTab={tab}
                        label="Final Stretch"
                        onReset={setState}
                        state={state}
                        value="final_stretch"
                      />
                    ),
                  },
                  {
                    value: 'migrated',
                    label: (
                      <FiltersTab
                        activeTab={tab}
                        label="Migrated"
                        onReset={setState}
                        state={state}
                        value="migrated"
                      />
                    ),
                  },
                ]}
                size="md"
                value={tab}
                variant="white"
              />
            </div>
            {/* <div className="border-b border-white/10" /> */}

            {/* Protocols */}
            {currentTabProtocols.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <p className="text-xs">{'Protocols'}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {currentTabProtocols.map(protocol => (
                      <Checkbox
                        block
                        key={protocol.name}
                        label={
                          <>
                            <img
                              className={clsx(
                                'size-4 rounded-sm',
                                !state[tab]?.protocols?.includes(
                                  protocol.name,
                                ) && 'opacity-75',
                              )}
                              src={protocol.logo}
                            />
                            <img
                              className={clsx(
                                'absolute w-full blur-2xl brightness-100 contrast-200 saturate-200',
                                state[tab]?.protocols?.includes(protocol.name)
                                  ? 'opacity-30'
                                  : 'opacity-0',
                              )}
                              src={protocol.logo}
                            />
                            <span className="relative truncate">
                              {protocol.name}
                            </span>
                          </>
                        }
                        onChange={val =>
                          setState(p => ({
                            ...p,
                            [tab]: {
                              ...p[tab],
                              protocols: [
                                ...(p[tab]?.protocols?.filter(
                                  x => x !== protocol.name,
                                ) ?? []),
                                ...(val ? [protocol.name] : []),
                              ],
                            },
                          }))
                        }
                        size="md"
                        surface={3}
                        value={state[tab]?.protocols?.includes(protocol.name)}
                        variant="button"
                      />
                    ))}
                  </div>
                </div>
                <div className="border-white/10 border-b" />
              </>
            )}

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="flex basis-1/2 flex-col gap-2">
                <p className="text-xs">{'Search Keywords'}</p>
                <Input
                  block
                  className="w-full"
                  onChange={newVal =>
                    setState?.({
                      ...state,
                      [tab]: {
                        ...state[tab],
                        searchKeywords: newVal ? newVal.split(',') : undefined,
                      },
                    })
                  }
                  placeholder="Keyword 1, Keyword 2..."
                  size="md"
                  type="string"
                  value={state[tab]?.searchKeywords?.join(',') ?? ''}
                />
              </div>
              <div className="flex basis-1/2 flex-col gap-2">
                <p className="text-xs">{'Exclude Keywords'}</p>
                <Input
                  block
                  className="w-full"
                  onChange={newVal =>
                    setState?.({
                      ...state,
                      [tab]: {
                        ...state[tab],
                        excludeKeywords: newVal ? newVal.split(',') : undefined,
                      },
                    })
                  }
                  placeholder="Keyword 1, Keyword 2..."
                  size="md"
                  type="string"
                  value={state[tab]?.excludeKeywords?.join(',') ?? ''}
                />
              </div>
            </div>
            <div className="border-white/10 border-b" />

            {/* B Curve */}
            <div className="flex flex-col items-start gap-2">
              <p className="text-xs">{'B Curve %'}</p>
              <div className="flex w-full items-center gap-3">
                <Input
                  block
                  className="basis-1/2"
                  max={state[tab]?.maxBoundingCurve ?? 100}
                  min={0}
                  onChange={minBoundingCurve =>
                    setState(p => ({
                      ...p,
                      [tab]: { ...p[tab], minBoundingCurve },
                    }))
                  }
                  placeholder="Min"
                  size="md"
                  type="number"
                  value={state[tab]?.minBoundingCurve}
                />
                <Input
                  block
                  className="basis-1/2"
                  max={100}
                  onChange={maxBoundingCurve =>
                    setState(p => ({
                      ...p,
                      [tab]: { ...p[tab], maxBoundingCurve },
                    }))
                  }
                  placeholder="Max"
                  size="md"
                  type="number"
                  value={state[tab]?.maxBoundingCurve}
                />
              </div>
            </div>

            <div>
              <ButtonSelect
                onChange={setSubTab}
                options={[
                  {
                    value: 'audit',
                    label: [
                      'Audit',
                      `(${
                        [
                          state[tab]?.burnt,
                          state[tab]?.devNotSold,
                          state[tab]?.devSoldAll,
                          state[tab]?.noMint,
                          state[tab]?.minRisk,
                          state[tab]?.maxRisk,
                        ].filter(x => x !== undefined).length
                      })`,
                    ]
                      .filter(x => x !== '(0)')
                      .join(' '),
                  },
                  {
                    value: 'metrics',
                    label: [
                      '$ Metrics',
                      `(${
                        [
                          state[tab]?.minAge,
                          state[tab]?.maxAge,
                          state[tab]?.minLiquidity,
                          state[tab]?.maxLiquidity,
                          state[tab]?.minVolume,
                          state[tab]?.maxVolume,
                          state[tab]?.minMarketcap,
                          state[tab]?.maxMarketcap,
                          state[tab]?.minTransactions,
                          state[tab]?.maxTransactions,
                          state[tab]?.minBuys,
                          state[tab]?.maxBuys,
                          state[tab]?.minSells,
                          state[tab]?.maxSells,
                          state[tab]?.minLiquidityChangePercent,
                          state[tab]?.maxLiquidityChangePercent,
                        ].filter(x => x !== undefined).length
                      })`,
                    ]
                      .filter(x => x !== '(0)')
                      .join(' '),
                  },
                  {
                    value: 'socials',
                    label: [
                      'Socials',
                      `(${
                        [
                          state[tab]?.hasTwitter,
                          state[tab]?.hasWebsite,
                          state[tab]?.hasTelegram,
                          state[tab]?.atLeastOneSocial,
                        ].filter(x => x !== undefined).length
                      })`,
                    ]
                      .filter(x => x !== '(0)')
                      .join(' '),
                  },
                ]}
                size="md"
                value={subTab}
              />
            </div>

            {subTab === 'audit' && (
              <>
                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Burnt'}</p>
                  <Checkbox
                    block
                    onChange={burnt =>
                      setState(p => ({
                        ...p,
                        [tab]: { ...state[tab], burnt: burnt || undefined },
                      }))
                    }
                    size="lg"
                    value={state[tab]?.burnt}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Dev Has Not Sold Yet'}</p>
                  <Checkbox
                    block
                    onChange={devNotSold =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          devNotSold: devNotSold || undefined,
                        },
                      }))
                    }
                    size="lg"
                    value={state[tab]?.devNotSold}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Dev Sold All'}</p>
                  <Checkbox
                    block
                    onChange={devSoldAll =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          devSoldAll: devSoldAll || undefined,
                        },
                      }))
                    }
                    size="lg"
                    value={state[tab]?.devSoldAll}
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'No Mint'}</p>
                  <Checkbox
                    block
                    onChange={noMint =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          noMint: noMint || undefined,
                        },
                      }))
                    }
                    size="lg"
                    value={state[tab]?.noMint}
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Safe Top Holder'}</p>
                  <Checkbox
                    block
                    onChange={safeTopHolder =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          safeTopHolder: safeTopHolder || undefined,
                        },
                      }))
                    }
                    size="lg"
                    value={state[tab]?.safeTopHolder}
                  />
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">Holders</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      min={0}
                      onChange={minHolders =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minHolders },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minHolders}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      min={0}
                      onChange={maxHolders =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxHolders },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxHolders}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Risk %'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={100}
                      min={0}
                      onChange={minRisk =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minRisk },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minRisk}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      max={100}
                      onChange={maxRisk =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxRisk },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxRisk}
                    />
                  </div>
                </div>
              </>
            )}

            {subTab === 'metrics' && (
              <>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Age (Mins)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxAge}
                      min={0}
                      onChange={minAge =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minAge },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minAge}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxAge =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxAge },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxAge}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Liquidity ($)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxLiquidity}
                      min={0}
                      onChange={minLiquidity =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minLiquidity },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minLiquidity}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxLiquidity =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxLiquidity },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxLiquidity}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Volume ($)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxVolume}
                      min={0}
                      onChange={minVolume =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minVolume },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minVolume}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxVolume =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxVolume },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxVolume}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Marketcap ($)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxMarketcap}
                      min={0}
                      onChange={minMarketcap =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minMarketcap },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minMarketcap}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxMarketcap =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxMarketcap },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxMarketcap}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'TXNS'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxTransactions}
                      min={0}
                      onChange={minTransactions =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minTransactions },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minTransactions}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxTransactions =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxTransactions },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxTransactions}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Num Buys'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxBuys}
                      min={0}
                      onChange={minBuys =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minBuys },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minBuys}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxBuys =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxBuys },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxBuys}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Num Sells'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxSells}
                      min={0}
                      onChange={minSells =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minSells },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minSells}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      onChange={maxSells =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxSells },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxSells}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Liquidity Change Percentage'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      block
                      className="basis-1/2"
                      max={state[tab]?.maxLiquidityChangePercent ?? 100}
                      min={0}
                      onChange={minLiquidityChangePercent =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minLiquidityChangePercent },
                        }))
                      }
                      placeholder="Min"
                      size="md"
                      type="number"
                      value={state[tab]?.minLiquidityChangePercent}
                    />
                    <Input
                      block
                      className="basis-1/2"
                      max={100}
                      onChange={maxLiquidityChangePercent =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxLiquidityChangePercent },
                        }))
                      }
                      placeholder="Max"
                      size="md"
                      type="number"
                      value={state[tab]?.maxLiquidityChangePercent}
                    />
                  </div>
                </div>
              </>
            )}

            {subTab === 'socials' && (
              <div className="grid grid-cols-3 gap-3">
                <Checkbox
                  block
                  label="Twitter"
                  onChange={hasTwitter =>
                    setState(p => ({
                      ...p,
                      [tab]: {
                        ...p[tab],
                        hasTwitter: hasTwitter || undefined,
                      },
                    }))
                  }
                  size="lg"
                  value={state[tab]?.hasTwitter}
                />
                <Checkbox
                  block
                  label="Website"
                  onChange={hasWebsite =>
                    setState(p => ({
                      ...p,
                      [tab]: {
                        ...p[tab],
                        hasWebsite: hasWebsite || undefined,
                      },
                    }))
                  }
                  size="lg"
                  value={state[tab]?.hasWebsite}
                />
                <Checkbox
                  block
                  label="Telegram"
                  onChange={hasTelegram =>
                    setState(p => ({
                      ...p,
                      [tab]: {
                        ...p[tab],
                        hasTelegram: hasTelegram || undefined,
                      },
                    }))
                  }
                  size="lg"
                  value={state[tab]?.hasTelegram}
                />
                <Checkbox
                  block
                  className="col-span-3"
                  label="At Least One Social"
                  onChange={atLeastOneSocial =>
                    setState(p => ({
                      ...p,
                      [tab]: {
                        ...p[tab],
                        atLeastOneSocial: atLeastOneSocial || undefined,
                      },
                    }))
                  }
                  size="lg"
                  value={state[tab]?.atLeastOneSocial}
                />
              </div>
            )}
          </>
        )}
        isFiltersApplied={isFiltersApplied}
        mini
        onChange={updateTrenchFilters}
        onOpen={() => setTab(initialTab)}
        resetValue={{ new_pairs: {}, final_stretch: {}, migrated: {} }}
        size="xs"
        value={settings.trench_filters}
        {...props}
      />
    </>
  );
};
