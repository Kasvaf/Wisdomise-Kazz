import { ReactComponent as ChevronDown } from '@images/chevron-down.svg';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import { useUserInfoQuery } from 'api';
import logout from 'modules/auth/logout';
import DropdownContainer from './DropdownContainer';
import { ReactComponent as LogoutIcon } from './Header/logout.svg';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const { data: userInfo } = useUserInfoQuery();
  const email = userInfo?.customer.user.email;
  const nickname = userInfo?.customer.nickname;

  const button = (
    <div className="flex cursor-pointer items-center justify-start gap-3">
      <div>
        <p className="inline-block h-10 w-10 self-start rounded-full bg-white/5 text-center text-xl leading-10 text-white">
          {nickname?.charAt(0).toLocaleUpperCase()}
        </p>
      </div>

      <button className="flex font-medium text-white mobile:hidden">
        <ChevronDown className="w-6 fill-white" />
      </button>
    </div>
  );

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer className="!px-0 py-6">
        {email && (
          <div className="w-full truncate p-2 px-8 pb-4 text-nodata">
            {email}
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          className="flex justify-start px-8 py-2 uppercase text-error hover:bg-black/10"
        >
          <LogoutIcon className="mr-2" /> Logout
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
                {nickname?.charAt(0).toLocaleUpperCase()}
              </p>
            </div>

            <button className="flex font-medium text-white mobile:hidden">
              <ChevronDown className="w-6 fill-white" />
            </button>
          </div>
        </Dropdown>
      </div>
    </>
  );
};

export default UserDropdown;
