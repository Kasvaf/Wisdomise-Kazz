import { openHubSpot } from 'config/hubSpot';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as SupportIcon } from './support-icon.svg';

const BtnLiveSupport = () => {
  return (
    <Button
      variant="white"
      onClick={openHubSpot}
      className="whitespace-nowrap !px-2"
    >
      <SupportIcon />
      Live Support
    </Button>
  );
};

export default BtnLiveSupport;
