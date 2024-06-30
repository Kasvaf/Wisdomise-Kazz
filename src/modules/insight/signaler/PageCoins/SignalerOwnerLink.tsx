import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type ItemOwner } from 'api';
import { ProfilePhoto } from 'modules/account/PageProfile/ProfilePhoto';
import { truncateUserId } from 'modules/account/PageProfile/truncateUserId';
import Icon from 'shared/Icon';

const SignalerOwnerLink: React.FC<{
  user?: ItemOwner;
  className?: string;
}> = ({ user, className }) => {
  if (!user) return null;

  return (
    <Link
      to={`/users/${user.key}`}
      className={clsx(
        'flex h-10 items-center justify-between rounded-xl bg-white/5 px-2 text-xs',
        'hover:bg-white/10',
        className,
      )}
    >
      <div className="flex items-center">
        <ProfilePhoto
          className="mr-1 h-5 w-5 rounded-full"
          type="avatar"
          src={user.cprofile.profile_image}
        />
        <span>{user.cprofile?.nickname || truncateUserId(user.key)}</span>
      </div>

      <Icon name={bxRightArrowAlt} size={16} className="ml-3" />
    </Link>
  );
};

export default SignalerOwnerLink;
