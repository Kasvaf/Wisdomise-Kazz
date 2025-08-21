import type { NCoinDeveloper as NCoinDeveloperType } from 'api/discovery';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { CoinLogo } from 'shared/Coin';
import { ContractAddress } from 'shared/ContractAddress';
import { ReadableDate } from 'shared/ReadableDate';
import { ReactComponent as DeveloperIcon } from './developer.svg';

export const NCoinDeveloper: FC<{
  className?: string;
  value?: NCoinDeveloperType | null;
}> = ({ className, value }) => {
  return (
    <ClickableTooltip
      chevron={false}
      className={clsx('inline-flex size-3', className)}
      disabled={!value?.tokens.length}
      title={
        <div className="space-y-3">
          <p className="text-xs">{'Created Assets'}</p>
          {value?.tokens.map(token => (
            <div
              className="flex items-center gap-2"
              key={token.contract_address}
            >
              <CoinLogo
                className="size-7 shrink-0"
                value={token.symbol?.logo_url ?? ''}
              />
              <div className="grow text-xxs">
                <p>{token.symbol?.name ?? 'Unknown Coin'}</p>
                <div className="text-v1-content-secondary">
                  {'Created at '}
                  <ReadableDate
                    format="MMM D, YYYY"
                    popup={false}
                    value={token.creation_datetime}
                  />
                </div>
              </div>
              <ContractAddress
                allowCopy
                className="ms-2 shrink-0"
                noLabel
                value={token.contract_address}
              />
            </div>
          ))}
        </div>
      }
    >
      <DeveloperIcon />
    </ClickableTooltip>
  );
};
