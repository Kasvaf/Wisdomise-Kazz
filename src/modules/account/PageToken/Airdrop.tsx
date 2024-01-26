import Button from 'shared/Button';
import Card from 'shared/Card';
import useModal from 'shared/useModal';
import EligibleCheckModalContent from 'modules/account/PageToken/EligibleCheckModalContent';

export default function Airdrop() {
  const [Modal, showModal] = useModal(EligibleCheckModalContent);

  const checkEligibility = () => {
    void showModal({});
  };

  return (
    <>
      <Card className="relative mt-6 flex items-center justify-between bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75%">
        <div>
          <h2 className="mb-2 text-2xl font-medium">Airdrop</h2>
          <p className="text-white/40">Airdrop description</p>
        </div>
        <div>
          <div>Token</div>
          <div className="italic">
            <strong className="text-4xl">200</strong>
            <strong className="text-4xl font-semibold text-green-400">
              WSDM
            </strong>{' '}
          </div>
        </div>
        <Button
          variant="alternative"
          className="bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75%"
          onClick={checkEligibility}
        >
          Eligible Check
        </Button>
      </Card>
      {Modal}
    </>
  );
}
