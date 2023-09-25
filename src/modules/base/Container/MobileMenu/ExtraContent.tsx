import { Crisp } from 'crisp-sdk-web';
import { bxLogOut, bxSupport, bxUser } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import { useAccountQuery, useInvestorAssetStructuresQuery } from 'api';
import Icon from 'shared/Icon';
import { logout } from 'modules/auth/authHandlers';
import WalletDropdownContent from '../WalletDropdown/WalletDropdownContent';

const openCrisp = () => Crisp.chat.open();

interface Props {
  onClose: () => void;
}

const ExtraContent: React.FC<Props> = ({ onClose }) => {
  const { data } = useAccountQuery();
  const ias = useInvestorAssetStructuresQuery();
  const hasWallet = Boolean(ias?.data?.[0]?.main_exchange_account);

  return (
    <div
      className="mb-4 w-[calc(100vw-2rem)] rounded-3xl bg-white px-4 py-6"
      onClick={onClose}
    >
      <div className="flex items-center rounded-3xl bg-black/5 p-2">
        {data?.info.picture ? (
          <img className="mr-3 h-8 w-8 rounded-full" src={data?.info.picture} />
        ) : (
          <div className="mr-3 flex h-12 w-12  items-center justify-center rounded-full bg-black/10 p-3">
            {data?.nickname?.charAt(0)}
          </div>
        )}

        <div className="text-base font-semibold text-black">
          {data?.nickname}
          <p className="text-xxs leading-none text-black/60">{data?.email}</p>
        </div>
      </div>

      <div>
        <NavLink
          to="/account/profile"
          className="mt-2 flex items-center justify-start rounded-3xl bg-black/5 p-2 text-xs font-medium"
        >
          <Icon name={bxUser} className="mr-2" />
          Profile Dashboard
        </NavLink>
      </div>

      <div className="mt-2 flex">
        <div
          className="mr-2 flex items-center justify-center rounded-3xl bg-black/5 p-2"
          onClick={openCrisp}
        >
          <Icon name={bxSupport} />
        </div>

        <div className="flex flex-1 items-center justify-center rounded-3xl bg-black/5 p-2">
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-start text-xs font-medium uppercase text-error"
          >
            <Icon name={bxLogOut} className="mr-2" /> Logout
          </button>
        </div>
      </div>
      {hasWallet && (
        <div className="mt-2 rounded-3xl bg-black/5 p-4">
          <WalletDropdownContent />
        </div>
      )}
    </div>
  );
};

export default ExtraContent;
