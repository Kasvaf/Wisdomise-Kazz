import dayjs from 'dayjs';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';

import { addComma } from 'utils/numbers';
import {
  ANGEL_RELEASE_TIMESTAMPS,
  STRATEGIC_RELEASE_TIMESTAMPS,
} from 'modules/account/PageToken/constants';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import { ReactComponent as LockIcon } from './icons/lock.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';

export default function Vesting() {
  const { t } = useTranslation('wisdomise-token');
  const {
    roundDetails,
    claimStrategicShare,
    claimAngelShare,
    strategicIsLoading,
    angelIsLoading,
  } = useVesting();

  const handleClaim = (round: 'angel' | 'strategic') =>
    round === 'angel' ? claimAngelShare() : claimStrategicShare();

  const findNextRelease = (roundId: 'angel' | 'strategic') => {
    return (
      (roundId === 'angel'
        ? ANGEL_RELEASE_TIMESTAMPS
        : STRATEGIC_RELEASE_TIMESTAMPS
      ).find(timestamp => timestamp * 1000 > Date.now()) ?? 0
    );
  };

  return (
    <Card className="relative mt-6">
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
      {roundDetails.map(round => {
        return (
          <div
            key={round.name}
            className="mt-3 flex items-center gap-y-4 rounded-xl bg-[rgba(51,59,92,0.20)] px-4 py-3 max-md:flex-wrap"
          >
            <h3 className="font-bold italic md:w-1/5">{round.name}</h3>
            <div className="me-8 h-10 !w-px bg-white/10 max-md:hidden"></div>
            <div className="flex grow items-center justify-between gap-y-6 max-md:flex-wrap md:gap-x-4">
              <div>
                <div className="mb-3 text-sm text-white/40">
                  <span>{t('vesting.total-investment')}</span>
                </div>
                <div>
                  <span>{addComma((round.totalAmount ?? 0n) / 10n ** 6n)}</span>{' '}
                  <span className="text-white/40">WSDM</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="text-sm text-white/40">
                    {t('vesting.next-unlock')}
                  </span>
                  {findNextRelease(round.id) !== 0 && (
                    <span className="ms-2">
                      <span>
                        {dayjs(findNextRelease(round.id) * 1000).format(
                          'D MMM YYYY',
                        )}
                      </span>
                      <span className="ms-1 text-sm">
                        ({dayjs(findNextRelease(round.id) * 1000).toNow(true)})
                      </span>
                    </span>
                  )}
                </div>
                <div>
                  {findNextRelease(round.id) === 0
                    ? 0
                    : addComma(
                        (Number(round.totalAmount ?? 0n) *
                          round.releasePercentage) /
                          10 ** 6,
                      )}{' '}
                  <span className="text-white/40">WSDM</span>
                </div>
              </div>
              <div>
                <div className="mb-3 text-sm text-white/40">
                  <span>{t('vesting.claimable')}</span>
                </div>
                <div>
                  {addComma((round.claimable ?? 0n) / 10n ** 6n)}{' '}
                  <span className="text-white/40">WSDM</span>
                </div>
              </div>
              <Button
                variant="primary-purple"
                loading={
                  round.id === 'angel' ? angelIsLoading : strategicIsLoading
                }
                disabled={
                  (round.claimable ?? 0n) === 0n ||
                  (round.id === 'angel' ? angelIsLoading : strategicIsLoading)
                }
                onClick={() => handleClaim(round.id)}
              >
                {t('vesting.claim')}
              </Button>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
