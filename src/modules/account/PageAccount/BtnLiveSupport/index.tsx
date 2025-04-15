import { openHubSpot } from 'config/hubSpot';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as SupportIcon } from './support-icon.svg';

const BtnLiveSupport = () => {
  return (
    <Button
      variant="outline"
      onClick={openHubSpot}
      className="mt-3 hidden w-full whitespace-nowrap !px-2 mobile:flex"
    >
      <SupportIcon />
      Live Support
    </Button>
  );
};

export default BtnLiveSupport;
