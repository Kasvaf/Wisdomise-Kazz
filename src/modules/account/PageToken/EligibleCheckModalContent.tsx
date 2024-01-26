import Button from 'shared/Button';
import { ReactComponent as AirdropIcon } from './icons/airdrop.svg';

export default function EligibleCheckModalContent() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <AirdropIcon />
      <div>You are eligible</div>
      <div className="text-3xl italic">
        <strong>200</strong> <strong className="text-green-400">WSDM</strong>
      </div>
      <Button
        variant="alternative"
        className="bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75%"
        disabled={true}
      >
        Claim WSDM
      </Button>
    </div>
  );
}
