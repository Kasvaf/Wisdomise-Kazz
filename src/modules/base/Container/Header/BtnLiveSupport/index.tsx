import Button from 'shared/Button';
import { openHubSpot } from 'config/hubSpot';
import { ReactComponent as SupportIcon } from './support-icon.svg';

const BtnLiveSupport = () => {
  return (
    <Button variant="primary" className="!p-3 text-xs" onClick={openHubSpot}>
      <SupportIcon className="mr-1" />
      Live Support
    </Button>
  );
};

export default BtnLiveSupport;
