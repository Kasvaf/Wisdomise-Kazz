import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserSignalQuery } from 'api/notification';
import { trackClick } from 'config/segment';
import Title from './title';
import { ReactComponent as GuildIcon } from './icon/guide.svg';
import { ReactComponent as ArrowIcon } from './icon/arrow.svg';

// if want to enable rest of card
// 1. uncomment the codes
// 2. remove current if which returns null
export default function GuideSection() {
  const { t } = useTranslation('home');
  const userSignals = useUserSignalQuery();
  // const ias = useInvestorAssetStructuresQuery();
  const hasSubscribedSignal = !!userSignals.data?.results.length;
  // const hasIas = !!ias.data?.length;

  // if (ias.data?.some(r => r.financial_product_instances.length)) {
  //   return null;
  // }

  if (hasSubscribedSignal) return null;

  return (
    <section className="mb-8">
      <Title
        icon={GuildIcon}
        title={t('guide.title')}
        subTitle={t('guid.sub-title')}
      />

      <section className="mt-8 grid grid-cols-3 gap-4 mobile:grid-cols-1">
        <Card
          to="/insight/coins"
          ctaTitle={t('guide.step-1.cta-title')}
          ok={hasSubscribedSignal}
          active={!hasSubscribedSignal}
          title={t('guide.step-1.title')}
          okTitle={t('guide.step-1.ok-title')}
          notOkTitle={t('guide.step-1.not-ok-title')}
          ctaSegmentEvent="onboarding_set_up_signal"
        />
        {/* <Card
          ok={hasIas}
          ctaTitle="Start"
          active={hasSubscribedSignal}
          okTitle="Done - Connected"
          to="/account/exchange-accounts"
          title="2. Connect the Exchange"
          notOkTitle="Haven’t Connected Yet"
        />
        <Card
          okTitle=""
          active={hasIas}
          ctaTitle="Explore"
          to="/investment/products-catalog"
          notOkTitle="Haven’t Selected Yet"
          title="3. Select your Financial Product"
        /> */}
      </section>
    </section>
  );
}

const Card = ({
  ok,
  to,
  title,
  okTitle,
  active,
  ctaTitle,
  notOkTitle,
  ctaSegmentEvent,
}: {
  to: string;
  ok?: boolean;
  title: string;
  okTitle: string;
  active?: boolean;
  ctaTitle: string;
  notOkTitle: string;
  ctaSegmentEvent?: string;
}) => {
  return (
    <section
      className={clsx(
        'rounded-2xl bg-[#1A1C20] px-8 py-6 !text-white/40 mobile:px-6 mobile:py-4',
        active &&
          !ok &&
          'border-[2px] border-[#9747FF] bg-gradient-to-r from-[#1D152766] to-[#1D1527]',
      )}
    >
      <p
        className={clsx(
          'font-semibold mobile:text-sm',
          (active || ok) && 'text-white',
        )}
      >
        {title}
      </p>
      <div className="mt-6 flex items-center">
        <p
          className={clsx(
            'flex gap-1 text-xs',
            active && 'text-[#F1AA40]',
            ok && 'text-[#11C37E]',
          )}
        >
          {ok ? okTitle : notOkTitle}
        </p>
        <NavLink
          to={to}
          onClick={() => ctaSegmentEvent && trackClick(ctaSegmentEvent)}
          className={clsx(
            'invisible ml-auto flex items-center gap-1 text-sm font-medium text-white',
            active && !ok && '!visible',
          )}
        >
          {ctaTitle}
          <ArrowIcon />
        </NavLink>
      </div>
    </section>
  );
};
