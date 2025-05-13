import dayjs from 'dayjs';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';

import { addComma } from 'utils/numbers';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import { ReactComponent as LockIcon } from './icons/lock.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';

export default function Vesting() {
  const { t } = useTranslation('wisdomise-token');
  const { bucketsDetails } = useVesting();

  return (
    <Card className="relative mt-6 !bg-v1-surface-l2">
      <LockIcon className="absolute right-0 top-0 m-7" />
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-medium">
        {t('vesting.title')}
        <Tooltip title={t('vesting.tooltip')}>
          <InfoIcon className="mb-4" />
        </Tooltip>
      </h2>
      <p className="pb-3 text-sm text-white/40 max-md:max-w-60">
        {t('vesting.description')}
      </p>
      {bucketsDetails.map(bucket => {
        return (
          bucket.totalAmount !== 0n && (
            <div
              key={bucket.name}
              className="mt-3 flex items-center gap-y-4 rounded-xl bg-[rgba(51,59,92,0.20)] px-4 py-3 max-md:flex-wrap"
            >
              <h3 className="font-bold italic md:w-1/5">{bucket.name}</h3>
              <div className="me-8 h-10 !w-px bg-white/10 max-md:hidden"></div>
              <div className="flex grow items-center justify-between gap-y-6 max-md:flex-wrap md:gap-x-4">
                <div>
                  <div className="mb-3 text-sm text-white/40">
                    <span>{t('vesting.total-investment')}</span>
                  </div>
                  <div>
                    <span>
                      {addComma(BigInt(bucket.totalAmount ?? 0n) / 10n ** 6n)}
                    </span>{' '}
                    <span className="text-white/40">WSDM</span>
                  </div>
                </div>
                <div>
                  <div className="mb-3">
                    <span className="text-sm text-white/40">
                      {t('vesting.next-unlock')}
                    </span>
                    {bucket.nextRelease.timestamp !== 0 && (
                      <span className="ms-2">
                        <span>
                          {dayjs(bucket.nextRelease.timestamp).format(
                            'D MMM YYYY',
                          )}
                        </span>
                        <span className="ms-1 text-sm">
                          ({dayjs(bucket.nextRelease.timestamp).toNow(true)})
                        </span>
                      </span>
                    )}
                  </div>
                  <div>
                    {addComma(bucket.nextRelease.amount)}{' '}
                    <span className="text-white/40">WSDM</span>
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-sm text-white/40">
                    <span>{t('vesting.claimable')}</span>
                  </div>
                  <div>
                    {addComma((bucket.claimable ?? 0n) / 10n ** 6n)}{' '}
                    <span className="text-white/40">WSDM</span>
                  </div>
                </div>
                <Button
                  variant="primary-purple"
                  loading={bucket.claimIsLoading}
                  disabled={
                    (bucket.claimable ?? 0n) === 0n || bucket.claimIsLoading
                  }
                  onClick={() => bucket.claim()}
                >
                  {t('vesting.claim')}
                </Button>
              </div>
            </div>
          )
        );
      })}
    </Card>
  );
}
