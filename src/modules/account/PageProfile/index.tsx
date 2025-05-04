import { useTranslation } from 'react-i18next';
import { type FC, type SVGProps, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from 'antd';
import {
  type CommunityProfile,
  useCommunityProfileQuery,
  useCommunityProfileMutation,
  useAccountQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Button from 'shared/Button';
import { Markdown } from 'shared/Markdown';
import TextBox from 'shared/TextBox';
import useIsMobile from 'utils/useIsMobile';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import {
  DiscordIcon,
  EditIcon,
  LinkIcon,
  LinkedinIcon,
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
      hasBack
      title={t('accounts:page-profile.title')}
      loading={profile.isLoading}
      extension={!isMobile && <CoinExtensionsGroup />}
    >
      <ProfileHeader
        className="mb-8"
        userId={account.data?.key || ''}
        profile={
          profile.data && {
            ...profile.data,
            support_email: account.data?.email || null, // the email in me-mode is described: Can't change!
          }
        }
        onChange={newData => {
          void profileMutation.mutateAsync({
            ...newData,
          });
        }}
      />

      <div className="flex items-stretch gap-6 mobile:flex-col">
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
            size="small"
            variant="alternative"
            className="w-full"
            onClick={() => {
              profileInfosForm.reset(profile.data);
              setInfoModal(true);
            }}
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
                value={field.value || ''}
                placeholder={t('accounts:page-profile.inputs.overview')}
                className="h-80 mobile:h-96"
              />
            )}
          />
          <Button
            size="small"
            variant="alternative"
            className="absolute bottom-0 right-0 m-4 !px-8 backdrop-blur-md"
            loading={profileOverviewForm.formState.isSubmitting}
            disabled={!profileOverviewForm.formState.isDirty}
          >
            {t('common:actions.save')}
          </Button>
        </form>
      </div>

      <Modal
        centered
        open={infoModal}
        footer={false}
        width={768}
        onCancel={() => {
          setInfoModal(false);
        }}
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
          <div className="mt-6 grid grid-cols-2 gap-4 mobile:grid-cols-1">
            {infoRows.map(({ bindTo, icon: Icon, label, placeholder }) => (
              <Controller
                key={bindTo}
                control={profileInfosForm.control}
                name={bindTo}
                render={({ field }) => (
                  <TextBox
                    {...field}
                    label={
                      <span className="flex flex-row items-center gap-2 text-xs">
                        <Icon className="h-4 w-4" /> {label}
                      </span>
                    }
                    value={field.value || ''}
                    placeholder={placeholder}
                  />
                )}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-row-reverse justify-center gap-4">
            <Button
              variant="primary"
              loading={profileInfosForm.formState.isSubmitting}
              className="basis-1/3"
              disabled={!profileInfosForm.formState.isDirty}
            >
              {t('common:actions.save')}
            </Button>
            <Button
              variant="secondary"
              className="basis-1/3"
              onClick={e => {
                e.preventDefault();
                setInfoModal(false);
              }}
            >
              {t('common:actions.cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
