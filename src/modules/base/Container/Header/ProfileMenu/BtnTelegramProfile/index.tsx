import { useTelegramProfile } from 'modules/base/mini-app/TelegramProvider';
import Logo from 'assets/logo.png';
import blurBg from './blur.png';
import box from './box.png';

const BtnTelegramProfile = () => {
  const profile = useTelegramProfile();

  if (!profile?.first_name) {
    return <img src={Logo} className="h-8" alt="logo" />;
  }

  return (
    <div className="flex max-w-[180px] items-center rounded-lg pr-2 hover:bg-black/20">
      <div className="relative shrink-0 rounded-lg bg-wsdm-gradient p-px">
        <div className="relative">
          {profile?.photo_url ? (
            <img
              src={profile?.photo_url}
              className="size-[40px] rounded-lg"
              alt=""
            />
          ) : (
            <div className="flex size-[40px] items-center justify-center rounded-lg bg-v1-surface-l3">
              {(profile?.first_name ?? profile.username)[0].toUpperCase()}
            </div>
          )}
        </div>
        <img
          src={blurBg}
          className="pointer-events-none absolute -bottom-10 -right-10 h-20 min-w-20"
          alt=""
        />
        <img
          src={box}
          alt="box"
          className="pointer-events-none absolute -bottom-5 -right-5"
          style={{ animation: '2s shake infinite' }}
        />
      </div>

      <div className="ml-2 w-[-webkit-fill-available]">
        <div className="w-full overflow-hidden text-ellipsis text-nowrap text-sm">
          {profile?.first_name} {profile?.last_name}
        </div>
        <div className="w-full overflow-hidden text-ellipsis text-nowrap text-xs text-v1-content-secondary">
          {profile.username}
        </div>
      </div>
    </div>
  );
};

export default BtnTelegramProfile;
