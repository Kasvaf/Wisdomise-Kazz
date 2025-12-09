import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { CommunityProfile } from 'services/rest';
import Button from 'shared/Button';
import { ImageUploader } from 'shared/Uploader';
import { CameraIcon, VerifiedBadge } from './assets';
import { ProfilePhoto } from './ProfilePhoto';
import { truncateUserId } from './truncateUserId';

export const ProfileHeader: FC<{
  userId: string;
  profile?: CommunityProfile;
  className?: string;
  onChange?: (
    newPics: Partial<Pick<CommunityProfile, 'profile_cover' | 'profile_image'>>,
  ) => void;
}> = ({ className, onChange, profile, userId }) => {
  const { t } = useTranslation();
  const isEditable = typeof onChange === 'function';
  const joinDateObject = profile?.active_since
    ? dayjs(profile?.active_since)
    : null;

  return (
    <div className={clsx('relative', className)}>
      <div className="relative w-full overflow-hidden rounded-xl pb-[16.8%] max-md:pb-[37%]">
        <ProfilePhoto
          className="absolute top-0 left-0 h-full w-full bg-[#1e1f24]"
          src={profile?.profile_cover}
          type="cover"
        />
        {isEditable && (
          <ImageUploader
            className="!absolute max-md:!top-0 right-0 bottom-0 m-4 max-md:m-2"
            onChange={newImage =>
              onChange?.({
                profile_cover: typeof newImage === 'string' ? newImage : null,
              })
            }
            recommendedRatio={[1228, 206]}
            target="profile_cover"
          >
            <Button
              className="!rounded-lg h-9 px-4 backdrop-blur-md max-md:h-7 max-md:px-2"
              contentClassName="max-md:text-2xs"
              size="manual"
              variant="alternative"
            >
              <CameraIcon className="mr-2 h-5 w-5" />
              {t('accounts:profile-header.change-header')}
            </Button>
          </ImageUploader>
        )}
      </div>
      <div className="-mt-7 max-md:!px-4 relative flex items-center gap-4 pr-4 pl-9 max-md:w-full max-md:flex-col">
        <div className="relative shrink-0">
          <ProfilePhoto
            className="size-[120px] rounded-full shadow-lg max-md:size-[80px]"
            src={profile?.profile_image}
            type="avatar"
          />
          {isEditable && (
            <ImageUploader
              className="!absolute max-md:-m-1 right-0 bottom-0 h-8 w-8"
              onChange={newImage =>
                onChange?.({
                  profile_image: typeof newImage === 'string' ? newImage : null,
                })
              }
              recommendedRatio={[128, 128]}
              target="profile_image"
            >
              <Button
                className="h-full w-full shadow"
                contentClassName="w-full"
                size="manual"
                variant="purple"
              >
                <CameraIcon className="!h-5 !w-5" />
              </Button>
            </ImageUploader>
          )}
        </div>
        <div className="mt-2 flex flex-col max-md:mt-0 max-md:items-center">
          <p className="text-3xl max-md:text-lg">
            <span
              className={clsx(
                'flex items-center gap-2 max-md:flex-col',
                !profile && 'animate-pulse',
              )}
            >
              <span
                className={clsx(
                  'max-w-64 truncate lg:max-w-96',
                  profile?.nickname
                    ? 'font-bold'
                    : 'font-extralight text-2xl opacity-70 max-md:text-base',
                )}
              >
                {profile?.nickname ||
                  (isEditable
                    ? t('accounts:profile-header.unknown-nickname')
                    : truncateUserId(userId))}
              </span>
              {profile?.verified && (
                <VerifiedBadge className="max-md:!h-6 shrink-0" />
              )}
            </span>
          </p>
          <p className="mt-1 text-sm max-md:text-[13px]">
            {isEditable ? (
              <span className="flex items-center gap-2 text-white/50 max-md:flex-col max-md:items-end max-md:gap-0">
                {profile?.support_email || '---'}
                <span className="text-2xs text-white/30">
                  ({t('accounts:profile-header.cant-change')})
                </span>
              </span>
            ) : (
              joinDateObject && (
                <span className="flex items-center gap-2">
                  <span className="font-light text-white/30 text-xs">
                    {t('accounts:profile-header.from')}
                  </span>
                  <span className="font-light text-xs">
                    {joinDateObject.format('MMM DD YYYY')}
                    {' / '}
                    {joinDateObject.fromNow()}
                  </span>
                </span>
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
