import { bxRightArrowAlt } from 'boxicons-quasar';
import { notification } from 'antd';
import gradient2 from 'modules/account/PageBilling/SubscriptionDetail/gradient-2.png';
import wiseClub from 'modules/account/PageBilling/SubscriptionDetail/wise-club.png';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useInstantCancelMutation } from 'api';
import useConfirm from 'shared/useConfirm';

export default function CancelBanner() {
  const { mutateAsync, isPending } = useInstantCancelMutation();
  const [confirmModal, confirm] = useConfirm({
    title: 'Canceling Subscription',
    icon: null,
    message:
      'Your current subscription will be canceled if you proceed. Would you like to continue?',
    yesTitle: 'Continue',
    noTitle: 'Not now',
  });

  const cancel = async () => {
    if (await confirm()) {
      void mutateAsync().then(() => {
        return notification.success({
          message: 'Subscription cancelled successfully.',
        });
      });
    }
  };

  return (
    <div className="mobile:p-6 relative overflow-hidden rounded-xl bg-[#090C10] p-12 md:mr-10">
      <img src={gradient2} alt="" className="absolute left-0 top-0" />
      <div className="relative">
        <img src={wiseClub} alt="wise-club" className="h-6" />
        <h2 className="mt-4 flex items-center text-2xl font-medium">
          {/* <Logo className="-mr-[3px] h-4" /> */}
          {/* Wise Club is Here! */}
        </h2>
        <h3 className="mt-8 text-xl font-medium">
          Important Subscription Update
        </h3>
        <p className="mt-2 text-sm text-v1-content-secondary">
          We’ve Upgraded Our Subscription Model to Staking for Better Rewards
          and Long-Term Benefits.
        </p>

        <h3 className="mt-8 text-xl font-medium">What’s Changing?</h3>
        <ul className="ml-4 mt-2 text-sm text-v1-content-secondary [&>li]:list-disc">
          <li>The old fiat-based subscription model has been discontinued</li>
          <li>Access is now granted by staking $1000 in $WSDM</li>
          <li>
            Unlock premium tools, lower fees, and long-term benefits through
            staking
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-medium">What You Need to Do</h3>
        <ul className="ml-4 mt-2 text-sm text-v1-content-secondary [&>li]:list-disc">
          <li>Cancel your current fiat subscription</li>
          <li>
            Stake $1000 in $WSDM to activate Wise Club and start earning from
            50% of platform revenue
          </li>
          <li>
            Enjoy premium tools, lower fees, and exclusive features as added
            perks
          </li>
        </ul>

        <Button
          variant="pro"
          className="mt-6 w-full"
          onClick={cancel}
          loading={isPending}
        >
          Cancel & Upgrade to Wise Club
          <Icon name={bxRightArrowAlt} />
        </Button>
      </div>
      {confirmModal}
    </div>
  );
}
