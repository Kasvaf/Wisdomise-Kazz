import logo from 'assets/logo.png';
import { NavigateButtons } from 'modules/insight/PageOnboarding/components/NavigateButtons';
import users from './images/users.png';
import handshake from './images/handshake.png';

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="flex flex-col items-center px-6">
        <img src={logo} alt="logo" className="h-6 w-auto" />
        <img src={users} alt="users" className="-mt-10 md:h-96" />
        <h1 className="mb-10 text-4xl font-semibold mobile:text-xl md:-mt-16">
          Welcome to the Referral Program
        </h1>
        <div className="flex items-center gap-4 text-xl mobile:text-sm">
          <img src={handshake} alt="handshake" className="w-12 mobile:w-6" />
          <p className="max-w-xl">
            Earn Rewards by Inviting Your Friends to Join Wisdomise. It&apos;s
            Simple and Rewarding!
          </p>
        </div>
      </div>
      <NavigateButtons
        showPrev={false}
        nextText="Next"
        onNext={onNext}
        className="mt-auto"
      />
    </>
  );
}
