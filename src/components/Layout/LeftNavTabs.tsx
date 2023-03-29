import { tabs } from "containers/dashboard/constants";
import { Tab, TabLabels } from "containers/dashboard/types";
import TabButton from "./TabButton";

interface IProps {
  collapseNavbar: boolean;
  setSelectedTab?: (t: Tab) => void;
  setShowMenu: (s: boolean) => void;
}

export default function LeftNavTabs({
  collapseNavbar,
  setSelectedTab,
  setShowMenu,
}: IProps) {
  return (
    <div className="space-y-4 text-inactive">
      {Object.keys(tabs).map((t) => {
        const tab = tabs[t as TabLabels];
        return tab.hidden ? (
          <span key={t}></span>
        ) : (
          <TabButton
            key={t}
            tab={tab}
            collapseNavbar={collapseNavbar}
            setSelectedTab={setSelectedTab}
            setShowMenu={setShowMenu}
          />
        );
      })}
    </div>
  );
}
