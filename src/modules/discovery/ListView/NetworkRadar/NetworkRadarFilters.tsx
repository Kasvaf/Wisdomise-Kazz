import { useMemo, useState, type ComponentProps, type FC } from 'react';
import { bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Input } from 'shared/v1-components/Input';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Checkbox } from 'shared/v1-components/Checkbox';
import Icon from 'shared/Icon';
import { networkRadarGrpc } from 'api/grpc';
import { Filters } from '../Filters';
import { type NetworkRadarTab, type NetworkRadarStreamFilters } from './lib';

export const NetworkRadarFilters: FC<
  Pick<
    ComponentProps<typeof Filters<NetworkRadarStreamFilters>>,
    'value' | 'onChange'
  > & {
    initialTab: NetworkRadarTab;
    searchShortcut?: boolean;
  }
> = ({ initialTab, value, onChange, searchShortcut, ...props }) => {
  const [tab, setTab] = useState<NetworkRadarTab>(initialTab);

  const [subTab, setSubTab] = useState<'audit' | 'metrics' | 'socials'>(
    'audit',
  );

  const { data: protocols } = networkRadarGrpc.useTrenchProtocolsQuery({});
  const currentTabProtocols = useMemo(() => {
    return (
      (tab === 'final_stretch'
        ? protocols?.finalStretchProtocols
        : tab === 'migrated'
        ? protocols?.migratedProtocols
        : protocols?.newBornProtocols) ?? []
    );
  }, [tab, protocols]);

  return (
    <>
      {searchShortcut && (
        <Input
          type="string"
          prefixIcon={<Icon name={bxSearch} />}
          className="absolute right-9 z-10 w-9 !px-2 focus-within:w-72 focus-within:px-3"
          placeholder="Search by Name/Address (2+ chars)"
          value={value[initialTab]?.searchKeywords?.join(',') ?? ''}
          onChange={newVal =>
            onChange?.({
              ...value,
              [initialTab]: {
                ...value[initialTab],
                searchKeywords: newVal.split(','),
              },
            })
          }
          size="xs"
          surface={2}
        />
      )}
      <Filters
        size="xs"
        mini
        className="w-min"
        dialog={(state, setState) => (
          <>
            {/* Tab */}
            <div>
              <ButtonSelect
                value={tab}
                onChange={setTab}
                options={[
                  {
                    value: 'new_pairs',
                    label: 'New Pairs',
                  },
                  {
                    value: 'final_stretch',
                    label: 'Final Stretch',
                  },
                  {
                    value: 'migrated',
                    label: 'Migrated',
                  },
                ]}
                size="md"
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
                        key={protocol.name}
                        size="md"
                        block
                        variant="button"
                        surface={3}
                        label={
                          <>
                            <img
                              src={protocol.logo}
                              className={clsx(
                                'size-4 rounded-sm',
                                !state[tab]?.protocols?.includes(
                                  protocol.name,
                                ) && 'opacity-75',
                              )}
                            />
                            <img
                              src={protocol.logo}
                              className={clsx(
                                'absolute w-full blur-2xl brightness-100 contrast-200 saturate-200',
                                state[tab]?.protocols?.includes(protocol.name)
                                  ? 'opacity-30'
                                  : 'opacity-0',
                              )}
                            />
                            <span className="relative truncate">
                              {protocol.name}
                            </span>
                          </>
                        }
                        value={state[tab]?.protocols?.includes(protocol.name)}
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
                      />
                    ))}
                  </div>
                </div>
                <div className="border-b border-white/10" />
              </>
            )}

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2 basis-1/2">
                <p className="text-xs">{'Search Keywords'}</p>
                <Input
                  type="string"
                  value={state[tab]?.searchKeywords?.join(',') ?? ''}
                  onChange={newVal =>
                    setState?.({
                      ...state,
                      [tab]: {
                        ...state[tab],
                        searchKeywords: newVal.split(','),
                      },
                    })
                  }
                  block
                  placeholder="Keyword 1, Keyword 2..."
                  size="md"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2 basis-1/2">
                <p className="text-xs">{'Exclude Keywords'}</p>
                <Input
                  type="string"
                  value={state[tab]?.excludeKeywords?.join(',') ?? ''}
                  onChange={newVal =>
                    setState?.({
                      ...state,
                      [tab]: {
                        ...state[tab],
                        excludeKeywords: newVal.split(','),
                      },
                    })
                  }
                  block
                  placeholder="Keyword 1, Keyword 2..."
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
            <div className="border-b border-white/10" />

            {/* B Curve */}
            <div className="flex flex-col items-start gap-2">
              <p className="text-xs">{'B Curve %'}</p>
              <div className="flex w-full items-center gap-3">
                <Input
                  className="basis-1/2"
                  type="number"
                  value={state[tab]?.minBoundingCurve}
                  onChange={minBoundingCurve =>
                    setState(p => ({
                      ...p,
                      [tab]: { ...p[tab], minBoundingCurve },
                    }))
                  }
                  min={0}
                  max={state[tab]?.maxBoundingCurve ?? 100}
                  block
                  placeholder="Min"
                  size="md"
                />
                <Input
                  className="basis-1/2"
                  type="number"
                  value={state[tab]?.maxBoundingCurve}
                  onChange={maxBoundingCurve =>
                    setState(p => ({
                      ...p,
                      [tab]: { ...p[tab], maxBoundingCurve },
                    }))
                  }
                  min={state[tab]?.minBoundingCurve ?? 0}
                  max={100}
                  block
                  placeholder="Max"
                  size="md"
                />
              </div>
            </div>

            <div>
              <ButtonSelect
                value={subTab}
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
              />
            </div>

            {subTab === 'audit' && (
              <>
                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Burnt'}</p>
                  <Checkbox
                    size="lg"
                    block
                    value={state[tab]?.burnt}
                    onChange={burnt =>
                      setState(p => ({
                        ...p,
                        [tab]: { ...state[tab], burnt: burnt || undefined },
                      }))
                    }
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Dev Has Not Sold Yet'}</p>
                  <Checkbox
                    size="lg"
                    block
                    value={state[tab]?.devNotSold}
                    onChange={devNotSold =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          devNotSold: devNotSold || undefined,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Dev Sold All'}</p>
                  <Checkbox
                    size="lg"
                    block
                    value={state[tab]?.devSoldAll}
                    onChange={devSoldAll =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          devSoldAll: devSoldAll || undefined,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'No Mint'}</p>
                  <Checkbox
                    size="lg"
                    block
                    value={state[tab]?.noMint}
                    onChange={noMint =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          noMint: noMint || undefined,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <p className="text-xs">{'Safe Top Holder'}</p>
                  <Checkbox
                    size="lg"
                    block
                    value={state[tab]?.safeTopHolder}
                    onChange={safeTopHolder =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...state[tab],
                          safeTopHolder: safeTopHolder || undefined,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Risk %'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minRisk}
                      onChange={minRisk =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minRisk },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxRisk ?? 100}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxRisk}
                      onChange={maxRisk =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxRisk },
                        }))
                      }
                      min={state[tab]?.minRisk ?? 0}
                      max={100}
                      block
                      placeholder="Max"
                      size="md"
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
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minAge}
                      onChange={minAge =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minAge },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxAge}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxAge}
                      onChange={maxAge =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxAge },
                        }))
                      }
                      min={state[tab]?.minAge ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Liquidity ($)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minLiquidity}
                      onChange={minLiquidity =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minLiquidity },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxLiquidity}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxLiquidity}
                      onChange={maxLiquidity =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxLiquidity },
                        }))
                      }
                      min={state[tab]?.minLiquidity ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Volume ($)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minVolume}
                      onChange={minVolume =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minVolume },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxVolume}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxVolume}
                      onChange={maxVolume =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxVolume },
                        }))
                      }
                      min={state[tab]?.minVolume ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Marketcap ($)'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minMarketcap}
                      onChange={minMarketcap =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minMarketcap },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxMarketcap}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxMarketcap}
                      onChange={maxMarketcap =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxMarketcap },
                        }))
                      }
                      min={state[tab]?.minMarketcap ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'TXNS'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minTransactions}
                      onChange={minTransactions =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minTransactions },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxTransactions}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxTransactions}
                      onChange={maxTransactions =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxTransactions },
                        }))
                      }
                      min={state[tab]?.minTransactions ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Num Buys'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minBuys}
                      onChange={minBuys =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minBuys },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxBuys}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxBuys}
                      onChange={maxBuys =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxBuys },
                        }))
                      }
                      min={state[tab]?.minBuys ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Num Sells'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minSells}
                      onChange={minSells =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minSells },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxSells}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxSells}
                      onChange={maxSells =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxSells },
                        }))
                      }
                      min={state[tab]?.minSells ?? 0}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs">{'Liquidity Change Percentage'}</p>
                  <div className="flex w-full items-center gap-3">
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.minLiquidityChangePercent}
                      onChange={minLiquidityChangePercent =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], minLiquidityChangePercent },
                        }))
                      }
                      min={0}
                      max={state[tab]?.maxLiquidityChangePercent ?? 100}
                      block
                      placeholder="Min"
                      size="md"
                    />
                    <Input
                      className="basis-1/2"
                      type="number"
                      value={state[tab]?.maxLiquidityChangePercent}
                      onChange={maxLiquidityChangePercent =>
                        setState(p => ({
                          ...p,
                          [tab]: { ...p[tab], maxLiquidityChangePercent },
                        }))
                      }
                      min={state[tab]?.minLiquidityChangePercent ?? 0}
                      max={100}
                      block
                      placeholder="Max"
                      size="md"
                    />
                  </div>
                </div>
              </>
            )}

            {subTab === 'socials' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <Checkbox
                    size="lg"
                    block
                    label="Twitter"
                    value={state[tab]?.hasTwitter}
                    onChange={hasTwitter =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...p[tab],
                          hasTwitter: hasTwitter || undefined,
                        },
                      }))
                    }
                  />
                  <Checkbox
                    size="lg"
                    block
                    label="Website"
                    value={state[tab]?.hasWebsite}
                    onChange={hasWebsite =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...p[tab],
                          hasWebsite: hasWebsite || undefined,
                        },
                      }))
                    }
                  />
                  <Checkbox
                    size="lg"
                    block
                    label="Telegram"
                    value={state[tab]?.hasTelegram}
                    onChange={hasTelegram =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...p[tab],
                          hasTelegram: hasTelegram || undefined,
                        },
                      }))
                    }
                  />
                  <Checkbox
                    className="col-span-3"
                    size="lg"
                    block
                    label="At Least One Social"
                    value={state[tab]?.atLeastOneSocial}
                    onChange={atLeastOneSocial =>
                      setState(p => ({
                        ...p,
                        [tab]: {
                          ...p[tab],
                          atLeastOneSocial: atLeastOneSocial || undefined,
                        },
                      }))
                    }
                  />
                </div>
              </>
            )}
          </>
        )}
        value={value}
        onChange={onChange}
        onOpen={() => setTab(initialTab)}
        {...props}
      />
    </>
  );
};
