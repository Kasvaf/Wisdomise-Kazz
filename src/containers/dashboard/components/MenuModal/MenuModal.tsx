import { tabs } from "../../constants";
import { Tab, TabLabels } from "containers/dashboard/types";
import { useAppSelector } from "store/store";
import { ReactNode } from "react";
import { VERSION } from "config/constants";
interface MenuModalProps {
  showMenu: boolean;
  signOut: () => unknown;
  renderMobileNav: () => ReactNode;
  renderTabButton: (tab: Tab) => ReactNode;
}

function MenuModal({
  showMenu,
  renderTabButton,
  renderMobileNav,
}: MenuModalProps) {
  const userData = useAppSelector((state) => state.user);

  if (!showMenu) return <></>;
  return (
    <div className="fixed top-0 left-0 z-50 h-full w-full bg-bgcolor text-white">
      {renderMobileNav()}
      <div className="flex h-full flex-col justify-start overflow-y-scroll">
        <div className="flex h-full flex-col justify-between space-y-4">
          <div className="horos-navbar flex min-h-fit w-full flex-col justify-start space-y-4 bg-bgcolor text-white/80">
            {Object.keys(tabs).map((t) => {
              const tab = tabs[t as TabLabels];
              return tab.hidden ? <span key={t}></span> : renderTabButton(tab);
            })}

            {/* {renderTabButton(tabs.dashboard)}
            {renderTabButton(tabs.transactions)}
            {renderTabButton(tabs.referral)} */}
            {/* {renderTabButton(tabs.analytics)}
            {renderTabButton(tabs.signals)}
            {renderTabButton(tabs.trading)} */}
            {/* <div className="border-y border-solid border-white/20 py-4 pl-8">
              {userData?.email}
            </div> */}
            {/* {renderTabButton(tabs.settings)}
            {renderTabButton(tabs.logout)} */}
            <div className="p-8 text-center text-sm text-white/20">
              Wisdomise Beta {VERSION}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuModal;
