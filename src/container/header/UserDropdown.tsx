import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { ReactComponent as TransactionIcon } from "@images/transaction.svg";
import { Dropdown } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfoQuery } from "shared/services/services";
import { logout } from "utils/auth";
import { isProduction } from "utils/utils";
import { DropdownContainer } from "./components";
import { ReactComponent as LogoutIcon } from "./logout.svg";

export const UserDropdown = () => {
  const navigate = useNavigate();
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

  return (
    <>
      <div className="hidden mobile:block">{button}</div>
      <div className="mobile:hidden">
        <Dropdown
          open={open}
          trigger={["click"]}
          onOpenChange={setOpen}
          dropdownRender={() => (
            <DropdownContainer className="p-6">
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap   p-2 pb-4 text-nodata">
                {email}
              </div>

              {!isProduction && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/app/transactions");
                  }}
                  className="flex items-center justify-start bg-transparent px-2 text-white "
                >
                  <TransactionIcon className="mr-2 w-[24px]" />
                  Transaction History
                </button>
              )}
              <button type="button" onClick={logout} className="flex justify-start p-2 uppercase text-[#F14056]">
                <LogoutIcon className="mr-2" /> Logout
              </button>
            </DropdownContainer>
          )}
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
