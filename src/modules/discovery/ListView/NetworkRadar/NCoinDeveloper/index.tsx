import { clsx } from 'clsx';
import type { FC } from 'react';
import type { DevData } from 'services/grpc/proto/network_radar';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ContractAddress } from 'shared/ContractAddress';
import { ReadableDate } from 'shared/ReadableDate';
import { ReactComponent as DeveloperIcon } from './developer.svg';

export const NCoinDeveloper: FC<{
  className?: string;
  value?: DevData;
}> = ({ className, value }) => {
  return value?.tokens?.length ? (
    <ClickableTooltip
      chevron={false}
      className={clsx('inline-flex', className)}
      title={
        <div className="space-y-3">
          <p className="text-xs">{'Created Assets'}</p>
          {value?.tokens.map(token => (
            <div className="flex items-center gap-2" key={token.address}>
              <div className="grow text-2xs">
                <p>{'Unknown Coin'}</p>
                <div className="text-v1-content-secondary">
                  {'Created at '}
                  <ReadableDate
                    format="MMM D, YYYY"
                    popup={false}
                    value={token.createdAt}
                  />
                </div>
              </div>
              <ContractAddress
                allowCopy
                className="ms-2 shrink-0"
                noLabel
                value={token.address}
              />
            </div>
          ))}
        </div>
      }
    >
      <DeveloperIcon className="size-4" />
    </ClickableTooltip>
  ) : null;
};
