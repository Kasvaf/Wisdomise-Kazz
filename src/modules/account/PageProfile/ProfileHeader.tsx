import type { CommunityProfile } from 'api';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
      <div className="relative w-full overflow-hidden rounded-xl mobile:pb-[37%] pb-[16.8%]">
        <ProfilePhoto
          className="absolute top-0 left-0 h-full w-full bg-[#1e1f24]"
          src={profile?.profile_cover}
          type="cover"
        />
        {isEditable && (
          <ImageUploader
            className="!absolute mobile:!top-0 right-0 bottom-0 m-4 mobile:m-2"
            onChange={newImage =>
              onChange?.({
                profile_cover: typeof newImage === 'string' ? newImage : null,
              })
            }
            recommendedRatio={[1228, 206]}
            target="profile_cover"
          >
            <Button
              className="!rounded-lg h-9 mobile:h-7 mobile:px-2 px-4 backdrop-blur-md"
              contentClassName="mobile:text-xxs"
              size="manual"
              variant="alternative"
            >
              <CameraIcon className="mr-2 h-5 w-5" />
              {t('accounts:profile-header.change-header')}
            </Button>
          </ImageUploader>
        )}
      </div>
      <div className="-mt-7 mobile:!px-4 relative flex mobile:w-full mobile:flex-col items-center gap-4 pr-4 pl-9">
        <div className="relative shrink-0">
          <ProfilePhoto
            className="mobile:size-[80px] size-[120px] rounded-full shadow-lg"
            src={profile?.profile_image}
            type="avatar"
          />
          {isEditable && (
            <ImageUploader
              className="!absolute mobile:-m-1 right-0 bottom-0 h-8 w-8"
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
        <div className="mobile:mt-0 mt-2 flex flex-col mobile:items-center">
          <p className="mobile:text-lg text-3xl">
            <span
              className={clsx(
                'flex mobile:flex-col items-center gap-2',
                !profile && 'animate-pulse',
              )}
            >
              <span
                className={clsx(
                  'max-w-64 truncate lg:max-w-96',
                  profile?.nickname
                    ? 'font-bold'
                    : 'font-extralight mobile:text-base text-2xl opacity-70',
                )}
              >
                {profile?.nickname ||
                  (isEditable
                    ? t('accounts:profile-header.unknown-nickname')
                    : truncateUserId(userId))}
              </span>
              {profile?.verified && (
                <VerifiedBadge className="mobile:!h-6 shrink-0" />
              )}
            </span>
          </p>
          <p className="mt-1 mobile:text-[13px] text-sm">
            {isEditable ? (
              <span className="flex mobile:flex-col mobile:items-end items-center gap-2 mobile:gap-0 text-white/50">
                {profile?.support_email || '---'}
                <span className="text-white/30 text-xxs">
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
