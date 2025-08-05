import { clsx } from 'clsx';
import { useTelegramProfile } from 'modules/base/mini-app/TelegramProvider';
import Logo from 'assets/logo-white.svg';
import blurBg from './blur.png';
import box from './box.png';

const BtnTelegramProfile: React.FC<{ className?: string }> = ({
  className,
}) => {
  const profile = useTelegramProfile();

  if (!profile?.first_name) {
    return <img src={Logo} className={clsx('h-8', className)} alt="logo" />;
  }

  return (
    <div
      className={clsx(
        'flex w-full max-w-[180px] items-center rounded-lg pr-2 hover:bg-black/20',
        className,
      )}
    >
      <div className="relative shrink-0 rounded-lg bg-brand-gradient p-px">
        <div className="relative">
          {profile?.photo_url ? (
            <img
              src={profile?.photo_url}
              className="size-[40px] rounded-lg"
              alt=""
            />
          ) : (
            <div className="size-[40px] bg-v1-surface-l3 flex items-center justify-center rounded-lg">
              {(profile?.first_name ?? profile.username)[0].toUpperCase()}
            </div>
          )}
        </div>
        <img
          src={blurBg}
          className="min-w-20 pointer-events-none absolute -bottom-10 -right-10 h-20"
          alt=""
        />
        <img
          src={box}
          alt="box"
          className="pointer-events-none absolute -bottom-5 -right-5"
          style={{ animation: '2s shake infinite' }}
        />
      </div>

      <div className="ml-2 w-[calc(100%-44px)]">
        <div className="text-nowrap w-full overflow-hidden text-ellipsis text-sm">
          {profile?.first_name} {profile?.last_name}
        </div>
        <div className="text-nowrap text-v1-content-secondary w-full overflow-hidden text-ellipsis text-xs">
          {profile.username}
        </div>
      </div>
    </div>
  );
};

export default BtnTelegramProfile;
