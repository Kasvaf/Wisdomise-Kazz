import { ReactComponent as ChevronDownIcon } from "@images/chevron-down.svg";
import { Tab } from "containers/dashboard/types";
import { useNavigate } from "react-router-dom";
import { gaClick } from "utils/ga";

interface IProps {
  tab: Tab;
  setShowMenu: (n: boolean) => void;
  collapseNavbar: boolean;
}

export default function TabButton({
  tab,
  setShowMenu,
  collapseNavbar,
}: IProps) {
  const isActiveTab = (label: string) => {
    let path = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1,
      location.pathname.length
    );

    if (path === "app") path = "dashboard";
    return path === label;
  };

  const navigate = useNavigate();

  const handleTabClick = (tab: Tab) => {
    if (!tab.subMenu) {
      if (tab.button) {
        setShowMenu(false);
        gaClick(`tab ${tab.label}`);
        return;
      }
      navigate(`/app/${tab.defaultUrl}`);
      setShowMenu(false);
      gaClick(`tab ${tab.label}`);
    }
  };

  const showTabIcon = (tab: Tab) => {
    const toggleSubMenuItem = {
      WisdomiseAI: true,
      AIautoTrader: true,
    };
    if (tab.subMenu) {
      if (toggleSubMenuItem[tab.hash])
        return <ChevronDownIcon className="rotate-180" />;
      return <ChevronDownIcon />;
    }

    return tab.icon;
  };

  return (
    <div
      className={`button-wrapper  !mb-[20px] ${
        isActiveTab(tab.defaultUrl) ? "nav-btn-active" : ""
      } ${tab.comingSoon ? "disabled" : ""}`}
      key={tab.label}
    >
      <button
        type="button"
        key={tab.label}
        className={`flex h-10 flex-row items-center justify-start pr-8 uppercase 2xl:h-10 ${
          tab.subMenu &&
          "text-[rgba(255, 255, 0.8)] cursor-default !font-normal tracking-wider opacity-50"
        } ${tab.className}`}
        onClick={() => {
          gaClick(tab.label + " tab click");
          handleTabClick(tab);
        }}
        disabled={tab.comingSoon}
      >
        {!tab.subMenu && (
          <div className="ml-[-5px] mr-4">{showTabIcon(tab)}</div>
        )}
        {!collapseNavbar && (
          <div className="flex flex-row justify-start text-base md:text-xs xl:text-sm">
            <span className="text-left">
              <span>{tab.label}</span>

              {tab.comingSoon && (
                <span className="text-[rgba(255, 255, 0.8)] ml-2 rounded-xl bg-[#FFFFFA19] px-2 py-1 text-left uppercase">
                  soon
                </span>
              )}
            </span>
          </div>
        )}
      </button>
      {tab.subMenu && (
        <div
        //   className={`transition-all duration-1000 ${
        //     toggleSubMenuItem[tab.hash] ? 'h-20' : 'h-0'
        //   }
        // `}
        >
          {tab.subMenu.map((item) => {
            return (
              <div
                className={`button-submenu ${
                  isActiveTab(item.defaultUrl) ? "nav-btn-active" : ""
                } ${item.comingSoon ? "disabled" : ""}`}
                key={item.label}
              >
                <button
                  type="button"
                  key={item.label}
                  className={`flex h-10 flex-row items-center justify-start pr-8 uppercase 2xl:h-10 ${
                    tab.className
                  } ${item.comingSoon && "text-[#ffffff80]"}`}
                  onClick={() => {
                    gaClick(item.label + " item click");
                    handleTabClick(item);
                  }}
                  disabled={item.comingSoon}
                >
                  <div className="ml-[-5px] mr-4">{item.icon}</div>
                  {!collapseNavbar && (
                    <div className="flex flex-row justify-start text-base md:text-xs xl:text-sm">
                      <span className="text-left">
                        <span>{item.label}</span>

                        {item.comingSoon && (
                          <span className="text-[rgba(255, 255, 0.8)] ml-2 rounded-xl bg-[#FFFFFA19] px-2 py-1 text-left uppercase">
                            soon
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
