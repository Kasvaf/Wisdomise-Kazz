import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxLinkExternal } from 'boxicons-quasar';
import { MAIN_LANDING } from 'config/constants';
import Icon from 'shared/Icon';

const ExternalLinks = () => {
  const { t, i18n } = useTranslation('base');
  const items = [
    { label: t('links.blog'), link: 'https://wisdomise.medium.com/' },
    {
      label: t('links.about-us'),
      link: MAIN_LANDING(i18n.language) + '/about-us/',
    },
  ];

  return (
    <>
      {items.map(item => (
        <NavLink
          key={item.link}
          className="flex w-full items-center gap-2 px-4 font-normal text-v1-content-primary hover:text-v1-content-notice"
          target="_blank"
          to={item.link}
        >
          {item.label}
          <Icon size={12} name={bxLinkExternal} />
        </NavLink>
      ))}
    </>
  );
};

export default ExternalLinks;
