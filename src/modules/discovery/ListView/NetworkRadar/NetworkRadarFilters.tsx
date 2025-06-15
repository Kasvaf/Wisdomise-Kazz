import { useState, type ComponentProps, type FC } from 'react';
import { Input } from 'shared/v1-components/Input';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Filters } from '../Filters';
import { NETWORK_RADAR_PRESETS } from '../presetFilters';

interface NCoinsFilters {
  /* general */
  query?: string;
  excludeQuery?: string;
  // protocols?: Array<'moonshot' | 'raydium' | 'pump_amm'>,
  // bCurveMinPercent?: number,
  // bCurveMaxPercent?: number,
  networks?: string[];
  /* audit */
  burnt?: boolean;
  // devHasNotSoldYet?: boolean;
  // devSoldAll?: boolean;
  noMint?: boolean;
  noFreeze?: boolean;
  safeTopHolder?: boolean;
  minRiskPercent?: number;
  maxRiskPercent?: number;
  /* metrics */
  minAgeMinutes?: number;
  maxAgeMinutes?: number;
  minLiquidity?: number;
  maxLiquidity?: number;
  minVolume?: number;
  maxVolume?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  minTransactions?: number;
  maxTransactions?: number;
  minNumBuys?: number;
  maxNumBuys?: number;
  minNumSells?: number;
  maxNumSells?: number;
  minLiquidityChangePercent?: number;
  maxLiquidityChangePercent?: number;
  minVolumeToMaketCapRatio?: number;
  /* socials */
  hasTwitter?: boolean;
  hasWebsite?: boolean;
  hasTelegram?: boolean;
  hasTwitterPost?: boolean;
  hasAtleastOneSocial?: boolean;
}

export const NetworkRadarFilters: FC<
  Omit<
    ComponentProps<typeof Filters<NCoinsFilters>>,
    'presets' | 'sorts' | 'dialog'
  >
