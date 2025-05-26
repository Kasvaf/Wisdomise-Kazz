import logo from 'assets/logo.png';
import VipBadge from 'shared/AccessShield/VipBanner/VipBadge';
import VipRedirectButton from 'shared/AccessShield/VipBanner/VipRedirectButton';
import gradient1 from './images/gradient-1.png';
import gradient2 from './images/gradient-2.png';
import header from './images/header.png';
import { ReactComponent as Ai } from './images/ai.svg';

export default function VipBanner() {
  return (
    <div className="relative max-w-[30rem] rounded-xl bg-v1-surface-l0 p-8 pt-0">
      <img src={gradient1} alt="" className="absolute left-0 top-0" />
      <img
        src={gradient2}
        alt=""
        className="absolute bottom-0 left-0 w-2/3 opacity-70"
      />
      <img src={logo} alt="logo" className="absolute left-8 top-4 h-6" />
      <div className="relative">
        <img src={header} alt="header" />
        <h2 className="-ml-2 -mt-10 text-xl font-semibold">
          Unlock Premium Experience
          <VipBadge className="ml-2" />
        </h2>
        <p className="mt-1 text-xs text-v1-content-secondary">
          Elevate Your Trading Experience
        </p>
        <hr className="my-10 border-v1-inverse-overlay-10" />
        <div className="mb-8 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-v1-overlay-20">
            <Ai />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">AI-Powered Market Insights</h3>
            <p className="text-xs text-v1-inverse-overlay-70">
              Access real-time signals and advanced tools for smarter trading.
            </p>
          </div>
        </div>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-v1-overlay-20">
            <Ai />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">AI-Powered Market Insights</h3>
            <p className="text-xs text-v1-inverse-overlay-70">
              Access real-time signals and advanced tools for smarter trading.
            </p>
          </div>
        </div>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-v1-overlay-20">
            <Ai />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">AI-Powered Market Insights</h3>
            <p className="text-xs text-v1-inverse-overlay-70">
              Access real-time signals and advanced tools for smarter trading.
            </p>
          </div>
        </div>
        <hr className="my-10 border-v1-inverse-overlay-10" />
        <p className="mb-6 text-center text-xs text-v1-inverse-overlay-50">
          By Continuing, You Confirm That You Understand the Staking
          Requirements and Accept the Terms of the VIP Membership.
        </p>
        <VipRedirectButton />
      </div>
    </div>
  );
}
