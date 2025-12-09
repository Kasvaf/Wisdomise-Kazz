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
      <div className="w-3/4 max-md:w-full max-md:px-8 max-md:py-12">
        <div className="flex items-center gap-3 max-md:hidden">
          <p className="text-white text-xl">{t('crypto-modal.title')}</p>
        </div>

        {/* <LogoWithText className="hidden max-md:block" /> */}

        <p className="mt-14 text-white/50 text-xl max-md:mt-10">
          {t('crypto-modal.subtitle', { plan: plan.name ?? '' })}
        </p>

        <div className="mt-6 flex items-center gap-5">
          <p className="text-[40px] text-white max-md:text-3xl">
            ${plan.price}
          </p>
          <p className="text-lg text-white/50 max-md:text-sm">
            <Periodicity periodicity={plan.periodicity} />
          </p>
        </div>

        <div className="mt-12 flex gap-6 max-md:mt-8 max-md:gap-4">
          <div className="h-14 w-14 basis-14 max-md:hidden">
            {/* <WisdomiseLogo /> */}
          </div>
          <div className="flex flex-col gap-7 text-lg max-md:text-base [&>*]:pb-7 max-md:[&>*]:pb-4">
            <div className="border-white/20 border-b">
              <div className="flex justify-between">
                <span>{plan.name}</span>
                <span>${plan.price}</span>
              </div>
              <p className="mt-6 text-sm text-white/50 max-md:mt-4">
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
