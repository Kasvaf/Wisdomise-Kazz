import { useTranslation } from 'react-i18next';
import type { SubscriptionPlan } from 'services/rest/types/subscription';
import Periodicity from '../../Periodicity';

interface Props {
  plan: SubscriptionPlan;
}

export default function LeftSection({ plan }: Props) {
  const { t } = useTranslation('billing');

  return (
    <div className="flex h-full shrink grow basis-0 flex-col items-center justify-center bg-v1-background-primary">
      <div className="mobile:w-full w-3/4 mobile:px-8 mobile:py-12">
        <div className="flex mobile:hidden items-center gap-3">
          <p className="text-white text-xl">{t('crypto-modal.title')}</p>
        </div>

        {/* <LogoWithText className="hidden mobile:block" /> */}

        <p className="mobile:mt-10 mt-14 text-white/50 text-xl">
          {t('crypto-modal.subtitle', { plan: plan.name ?? '' })}
        </p>

        <div className="mt-6 flex items-center gap-5">
          <p className="mobile:text-3xl text-[40px] text-white">
            ${plan.price}
          </p>
          <p className="mobile:text-sm text-lg text-white/50">
            <Periodicity periodicity={plan.periodicity} />
          </p>
        </div>

        <div className="mobile:mt-8 mt-12 flex gap-6 mobile:gap-4">
          <div className="mobile:hidden h-14 w-14 basis-14">
            {/* <WisdomiseLogo /> */}
          </div>
          <div className="flex flex-col gap-7 mobile:text-base text-lg [&>*]:pb-7 mobile:[&>*]:pb-4">
            <div className="border-white/20 border-b">
              <div className="flex justify-between">
                <span>{plan.name}</span>
                <span>${plan.price}</span>
              </div>
              <p className="mobile:mt-4 mt-6 text-sm text-white/50">
                {plan.description}
              </p>
            </div>

            <div className="flex justify-between border-white/20 border-b">
              <span>{t('crypto-modal.subtotal')}</span>
              <span>${plan.price}</span>
            </div>

            <div className="flex justify-between">
              <span>{t('crypto-modal.total-due-today')}</span>
              <span>${plan.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
