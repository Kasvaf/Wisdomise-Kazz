import { MAIN_LANDING } from 'config/constants';
import { FeaturesTable } from 'modules/account/PageBilling/FeaturesTable';
import bag from 'modules/account/PageBilling/images/bag.png';
import bg from 'modules/account/PageBilling/images/bg.png';
import starlight from 'modules/account/PageBilling/images/starlight.png';
import { useStakeModal } from 'modules/account/PageBilling/useStakeModal';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as Arrow } from './images/arrow.svg';

export default function WiseClub() {
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();
  const { stakeModal, openStakeModal } = useStakeModal();

  const stake = async () => {
    const isLoggedIn = await ensureAuthenticated();
    if (isLoggedIn) {
      openStakeModal();
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <img alt="" className="absolute" src={starlight} />
      <img alt="" className="absolute top-0 max-md:top-40 md:w-1/2" src={bg} />
      <div className="relative flex flex-col items-center">
        <h1 className="mt-10 text-center font-semibold text-3xl max-md:text-2xl">
          Join{' '}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Wise
          </span>{' '}
          Club for{' '}
          <span className="bg-pro-gradient bg-clip-text text-transparent">
            VIP
          </span>{' '}
          benefits
        </h1>
        <p className="mt-3 text-center text-v1-content-secondary max-md:text-sm">
          Stake <span className="text-v1-content-primary">$WSDM</span>, Unlock
          Alpha Signals, and Farm{' '}
          <span className="text-v1-content-primary">50%</span> of Platform
          Revenue Monthly — Straight Degen Passive Income.
        </p>
        <h2 className="mt-12 text-2xl max-md:text-xl">
          Stake & farm the bag{' '}
          <img
            alt="bag"
            className="inline-block size-8 max-md:size-6"
            src={bag}
          />
        </h2>
        <Button className="mt-4 mb-10 w-80" onClick={stake} variant="wsdm">
          Stake Now
          <Arrow />
        </Button>
        <div className="mb-16 rounded-3xl bg-v1-overlay-10 px-5 py-2 text-sm text-v1-content-secondary">
          Have Questions or Need More Details? Check Out Our FAQ Page for
          Answers:{' '}
          <a
            className="text-v1-content-link"
            href={`${MAIN_LANDING('en')}/token/faq`}
            rel="noreferrer"
            target="_blank"
          >
            FAQ Page
          </a>
        </div>
        <FeaturesTable className="mb-10 max-w-[40rem]" />
      </div>
      {stakeModal}
      {ModalLogin}
    </div>
  );
}
