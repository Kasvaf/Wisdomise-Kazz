import { ReactComponent as InfoIcon } from "@images/info.svg";
import { Tooltip } from "antd";
import { find } from "lodash";
import { FunctionComponent, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gaClick } from "utils/ga";
import { TabLabels } from "../types";

export interface MenuTab {
  id: string;
  label: string;
  tooltip?: string;
  soon?: boolean;
}

interface MenuTabsProps {
  tabs: MenuTab[];
  activeTab: MenuTab;
  dashboardSection: TabLabels;
  setActiveTab: (tab: MenuTab) => unknown;
}

const MenuTabs: FunctionComponent<MenuTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  dashboardSection,
}) => {
  const navigate = useNavigate();
  const { section, subsection } = useParams();
  const handleTabClick = useCallback(
    (tab: MenuTab) => {
      setActiveTab(tab);
      // navigate(`/app/${dashboardSection}/${tab.id}`);
    },
    [dashboardSection, navigate, setActiveTab]
  );

  useEffect(() => {
    if (section !== dashboardSection) return;
    if (subsection) {
      setActiveTab(find(tabs, (t) => t.id === subsection) as MenuTab);
    } else {
      handleTabClick(tabs[0]);
    }
  }, [
    section,
    subsection,
    handleTabClick,
    setActiveTab,
    tabs,
    dashboardSection,
  ]);

  return (
    <div className="dashboard-tabs">
      {tabs.map((tab: MenuTab) => (
        <button
          key={tab.id}
          className={`dashboard-tab ${activeTab.id === tab.id ? "active" : ""}`}
          onClick={() => {
            gaClick(tab.label + " sub tab click");
            handleTabClick(tab);
          }}
          disabled={tab.soon}
        >
          <span className="whitespace-nowrap text-left">
            {tab.label}
            {tab.soon && <span className="text-white/50">&nbsp;(SOON)</span>}
            {tab.tooltip && (
              <Tooltip placement="bottom" title={tab.tooltip}>
                <InfoIcon
                  className={`tab-info ml-2 inline-block ${
                    tab.soon ? "tab-soon" : ""
                  }`}
                />
              </Tooltip>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MenuTabs;
