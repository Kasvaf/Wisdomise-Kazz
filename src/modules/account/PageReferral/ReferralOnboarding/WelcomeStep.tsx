import logo from 'assets/logo-white.svg';
import { NavigateButtons } from 'modules/account/PageOnboarding/components/NavigateButtons';
import handshake from './images/handshake.png';
import users from './images/users.png';

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="flex flex-col items-center px-6">
        <img alt="logo" className="w-auto" src={logo} />
        <img alt="users" className="-mt-10 md:h-96" src={users} />
        <h1 className="md:-mt-16 mb-10 font-semibold mobile:text-xl text-4xl">
          Welcome to the Referral Program
        </h1>
        <div className="flex items-center gap-4 mobile:text-sm text-xl">
          <img alt="handshake" className="mobile:w-6 w-12" src={handshake} />
          <p className="max-w-xl">
            Earn Rewards by Inviting Your Friends to Join Goatx. It&apos;s
            Simple and Rewarding!
          </p>
        </div>
      </div>
      <NavigateButtons
        className="mt-auto"
        nextText="Next"
        onNext={onNext}
        showPrev={false}
      />
    </>
  );
}
