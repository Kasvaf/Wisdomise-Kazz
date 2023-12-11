import useIsMobile from 'utils/useIsMobile';
import ProfileMenuMobile from './ProfileMenuMobile';
import ProfileMenuDesktop from './ProfileMenuDesktop';

const ProfileMenu = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ProfileMenuMobile /> : <ProfileMenuDesktop />;
};

export default ProfileMenu;
