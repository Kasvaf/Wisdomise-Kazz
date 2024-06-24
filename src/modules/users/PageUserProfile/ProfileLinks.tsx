import { clsx } from 'clsx';
import { type SVGProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type CommunityProfile } from 'api';
import Button from 'shared/Button';
import {
  DiscordIcon,
  LinkIcon,
  LinkedinIcon,
  MailIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '../../account/PageProfile/assets';

type ProfileLinkType = keyof Pick<
  CommunityProfile,
  | 'discord'
  | 'linked_in'
  | 'support_email'
  | 'youtube'
  | 'website'
  | 'twitter'
  | 'telegram'
>;

const getProfileLinkProps = (link: string | null, bindTo: ProfileLinkType) => {
  if (bindTo !== 'support_email')
    return {
      to: link?.startsWith('https://') ? link || '' : '',
      target: '_blank',
    };

  return {
    to: link ? `mailto:${link || ''}` : '',
  };
};

const useProfileLinks = (): Array<{
  icon: FC<SVGProps<SVGSVGElement>>;
  label?: string;
  bindTo: ProfileLinkType;
}> => {
  const { t } = useTranslation();
  return [
    {
      icon: MailIcon,
      label: t('accounts:page-profile.inputs.support_email'),
      bindTo: 'support_email',
    },
    {
      icon: LinkIcon,
      label: t('accounts:page-profile.inputs.website'),
      bindTo: 'website',
    },
    {
      icon: TelegramIcon,
      bindTo: 'telegram',
    },
    {
      icon: TwitterIcon,
      bindTo: 'twitter',
    },
    {
      icon: DiscordIcon,
      bindTo: 'discord',
    },
    {
      icon: YoutubeIcon,
      bindTo: 'youtube',
    },
    {
      icon: LinkedinIcon,
      bindTo: 'linked_in',
    },
  ];
};

export const ProfileLinks: FC<{
  className?: string;
  profile?: CommunityProfile;
}> = ({ className, profile }) => {
  const links = useProfileLinks();
  return (
    <div
      className={clsx(
        'flex max-w-full items-center gap-2 overflow-auto mobile:items-start',
        className,
      )}
    >
      {links
        .filter(link => !!link.label && !!profile?.[link.bindTo])
        .map(({ icon: Icon, bindTo, label }) => (
          <Button
            key={bindTo}
            {...getProfileLinkProps(profile?.[bindTo] || null, bindTo)}
            variant="alternative"
            size="manual"
            className="flex h-8 shrink-0 items-center !rounded-lg px-3"
            contentClassName="flex items-center gap-1 font-light text-[13px]"
          >
            <Icon className="h-5 w-5" /> {label}
          </Button>
        ))}
      {links.some(link => !!profile?.[link.bindTo]) && (
        <div className="mx-1 h-6 w-[1px] shrink-0 bg-white/10" />
      )}
      {links
        .filter(link => !link.label && !!profile?.[link.bindTo])
        .map(({ icon: Icon, bindTo }) => (
          <Button
            key={bindTo}
            {...getProfileLinkProps(profile?.[bindTo] || null, bindTo)}
            variant="alternative"
            size="manual"
            className="flex h-8 w-8 shrink-0 items-center justify-center !rounded-lg"
            contentClassName="flex items-center gap-1 font-light text-[13px]"
          >
            <Icon className="h-6 w-6" />
          </Button>
        ))}
    </div>
  );
};
