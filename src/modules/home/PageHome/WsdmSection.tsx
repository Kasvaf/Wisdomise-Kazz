import { useTranslation } from 'react-i18next';
import Card from './Card';
import { ReactComponent as WsdmIcon } from './icon/wsdm.svg';
import { ReactComponent as WisdomiseIcon } from './icon/wisdomise.svg';
import { ReactComponent as LockIcon } from './icon/lock.svg';
import { ReactComponent as AirdropIcon } from './icon/airdrop.svg';
import Title from './title';

export default function WsdmSection() {
  const { t } = useTranslation('home');

  return (
    <section>
      <Title
        icon={WsdmIcon}
        title={t('wsdm.title')}
        subTitle={t('wsdm.sub-title')}
      />

      <section className="mt-8 grid grid-cols-3 gap-4 mobile:grid-cols-1">
        <div className="hidden">
          <Card
            icon={AirdropIcon}
            to="/account/token"
            title={t('wsdm.claim-airdrop.title')}
            ctaSegmentEvent="onboarding_WSDM_aridrop"
            description={t('wsdm.claim-airdrop.description')}
          />
        </div>
        <Card
          icon={WisdomiseIcon}
          to="/account/token"
          videoId="s-Z27Phzqu8"
          title={t('wsdm.activate-utility.title')}
          ctaSegmentEvent="onboarding_WSDM_utility"
          description={t('wsdm.activate-utility.description')}
        />
        <Card
          icon={LockIcon}
          to="/account/token"
          videoId="jdMFq0vU7-U"
          title={t('wsdm.vesting-schedule.title')}
          ctaSegmentEvent="onboarding_WSDM_vesting"
          description={t('wsdm.vesting-schedule.description')}
        />
      </section>
    </section>
  );
}
