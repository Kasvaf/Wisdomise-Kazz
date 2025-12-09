import { openHubSpot } from 'config/hubSpot';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as SupportIcon } from './support-icon.svg';

const BtnLiveSupport = () => {
  return (
    <Button
      className="!px-2 mt-3 hidden w-full whitespace-nowrap max-md:flex"
      onClick={openHubSpot}
      variant="outline"
    >
      <SupportIcon />
      Live Support
    </Button>
  );
};

export default BtnLiveSupport;
