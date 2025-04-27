import logo from 'assets/logo.png';
import { NavigateButtons } from 'modules/insight/PageOnboarding/components/NavigateButtons';
import qrCode from './images/qr-code.png';
import num1 from './images/1.png';
import num2 from './images/2.png';

export default function HowStep({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full grow flex-col items-center overflow-auto px-6">
        <img src={logo} alt="logo" className="h-6 w-auto" />
        <img
          src={qrCode}
          alt="users"
          className="w-auto mobile:w-full md:-mt-24 md:h-[36rem]"
        />
        <h1 className="-mt-10 mb-4 text-4xl font-semibold mobile:text-xl md:-mt-32 md:mb-10">
          How It Works
        </h1>
        <p className="mb-6 max-w-xl text-xl mobile:text-sm">
          Invite Friends Using Your Unique Referral Link.
        </p>
        <div className="max-w-xl">
          {/* <div className="mb-5 flex items-center gap-4"> */}
          {/*   <img src={num1} alt="1" className="size-12" /> */}
          {/*   <div> */}
          {/*     <p className="mb-1 text-xl mobile:text-sm">Friends Subscribe</p> */}
          {/*     <p className="text-sm text-v1-content-secondary"> */}
          {/*       When Your Friends Purchase Any Subscription Plan, You Earn{' '} */}
          {/*       <span className="text-v1-content-positive">30%</span> of Their */}
          {/*       Subscription fee. All plans included. */}
          {/*     </p> */}
          {/*   </div> */}
          {/* </div> */}
          <div className="mb-5 flex items-center gap-4">
            <img src={num1} alt="1" className="size-12" />
            <div>
              <p className="mb-1 text-xl mobile:text-sm">
                Friends Trade With Auto Trader (Level 1)
              </p>
              <p className="text-sm text-v1-content-secondary">
                You Earn <span className="text-v1-content-positive">30%</span>{' '}
                of the Trading Fees Paid by Your Directly Referred Friends When
                They Use the Auto Trader.
              </p>
            </div>
          </div>
          <div className="mb-5 flex items-center gap-4">
            <img src={num2} alt="1" className="size-12" />
            <div>
              <p className="mb-1 text-xl mobile:text-sm">
                Friends’ Friends Trade With Auto Trader (Level 2)
              </p>
              <p className="text-sm text-v1-content-secondary">
                You Earn <span className="text-v1-content-positive">5%</span> of
                the Trading Fees Paid by Your Referred Friends&apos; Friends
                (Layer 2) When They Use the Auto Trader.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NavigateButtons
        prevText="Previous"
        nextText="Done"
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  );
}
