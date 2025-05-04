import { Input } from 'shared/v1-components/Input';
import polygon from './polygon.png';

export default function StakeModalContent() {
  return (
    <div>
      <h1>Stake $WSDM</h1>
      <hr className="my-8 border-v1-inverse-overlay-10" />
      <div className="overflow-hidden rounded-xl p-3">
        <div className="flex items-center gap-2">
          <img src={polygon} alt="polygon" />
          Network
        </div>
        <hr className="my-8 border-v1-inverse-overlay-10" />
        <p>
          Connect Your Wallet and Confirm Staking Transaction. Make sure you
          have enough $WSDM to Stake.
        </p>
      </div>
      <Input placeholder="0.0" />
    </div>
  );
}
