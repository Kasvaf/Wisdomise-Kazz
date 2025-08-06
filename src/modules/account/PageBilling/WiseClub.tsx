import starlight from 'modules/account/PageBilling/images/starlight.png';
import bg from 'modules/account/PageBilling/images/bg.png';
import bag from 'modules/account/PageBilling/images/bag.png';
import { Button } from 'shared/v1-components/Button';
import { MAIN_LANDING } from 'config/constants';
import { FeaturesTable } from 'modules/account/PageBilling/FeaturesTable';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { useStakeModal } from 'modules/account/PageBilling/useStakeModal';
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
      <img src={starlight} className="absolute" alt="" />
      <img src={bg} className="absolute top-0 mobile:top-40 md:w-1/2" alt="" />
      <div className="relative flex flex-col items-center">
        <h1 className="mt-10 text-center text-3xl font-semibold mobile:text-2xl">
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
        <p className="mt-3 text-center text-v1-content-secondary mobile:text-sm">
          Stake <span className="text-v1-content-primary">$WSDM</span>, Unlock
          Alpha Signals, and Farm{' '}
          <span className="text-v1-content-primary">50%</span> of Platform
          Revenue Monthly — Straight Degen Passive Income.
        </p>
        <h2 className="mt-12 text-2xl mobile:text-xl">
          Stake & farm the bag{' '}
          <img
            src={bag}
            alt="bag"
            className="inline-block size-8 mobile:size-6"
          />
        </h2>
        <Button variant="wsdm" onClick={stake} className="mb-10 mt-4 w-80">
          Stake Now
          <Arrow />
        </Button>
        <div className="mb-16 rounded-3xl bg-v1-overlay-10 px-5 py-2 text-sm text-v1-content-secondary">
          Have Questions or Need More Details? Check Out Our FAQ Page for
          Answers:{' '}
          <a
            href={`${MAIN_LANDING('en')}/token/faq`}
            target="_blank"
            className="text-v1-content-link"
            rel="noreferrer"
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
