import { useTranslation } from 'react-i18next';
import { PageTitle } from 'shared/PageTitle';
import { PageCard } from 'shared/PageCard';
import { trackClick } from 'config/segment';
import { ReactComponent as WsdmIcon } from './icon/wsdm.svg';
import { ReactComponent as WisdomiseIcon } from './icon/wisdomise.svg';
import { ReactComponent as LockIcon } from './icon/lock.svg';
import { ReactComponent as AirdropIcon } from './icon/airdrop.svg';

export default function WsdmSection() {
  const { t } = useTranslation('home');

  return (
    <section>
      <PageTitle
        icon={WsdmIcon}
        title={t('wsdm.title')}
        description={t('wsdm.sub-title')}
      />

      <section className="mt-8 grid grid-cols-3 gap-4 mobile:grid-cols-1">
        <div className="hidden">
          <PageCard
            icon={AirdropIcon}
            to="/account/token"
            title={t('wsdm.claim-airdrop.title')}
            onClick={trackClick('onboarding_WSDM_aridrop')}
            description={t('wsdm.claim-airdrop.description')}
          />
        </div>
        <PageCard
          icon={WisdomiseIcon}
          to="/account/token"
          videoId="s-Z27Phzqu8"
          title={t('wsdm.activate-utility.title')}
          onClick={trackClick('onboarding_WSDM_utility')}
          description={t('wsdm.activate-utility.description')}
        />
        <PageCard
          icon={LockIcon}
          to="/account/token"
          videoId="jdMFq0vU7-U"
          title={t('wsdm.vesting-schedule.title')}
          onClick={trackClick('onboarding_WSDM_vesting')}
          description={t('wsdm.vesting-schedule.description')}
        />
      </section>
    </section>
  );
}
