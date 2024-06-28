import { useAccount } from 'wagmi';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import useModal from 'shared/useModal';
import EligibleCheckModalContent from 'modules/account/PageToken/Airdrop/EligibleCheckModalContent';
import { useCheckAirdropEligibilityQuery } from 'api/airdrop';
// import Countdown from 'modules/account/PageToken/Airdrop/Countdown';
import { ReactComponent as InfoIcon } from '../icons/info.svg';

export default function Airdrop() {
  const { t } = useTranslation('wisdomise-token');
  const [Modal, showModal] = useModal(EligibleCheckModalContent, {
    destroyOnClose: true,
  });
  const { address } = useAccount();
  const { refetch, isFetching } = useCheckAirdropEligibilityQuery(address);

  const checkEligibility = async () => {
    const { data } = await refetch();
    void showModal({ eligibility: data });
  };

  return (
    <>
      <Card className="relative mt-6 flex flex-wrap items-center justify-between gap-16">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          {t('airdrop.title')}
          <Tooltip title={t('airdrop.description')}>
            <InfoIcon className="mb-4" />
          </Tooltip>
        </h2>

        <div className="flex grow items-center justify-between">
          <div className="flex flex-col items-center justify-between gap-4 text-center">
            <div className="flex h-10 items-center justify-center rounded-full bg-white/20 px-4 max-md:text-xs">
              {t('airdrop.now')}
            </div>
            <div className="flex w-full items-center">
              <div className="grow"></div>
              <div className="h-4 w-4 shrink-0 rounded-full bg-violet-500"></div>
              <div className="grow border-b border-white/20"></div>
            </div>
            <div className="h-10 md:text-xl">{t('airdrop.check')}</div>
          </div>
          <div className="grow border-b border-white/20"></div>
          <div className="flex flex-col items-center justify-between gap-4 text-center">
            <div className="flex h-10 items-center justify-center rounded-full bg-white/20 px-4 max-md:text-xs">
              25-06-2024
            </div>
            <div className="flex w-full items-center">
              <div className="grow border-b border-white/20"></div>
              <div className="h-4 w-4 shrink-0 rounded-full bg-violet-500">
                <div className="h-4 w-4 shrink-0 animate-ping rounded-full bg-violet-500"></div>
              </div>
              <div className="grow border-b border-white/20"></div>
            </div>
            <div className="h-10 md:text-xl">{t('airdrop.calculation')}</div>
          </div>
          <div className="grow border-b border-white/20"></div>
          <div className="flex flex-col items-center justify-between gap-4 text-center">
            <div className="flex h-10 items-center justify-center rounded-full bg-white/20 px-4 max-md:text-xs">
              11-07-2024
            </div>
            <div className="flex w-full items-center">
              <div className="grow border-b border-white/20"></div>
              <div className="h-4 w-4 shrink-0 rounded-full bg-white/50"></div>
              <div className="grow"></div>
            </div>
            <div className="h-10 md:text-xl">{t('airdrop.claim')}</div>
          </div>
        </div>

        {/* <Countdown /> */}
        <Button
          className="max-md:w-full"
          variant="primary-purple"
          onClick={checkEligibility}
          loading={isFetching}
          disabled={isFetching}
        >
          {t('airdrop.check')}
        </Button>
      </Card>
      {Modal}
    </>
  );
}
