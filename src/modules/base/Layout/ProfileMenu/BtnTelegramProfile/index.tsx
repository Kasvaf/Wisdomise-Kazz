import Logo from 'assets/logo-white.svg';
import { clsx } from 'clsx';
import { useTelegramProfile } from 'modules/base/mini-app/TelegramProvider';
import blurBg from './blur.png';
import box from './box.png';

const BtnTelegramProfile: React.FC<{ className?: string }> = ({
  className,
}) => {
  const profile = useTelegramProfile();

  if (!profile?.first_name) {
    return <img alt="logo" className={clsx('h-8', className)} src={Logo} />;
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
              alt=""
              className="size-[40px] rounded-lg"
              src={profile?.photo_url}
            />
          ) : (
            <div className="flex size-[40px] items-center justify-center rounded-lg bg-v1-surface-l3">
              {(profile?.first_name ?? profile.username)[0].toUpperCase()}
            </div>
          )}
        </div>
        <img
          alt=""
          className="-bottom-10 -right-10 pointer-events-none absolute h-20 min-w-20"
          src={blurBg}
        />
        <img
          alt="box"
          className="-bottom-5 -right-5 pointer-events-none absolute"
          src={box}
          style={{ animation: '2s shake infinite' }}
        />
      </div>

      <div className="ml-2 w-[calc(100%-44px)]">
        <div className="w-full overflow-hidden text-ellipsis text-nowrap text-sm">
          {profile?.first_name} {profile?.last_name}
        </div>
        <div className="w-full overflow-hidden text-ellipsis text-nowrap text-v1-content-secondary text-xs">
          {profile.username}
        </div>
      </div>
    </div>
  );
};

export default BtnTelegramProfile;
