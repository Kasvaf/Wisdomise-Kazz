import { clsx } from 'clsx';
import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { ReactComponent as SocialRadar } from './PageSocialRadar/components/social-radar.svg';
import { ReactComponent as TechnicalRadar } from './PageTechnicalRadar/components/technical-radar.svg';
import { ReactComponent as WhaleRadar } from './PageWhaleRadar/components/whale-radar.svg';

const RadarsTabs: FC<{ className?: string }> = ({ className }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation('insight');
  const navigate = useNavigate();

  return (
    <div className={clsx(className)}>
      <p className="mb-1 block text-xs">{t('discover_by.label')}</p>
      <ButtonSelect
        value={pathname}
        onChange={newValue => navigate(newValue)}
        buttonClassName="flex flex-row gap-1 items-center"
        options={[
          {
            label: (
              <>
                <SocialRadar />
                {t('discover_by.social')}
              </>
            ),
            value: '/coin-radar/social-radar',
          },
          {
            label: (
              <>
                <TechnicalRadar />
                {t('discover_by.technical')}
              </>
            ),
            value: '/coin-radar/technical-radar',
          },
          {
            label: (
              <>
                <WhaleRadar />
                {t('discover_by.whale')}
              </>
            ),
            value: '/coin-radar/whale-radar',
          },
        ]}
        size="sm"
        surface={1}
        className="max-w-full"
      />
    </div>
  );
};

export default RadarsTabs;
