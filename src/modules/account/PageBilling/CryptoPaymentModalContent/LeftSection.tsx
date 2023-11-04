import { type SubscriptionPlan } from 'api/types/subscription';
import { ReactComponent as LogoWithText } from 'assets/logo-horizontal-beta.svg';
import { ReactComponent as WisdomiseLogo } from '../images/wisdomise-logo.svg';

interface Props {
  plan: SubscriptionPlan;
}

export default function LeftSection({ plan }: Props) {
  return (
    <div className="flex h-full shrink grow basis-0 flex-col items-center justify-center bg-[#131822]">
      <div className="w-3/4 mobile:w-full mobile:px-8 mobile:py-12">
        <div className="flex items-center gap-3 mobile:hidden">
          <div className="h-10 w-10 rounded-full bg-[#D9D9D9]" />
          <p className="text-xl text-white">Wisdomise AG</p>
        </div>

        <LogoWithText className="hidden mobile:block" />

        <p className="mt-14 text-xl text-white/50 mobile:mt-10">
          Subscribe to {plan.name}
        </p>

        <div className="mt-6 flex items-center gap-5">
          <p className="text-[40px] text-white mobile:text-3xl">
            ${plan.price}
          </p>
          <p className="text-lg text-white/50 mobile:text-sm">
            per <br />
            {plan.periodicity.toLocaleLowerCase().replace('ly', '')}
          </p>
        </div>

        <div className="mt-12 flex gap-6 mobile:mt-8 mobile:gap-4">
          <div className="h-14 w-14  basis-14 mobile:hidden">
            <WisdomiseLogo />
          </div>
          <div className="flex flex-col gap-7 text-lg mobile:text-base [&>*]:pb-7 mobile:[&>*]:pb-4">
            <div className="border-b border-white/20">
              <div className="flex justify-between">
                <span>{plan.name}</span>
                <span>${plan.price}</span>
              </div>
              <p className="mt-6 text-sm text-white/50 mobile:mt-4">
                {plan.description}
              </p>
            </div>

            <div className="flex justify-between border-b border-white/20">
              <span>Subtotal</span>
              <span>${plan.price}</span>
            </div>

            <div className="flex justify-between">
              <span>Total due today</span>
              <span>${plan.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
