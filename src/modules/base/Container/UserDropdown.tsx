import { bxChevronDown, bxLogOut, bxUser } from 'boxicons-quasar';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAccountQuery } from 'api';
import Icon from 'shared/Icon';
import { logout } from 'modules/auth/authHandlers';
import DropdownContainer from './DropdownContainer';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const { data: account } = useAccountQuery();
  const email = account?.email;
  const nickname = account?.nickname;

  const button = (
    <div className="flex cursor-pointer items-center justify-start gap-3">
      <div>
        <p className="inline-block h-10 w-10 self-start rounded-full bg-white/5 text-center text-xl leading-10 text-white">
          {(nickname || email)?.charAt(0).toLocaleUpperCase()}
        </p>
      </div>

      <button className="flex font-medium text-white mobile:hidden">
        <Icon name={bxChevronDown} className="w-6" />
      </button>
    </div>
  );

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer className="!px-0 py-6" setOpen={setOpen}>
        {email && (
          <div className="w-full truncate p-2 px-8 pb-4 text-nodata">
            {email}
          </div>
        )}

        <NavLink
          type="button"
          to="/account/profile"
          className="flex items-center justify-start px-8 py-2 !text-white hover:bg-black/10"
        >
          <Icon name={bxUser} className="mr-2" />
          Profile Dashboard
        </NavLink>

        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-start px-8 py-2 uppercase text-error hover:bg-black/10"
        >
          <Icon name={bxLogOut} className="mr-2" /> Logout
        </button>
      </DropdownContainer>
    ),
    [email],
  );

  return (
    <>
      <div className="hidden mobile:block">{button}</div>
      <div className="mobile:hidden">
        <Dropdown
          open={open}
          trigger={['click']}
          onOpenChange={setOpen}
          dropdownRender={dropDownFn}
        >
          <div className="flex cursor-pointer items-center justify-start gap-3">
            <div>
              <p className="inline-block h-10 w-10 self-start rounded-full bg-white/5 text-center text-xl leading-10 text-white">
                {(nickname || email)?.charAt(0).toLocaleUpperCase()}
              </p>
            </div>

            <button className="flex font-medium text-white mobile:hidden">
              <Icon name={bxChevronDown} className="w-6" />
            </button>
          </div>
        </Dropdown>
      </div>
    </>
  );
};

export default UserDropdown;
