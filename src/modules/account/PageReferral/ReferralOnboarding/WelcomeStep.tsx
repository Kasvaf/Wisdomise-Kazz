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
        <h1 className="md:-mt-16 mb-10 font-semibold text-4xl max-md:text-xl">
          Welcome to the Referral Program
        </h1>
        <div className="flex items-center gap-4 text-xl max-md:text-sm">
          <img alt="handshake" className="w-12 max-md:w-6" src={handshake} />
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
