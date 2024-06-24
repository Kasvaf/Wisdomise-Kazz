import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { type CommunityProfile } from 'api';
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
      <div className="relative w-full overflow-hidden rounded-xl pb-[16.8%] mobile:pb-[37%]">
        <ProfilePhoto
          className="absolute left-0 top-0 h-full w-full bg-[#1e1f24]"
          src={profile?.profile_cover}
          type="cover"
        />
        {isEditable && (
          <ImageUploader
            target="profile_cover"
            className="!absolute bottom-0 right-0 m-4 mobile:!top-0 mobile:m-2"
            onChange={newImage =>
              onChange?.({
                profile_cover: typeof newImage === 'string' ? newImage : null,
              })
            }
            recommendedRatio={[1228, 206]}
          >
            <Button
              size="manual"
              variant="alternative"
              className="h-9 !rounded-lg px-4 backdrop-blur-md mobile:h-7 mobile:px-2"
              contentClassName="mobile:text-xxs"
            >
              <CameraIcon className="mr-2 h-5 w-5" />
              {t('accounts:profile-header.change-header')}
            </Button>
          </ImageUploader>
        )}
      </div>
      <div className="relative -mt-7 flex items-center gap-4 pl-9 pr-4 mobile:w-full mobile:flex-col mobile:!px-4">
        <div className="relative shrink-0">
          <ProfilePhoto
            className="size-[120px] rounded-full shadow-lg mobile:size-[80px]"
            src={profile?.profile_image}
            type="avatar"
          />
          {isEditable && (
            <ImageUploader
              target="profile_image"
              onChange={newImage =>
                onChange?.({
                  profile_image: typeof newImage === 'string' ? newImage : null,
                })
              }
              recommendedRatio={[128, 128]}
              className="!absolute bottom-0 right-0 h-8 w-8 mobile:-m-1"
            >
              <Button
                size="manual"
                variant="purple"
                className="h-full w-full shadow"
                contentClassName="w-full"
              >
                <CameraIcon className="!h-5 !w-5" />
              </Button>
            </ImageUploader>
          )}
        </div>
        <div className="mt-2 flex flex-col mobile:mt-0 mobile:items-center">
          <p className="text-3xl mobile:text-lg">
            <span
              className={clsx(
                'flex items-center gap-2 mobile:flex-col',
                !profile && 'animate-pulse',
              )}
            >
              <span
                className={clsx(
                  'max-w-64 truncate lg:max-w-96',
                  profile?.nickname
                    ? 'font-bold'
                    : 'text-2xl font-extralight opacity-70 mobile:text-base',
                )}
              >
                {profile?.nickname || (
                  <>
                    {isEditable
                      ? t('accounts:profile-header.unknown-nickname')
                      : truncateUserId(userId)}
                  </>
                )}
              </span>
              {profile?.verified && (
                <VerifiedBadge className="shrink-0 mobile:!h-6" />
              )}
            </span>
          </p>
          <p className="mt-1 text-sm mobile:text-[13px]">
            {isEditable ? (
              <span className="flex items-center gap-2 text-white/50 mobile:flex-col mobile:items-end mobile:gap-0">
                {profile?.support_email || '---'}
                <span className="text-xxs text-white/30">
                  ({t('accounts:profile-header.cant-change')})
                </span>
              </span>
            ) : (
              joinDateObject && (
                <span className="flex items-center gap-2">
                  <span className="text-xs font-light text-white/30">
                    {t('accounts:profile-header.from')}
                  </span>
                  <span className="text-xs font-light">
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