> = ({ ...props }) => {
  const [dialogTab, setDialogTab] = useState<'audit' | 'metrics' | 'socials'>(
    'audit',
  );
  return (
    <Filters
      presets={NETWORK_RADAR_PRESETS}
      dialog={(state, setState) => (
        <>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-xxs">{'Search Keywords'}</p>
              <Input
                type="string"
                value={state.query}
                onChange={query => setState(p => ({ ...p, query }))}
                block
                placeholder="Keyword 1, Keyword 2..."
                size="md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xxs">{'Exclude Keywords'}</p>
              <Input
                type="string"
                value={state.excludeQuery}
                onChange={excludeQuery =>
                  setState(p => ({ ...p, excludeQuery }))
                }
                block
                placeholder="Keyword 1, Keyword 2..."
                size="md"
              />
            </div>
          </div>
          <div className="border-b border-white/10" />
          <div>
            <ButtonSelect
              value={dialogTab}
              onChange={setDialogTab}
              options={[
                {
                  value: 'audit',
                  label: [
                    'Audit',
                    `(${
                      [
                        state.burnt,
                        state.noMint,
                        state.safeTopHolder,
                        state.minRiskPercent,
                        state.maxRiskPercent,
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
                        state.minAgeMinutes,
                        state.maxAgeMinutes,
                        state.minLiquidity,
                        state.maxLiquidity,
                        state.minVolume,
                        state.maxVolume,
                        state.minMarketCap,
                        state.maxMarketCap,
                        state.minTransactions,
                        state.maxTransactions,
                        state.minNumBuys,
                        state.maxNumBuys,
                        state.minNumSells,
                        state.maxNumSells,
                        state.minLiquidityChangePercent,
                        state.maxLiquidityChangePercent,
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
                        state.hasTwitter,
                        state.hasWebsite,
                        state.hasTelegram,
                        state.hasAtleastOneSocial,
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
          {dialogTab === 'audit' && (
            <>
              <div className="flex justify-between gap-2">
                <p className="text-xs">{'Burnt'}</p>
                <Checkbox
                  size="lg"
                  block
                  value={state.burnt}
                  onChange={burnt =>
                    setState(p => ({ ...p, burnt: burnt || undefined }))
                  }
                />
              </div>
              <div className="flex justify-between gap-2">
                <p className="text-xs">{'No Mint'}</p>
                <Checkbox
                  size="lg"
                  block
                  value={state.noMint}
                  onChange={noMint =>
                    setState(p => ({ ...p, noMint: noMint || undefined }))
                  }
                />
              </div>
              <div className="flex justify-between gap-2">
                <p className="text-xs">{'Safe Top Holder'}</p>
                <Checkbox
                  size="lg"
                  block
                  value={state.safeTopHolder}
                  onChange={safeTopHolder =>
                    setState(p => ({
                      ...p,
                      safeTopHolder: safeTopHolder || undefined,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs">{'Risk'}</p>
                <div className="flex w-full items-center gap-3">
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.minRiskPercent}
                    onChange={minRiskPercent =>
                      setState(p => ({ ...p, minRiskPercent }))
                    }
                    min={0}
                    max={state.maxRiskPercent ?? 100}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxRiskPercent}
                    onChange={maxRiskPercent =>
                      setState(p => ({ ...p, maxRiskPercent }))
                    }
                    min={state.minRiskPercent ?? 0}
                    max={100}
                    block
                    placeholder="Max"
                    size="md"
                  />
                </div>
              </div>
            </>
          )}
          {dialogTab === 'metrics' && (
            <>
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs">{'Age (Mins)'}</p>
                <div className="flex w-full items-center gap-3">
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.minAgeMinutes}
                    onChange={minAgeMinutes =>
                      setState(p => ({ ...p, minAgeMinutes }))
                    }
                    min={0}
                    max={state.maxAgeMinutes}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxAgeMinutes}
                    onChange={maxAgeMinutes =>
                      setState(p => ({ ...p, maxAgeMinutes }))
                    }
                    min={state.minAgeMinutes ?? 0}
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
                    value={state.minLiquidity}
                    onChange={minLiquidity =>
                      setState(p => ({ ...p, minLiquidity }))
                    }
                    min={0}
                    max={state.maxLiquidity}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxLiquidity}
                    onChange={maxLiquidity =>
                      setState(p => ({ ...p, maxLiquidity }))
                    }
                    min={state.minLiquidity ?? 0}
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
                    value={state.minVolume}
                    onChange={minVolume => setState(p => ({ ...p, minVolume }))}
                    min={0}
                    max={state.maxVolume}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxVolume}
                    onChange={maxVolume => setState(p => ({ ...p, maxVolume }))}
                    min={state.minVolume ?? 0}
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
                    value={state.minMarketCap}
                    onChange={minMarketCap =>
                      setState(p => ({ ...p, minMarketCap }))
                    }
                    min={0}
                    max={state.maxMarketCap}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxMarketCap}
                    onChange={maxMarketCap =>
                      setState(p => ({ ...p, maxMarketCap }))
                    }
                    min={state.minMarketCap ?? 0}
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
                    value={state.minTransactions}
                    onChange={minTransactions =>
                      setState(p => ({ ...p, minTransactions }))
                    }
                    min={0}
                    max={state.maxTransactions}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxTransactions}
                    onChange={maxTransactions =>
                      setState(p => ({ ...p, maxTransactions }))
                    }
                    min={state.minTransactions ?? 0}
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
                    value={state.minNumBuys}
                    onChange={minNumBuys =>
                      setState(p => ({ ...p, minNumBuys }))
                    }
                    min={0}
                    max={state.maxNumBuys}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxNumBuys}
                    onChange={maxNumBuys =>
                      setState(p => ({ ...p, maxNumBuys }))
                    }
                    min={state.minNumBuys ?? 0}
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
                    value={state.minNumSells}
                    onChange={minNumSells =>
                      setState(p => ({ ...p, minNumSells }))
                    }
                    min={0}
                    max={state.maxNumSells}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxNumSells}
                    onChange={maxNumSells =>
                      setState(p => ({ ...p, maxNumSells }))
                    }
                    min={state.minNumSells ?? 0}
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
                    value={state.minLiquidityChangePercent}
                    onChange={minLiquidityChangePercent =>
                      setState(p => ({ ...p, minLiquidityChangePercent }))
                    }
                    min={0}
                    max={state.maxLiquidityChangePercent}
                    block
                    placeholder="Min"
                    size="md"
                  />
                  <Input
                    className="basis-1/2"
                    type="number"
                    value={state.maxLiquidityChangePercent}
                    onChange={maxLiquidityChangePercent =>
                      setState(p => ({ ...p, maxLiquidityChangePercent }))
                    }
                    min={state.minLiquidityChangePercent ?? 0}
                    block
                    placeholder="Max"
                    size="md"
                  />
                </div>
              </div>
            </>
          )}
          {dialogTab === 'socials' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Checkbox
                  size="lg"
                  block
                  label="Twitter"
                  value={state.hasTwitter}
                  onChange={hasTwitter =>
                    setState(p => ({
                      ...p,
                      hasTwitter: hasTwitter || undefined,
                    }))
                  }
                />
                <Checkbox
                  size="lg"
                  block
                  label="Website"
                  value={state.hasWebsite}
                  onChange={hasWebsite =>
                    setState(p => ({
                      ...p,
                      hasWebsite: hasWebsite || undefined,
                    }))
                  }
                />
                <Checkbox
                  size="lg"
                  block
                  label="Telegram"
                  value={state.hasTelegram}
                  onChange={hasTelegram =>
                    setState(p => ({
                      ...p,
                      hasTelegram: hasTelegram || undefined,
                    }))
                  }
                />
                <Checkbox
                  className="col-span-3"
                  size="lg"
                  block
                  label="At Least One Social"
                  value={state.hasAtleastOneSocial}
                  onChange={hasAtleastOneSocial =>
                    setState(p => ({
                      ...p,
                      hasAtleastOneSocial: hasAtleastOneSocial || undefined,
                    }))
                  }
                />
              </div>
            </>
          )}
        </>
      )}
      {...props}
    />
  );
};
