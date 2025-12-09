import PageWrapper from 'modules/base/PageWrapper';
import { type FC, type SVGProps, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  type CommunityProfile,
  useAccountQuery,
  useCommunityProfileMutation,
  useCommunityProfileQuery,
} from 'services/rest';
import Button from 'shared/Button';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { Markdown } from 'shared/Markdown';
import TextBox from 'shared/TextBox';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import {
  DiscordIcon,
  EditIcon,
  LinkedinIcon,
  LinkIcon,
  MailIcon,
  TelegramIcon,
  TwitterIcon,
  UserIcon,
  YoutubeIcon,
} from './assets';
import { ProfileHeader } from './ProfileHeader';

const useInfoRows = (): Array<{
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  placeholder: string;
  bindTo: keyof Pick<
    CommunityProfile,
    | 'discord'
    | 'linked_in'
    | 'nickname'
    | 'support_email'
    | 'youtube'
    | 'website'
    | 'twitter'
    | 'telegram'
  >;
  type: 'text' | 'link' | 'mail';
}> => {
  const { t } = useTranslation();
  return [
    {
      icon: UserIcon,
      label: t('accounts:page-profile.inputs.nickname'),
      placeholder: t('accounts:page-profile.inputs.nickname'),
      bindTo: 'nickname',
      type: 'text',
    },
    {
      icon: MailIcon,
      label: t('accounts:page-profile.inputs.support_email'),
      placeholder: 'you@example.com',
      bindTo: 'support_email',
      type: 'mail',
    },
    {
      icon: LinkIcon,
      label: t('accounts:page-profile.inputs.website'),
      placeholder: 'https://example.com',
      bindTo: 'website',
      type: 'link',
    },
    {
      icon: TelegramIcon,
      label: t('accounts:page-profile.inputs.telegram'),
      placeholder: 'https://t.me/you',
      bindTo: 'telegram',
      type: 'link',
    },
    {
      icon: TwitterIcon,
      label: t('accounts:page-profile.inputs.twitter'),
      placeholder: 'https://x.com/you',
      bindTo: 'twitter',
      type: 'link',
    },
    {
      icon: DiscordIcon,
      label: t('accounts:page-profile.inputs.discord'),
      placeholder: 'https://discord.com/invite/you',
      bindTo: 'discord',
      type: 'link',
    },
    {
      icon: YoutubeIcon,
      label: t('accounts:page-profile.inputs.youtube'),
      placeholder: 'http://youtube.com/@you',
      bindTo: 'youtube',
      type: 'link',
    },
    {
      icon: LinkedinIcon,
      label: t('accounts:page-profile.inputs.linkedin'),
      placeholder: 'https://linkedin.com/in/you',
      bindTo: 'linked_in',
      type: 'link',
    },
  ];
};

export default function PageProfile() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const account = useAccountQuery();
  const profile = useCommunityProfileQuery();
  const profileOverviewForm = useForm<CommunityProfile>();
  const profileInfosForm = useForm<CommunityProfile>();
  const profileMutation = useCommunityProfileMutation();
  const infoRows = useInfoRows();
  const [infoModal, setInfoModal] = useState(false);

  useEffect(() => {
    profileOverviewForm.reset(profile.data);
    profileInfosForm.reset(profile.data);
  }, [profile.data, profileOverviewForm, profileInfosForm]);

  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
      loading={profile.isLoading}
      title={t('accounts:page-profile.title')}
    >
      <ProfileHeader
        className="mb-8"
        onChange={newData => {
          void profileMutation.mutateAsync({
            ...newData,
          });
        }}
        profile={
          profile.data && {
            ...profile.data,
            support_email: account.data?.email || null, // the email in me-mode is described: Can't change!
          }
        }
        userId={account.data?.key || ''}
      />

      <div className="flex items-stretch gap-6 max-md:flex-col">
        <div className="shrink-0 basis-1/3">
          <h2>{t('accounts:page-profile.sections.info')}</h2>
          <hr className="my-2 opacity-10" />
          <div className="flex flex-col gap-2">
            {infoRows.map(({ bindTo, icon: Icon, label }) => (
              <div className="flex items-center gap-2 text-sm" key={bindTo}>
                <Icon className="h-6 w-6" />
                {typeof profile.data?.[bindTo] !== 'string' ||
                !profile.data?.[bindTo] ? (
                  <span className="text-white/30">{label}</span>
                ) : (
                  <span>{profile.data[bindTo] || ''}</span>
                )}
              </div>
            ))}
          </div>
          <hr className="my-2 opacity-10" />
          <Button
            className="w-full"
            onClick={() => {
              profileInfosForm.reset(profile.data);
              setInfoModal(true);
            }}
            size="small"
            variant="alternative"
          >
            {t('accounts:page-profile.buttons.edit_info')}{' '}
            <EditIcon className="ml-2" />
          </Button>
        </div>
        <form
          className="relative grow"
          onSubmit={profileOverviewForm.handleSubmit(data =>
            profileMutation.mutateAsync({
              overview: data.overview,
            }),
          )}
        >
          <h2 className="h-7">
            {t('accounts:page-profile.sections.overview')}
          </h2>
          <Controller
            control={profileOverviewForm.control}
            name="overview"
            render={({ field }) => (
              <Markdown
                {...field}
                className="h-80 max-md:h-96"
                placeholder={t('accounts:page-profile.inputs.overview')}
                value={field.value || ''}
              />
            )}
          />
          <Button
            className="!px-8 absolute right-0 bottom-0 m-4 backdrop-blur-md"
            disabled={!profileOverviewForm.formState.isDirty}
            loading={profileOverviewForm.formState.isSubmitting}
            size="small"
            variant="alternative"
          >
            {t('common:actions.save')}
          </Button>
        </form>
      </div>

      <Dialog
        contentClassName="p-3"
        drawerConfig={{
          position: 'bottom',
        }}
        footer={false}
        mode={isMobile ? 'drawer' : 'modal'}
        onClose={() => {
          setInfoModal(false);
        }}
        open={infoModal}
        surface={2}
      >
        <h2 className="mt-2 text-center text-lg">
          {t('accounts:page-profile.sections.info')}
        </h2>
        <form
          onSubmit={profileInfosForm.handleSubmit(data =>
            profileMutation
              .mutateAsync({
                ...Object.fromEntries(
                  Object.entries(data).filter(([key]) => key !== 'overview'),
                ),
              })
              .finally(() => setInfoModal(false)),
          )}
        >
          <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {infoRows.map(({ bindTo, icon: Icon, label, placeholder }) => (
              <Controller
                control={profileInfosForm.control}
                key={bindTo}
                name={bindTo}
                render={({ field }) => (
                  <TextBox
                    {...field}
                    label={
                      <span className="flex flex-row items-center gap-2 text-xs">
                        <Icon className="h-4 w-4" /> {label}
                      </span>
                    }
                    placeholder={placeholder}
                    value={field.value || ''}
                  />
                )}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-row-reverse justify-center gap-4">
            <Button
              className="basis-1/3"
              disabled={!profileInfosForm.formState.isDirty}
              loading={profileInfosForm.formState.isSubmitting}
              variant="primary"
            >
              {t('common:actions.save')}
            </Button>
            <Button
              className="basis-1/3"
              onClick={e => {
                e.preventDefault();
                setInfoModal(false);
              }}
              variant="secondary"
            >
              {t('common:actions.cancel')}
            </Button>
          </div>
        </form>
      </Dialog>
    </PageWrapper>
  );
}
