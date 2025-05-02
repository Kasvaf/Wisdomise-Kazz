import dayjs from 'dayjs';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import { addComma } from 'utils/numbers';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as InfoIcon } from './icons/info.svg';

export default function Vesting() {
  const { t } = useTranslation('wisdomise-token');
  const { bucketsDetails, hasShareInBucket } = useVesting();

  return hasShareInBucket ? (
    <div className="relative mt-6 rounded-xl !bg-v1-surface-l2 p-6">
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        {t('vesting.title')}
        <Tooltip title={t('vesting.tooltip')}>
          <InfoIcon className="mb-4" />
        </Tooltip>
      </h2>
      <p className="pb-3 text-sm text-v1-content-secondary max-md:max-w-60">
        {t('vesting.description')}
      </p>
      {bucketsDetails.map(bucket => {
        return (
          <div
            key={bucket.name}
            className="mt-3 flex items-center gap-y-4 rounded-xl bg-v1-surface-l3 px-4 py-3 max-md:flex-wrap"
          >
            <h3 className="font-bold italic md:w-1/5">{bucket.name}</h3>
            <div className="me-8 h-10 !w-px bg-white/10 max-md:hidden"></div>
            <div className="flex grow items-center justify-between gap-y-6 max-md:flex-wrap md:gap-x-4">
              <div>
                <div className="mb-3 text-sm text-v1-content-secondary">
                  <span>{t('vesting.total-investment')}</span>
                </div>
                <div>
                  <span>
                    {addComma((bucket.totalAmount ?? 0n) / 10n ** 6n)}
                  </span>{' '}
                  <span className="text-v1-content-secondary">WSDM</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="text-sm text-v1-content-secondary">
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
                  <span className="text-v1-content-secondary">WSDM</span>
                </div>
              </div>
              <div>
                <div className="mb-3 text-sm text-v1-content-secondary">
                  <span>{t('vesting.claimable')}</span>
                </div>
                <div>
                  {addComma((bucket.claimable ?? 0n) / 10n ** 6n)}{' '}
                  <span className="text-v1-content-secondary">WSDM</span>
                </div>
              </div>
              <Button
                loading={bucket.claimIsLoading}
                disabled={(bucket.claimable ?? 0n) === 0n}
                onClick={() => bucket.claim()}
              >
                {t('vesting.claim')}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  ) : null;
}
