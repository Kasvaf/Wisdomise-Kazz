import { clsx } from 'clsx';
import { type FC } from 'react';
import { type NCoinDeveloper as NCoinDeveloperType } from 'api/discovery';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { CoinLogo } from 'shared/Coin';
import { ReadableDate } from 'shared/ReadableDate';
import { ContractAddress } from 'shared/ContractAddress';
import { ReactComponent as DeveloperIcon } from './developer.svg';

export const NCoinDeveloper: FC<{
  className?: string;
  value?: NCoinDeveloperType | null;
}> = ({ className, value }) => {
  return (
    <ClickableTooltip
      className={clsx('inline-flex size-3', className)}
      chevron={false}
      disabled={!value?.tokens.length}
      title={
        <div className="space-y-3">
          <p className="text-xs">{'Created Assets'}</p>
          {value?.tokens.map(token => (
            <div
              key={token.contract_address}
              className="flex items-center gap-2"
            >
              <CoinLogo
                value={token.symbol?.logo_url ?? ''}
                className="size-7 shrink-0"
              />
              <div className="grow text-xxs">
                <p>{token.symbol?.name ?? 'Unknown Coin'}</p>
                <div className="text-v1-content-secondary">
                  {'Created at '}
                  <ReadableDate
                    value={token.creation_datetime}
                    format="MMM D, YYYY"
                    popup={false}
                  />
                </div>
              </div>
              <ContractAddress
                value={token.contract_address}
                className="ms-2 shrink-0"
                allowCopy
                noLabel
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
