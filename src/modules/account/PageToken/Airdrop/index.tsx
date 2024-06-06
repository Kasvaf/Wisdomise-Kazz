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
      <Card className="relative mt-6 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75%">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          {t('airdrop.title')}
          <Tooltip title={t('airdrop.description')}>
            <InfoIcon className="mb-4" />
          </Tooltip>
        </h2>
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
