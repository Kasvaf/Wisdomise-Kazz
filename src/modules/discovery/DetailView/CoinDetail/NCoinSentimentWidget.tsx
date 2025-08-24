import { useNCoinDetails } from 'api/discovery';
import { clsx } from 'clsx';
import {
  convertNCoinSecurityFieldToBool,
  doesNCoinHaveSafeTopHolders,
} from 'modules/discovery/ListView/NetworkRadar/lib';
import { NCoinLiquidity } from 'modules/discovery/ListView/NetworkRadar/NCoinLiquidity';
import { NCoinSecurity } from 'modules/discovery/ListView/NetworkRadar/NCoinSecurity';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import type { ComplexSlug } from './lib';

const NCoinSentimentCol: FC<{
  label: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}> = ({ label, children, className, contentClassName }) => (
  <div
    className={clsx(
      'flex h-12 mobile:w-full w-auto shrink-0 flex-col justify-start gap-1',
      className,
    )}
  >
    <p className="text-v1-content-secondary text-xs">{label}</p>
    <div className={contentClassName}>{children}</div>
  </div>
);

export const NCoinSentimentWidget: FC<{
  slug: ComplexSlug;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const nCoin = useNCoinDetails({ slug: slug.slug });
  if (!nCoin.data) return null;

  return (
    <>
      <div
        className={clsx(
          'flex mobile:flex-wrap items-center justify-between gap-4 mobile:gap-2 overflow-hidden',
          className,
        )}
      >
        <NCoinSentimentCol
          contentClassName="text-xs mt-1"
          label={t('common.liquidity')}
        >
          <NCoinLiquidity
            imgClassName="size-4"
            type="update_row"
            value={nCoin.data}
          />
        </NCoinSentimentCol>
        <NCoinSentimentCol
          contentClassName="text-xs mt-1"
          label={t('common.initial_liquidity')}
        >
          <NCoinLiquidity
            imgClassName="size-4"
            type="initial_row"
            value={nCoin.data}
          />
        </NCoinSentimentCol>
        <NCoinSentimentCol
          contentClassName="text-xs mt-1"
          label={t('common.marketcap')}
        >
          <ReadableNumber
            label="$"
            popup="never"
            value={nCoin.data?.update.base_market_data.market_cap}
          />
        </NCoinSentimentCol>
        <div className="mobile:hidden h-10 w-px shrink-0 bg-white/10" />
        <NCoinSentimentCol
          className="w-1/3 justify-self-end pe-12"
          label={t('common.validation_insights')}
        >
          <NCoinSecurity
            className="text-xxs"
            imgClassName="size-4 shrink-0"
            type="row2"
            value={{
              freezable: convertNCoinSecurityFieldToBool({
                value: nCoin.data.base_symbol_security.freezable,
                type: 'freezable',
              }),
              lpBurned: convertNCoinSecurityFieldToBool({
                value: nCoin.data.base_symbol_security.lp_is_burned,
                type: 'lpBurned',
              }),
              mintable: convertNCoinSecurityFieldToBool({
                value: nCoin.data.base_symbol_security.mintable,
                type: 'mintable',
              }),
              safeTopHolders: doesNCoinHaveSafeTopHolders({
                topHolders:
                  nCoin.data?.base_symbol_security.holders.map(
                    x => x.balance,
                  ) ?? 0,
                totalSupply: nCoin.data.update.base_market_data.total_supply,
              }),
            }}
          />
        </NCoinSentimentCol>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
