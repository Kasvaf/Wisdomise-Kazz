import { Crisp } from 'crisp-sdk-web';
import { useUserInfoQuery } from 'api';
import logout from 'modules/auth/logout';
import { ReactComponent as LogoutIcon } from '../Header/logout.svg';
import WalletDropdownContent from '../WalletDropdown/WalletDropdownContent';
import { ReactComponent as SupportIcon } from './support.svg';

const openCrisp = () => Crisp.chat.open();

interface Props {
  onClose: () => void;
}

const ExtraContent: React.FC<Props> = ({ onClose }) => {
  const { data } = useUserInfoQuery();

  return (
    <div className="mb-4 w-[calc(100vw-2rem)] rounded-3xl bg-white px-4 py-6">
      <div className="flex items-center rounded-3xl bg-black/5 p-2">
        {data?.customer.info.picture ? (
          <img
            className="mr-3 h-8 w-8 rounded-full"
            src={data?.customer.info.picture}
          />
        ) : (
          <div className="mr-3 flex h-12 w-12  items-center justify-center rounded-full bg-black/10 p-3">
            {data?.customer.nickname.charAt(0)}
          </div>
        )}

        <div className="text-base font-semibold text-black">
          {data?.customer.nickname}
          <p className="text-xxs leading-none text-black/60">
            {data?.customer.user.email}
          </p>
        </div>
      </div>

      <div className="flex">
        <div
          className="mr-2 mt-2 flex basis-1/3 items-center justify-center rounded-3xl bg-black/5 p-2"
          onClick={openCrisp}
        >
          <SupportIcon className="mr-2" />
          Support
        </div>
        <div className="mt-2 flex basis-2/3 items-center justify-center rounded-3xl bg-black/5 p-2">
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-start  text-xs font-medium uppercase text-error"
          >
            <LogoutIcon className="mr-2" /> Logout
          </button>
        </div>
      </div>
      <div className="mt-2 rounded-3xl bg-black/5 p-4">
        <WalletDropdownContent closeDropdown={onClose} />
      </div>
    </div>
  );
};

export default ExtraContent;
