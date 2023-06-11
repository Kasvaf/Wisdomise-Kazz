import { FunctionComponent, useRef, useState } from "react";

import MenuTabs, { MenuTab } from "containers/dashboard/common/MenuTabs";
import { TabLabels } from "containers/dashboard/types";
import { displayActiveTab } from "../../utils";
import SignalsTable from "./components/SignalsTable";

import { Strategy } from "containers/dashboard/common/Filters/constants";

export interface SignalsProps {
  previewMode?: boolean;
}

const tabs: MenuTab[] = [
  {
    id: "hourly",
    label: "Hourly Long",
    tooltip:
      "Hourly Signals provide accurate real-time Long signals on hourly timeframe powered by Wisdomise AI",
  },
  // {
  //   id: 'daily',
  //   label: 'Daily signals',
  //   tooltip:
  //     'Daily Signals provide accurate real-time hourly market monitoring powered by Horos AI',
  // },
  {
    id: "highfreq",
    label: "Hourly Short",
    // 'Horos High Frequency AI Market Signaler provides accurate real-time 1 min and 15 mins market monitoring powered by Horos AI',
    soon: true,
  },
];

const Signals: FunctionComponent<SignalsProps> = (props) => {
  const { previewMode } = props;
  const [activeTab, setActiveTab] = useState<MenuTab>(tabs[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetRef: any = useRef<HTMLDivElement>();
  // const onScreen: boolean = useOnScreen<HTMLDivElement>(targetRef);

  // update notification settings on data fetched

  return (
    <div className="flex w-full flex-col space-y-8" ref={targetRef}>
      {!previewMode && (
        <MenuTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dashboardSection={TabLabels.signals}
        />
      )}

      <div
        className={previewMode ? "" : "dashboard-panel"}
        style={{ display: displayActiveTab(tabs[0], activeTab) }}
      >
        <SignalsTable
          {...{
            type: Strategy.hourly,
            previewMode,
            visible: true,
          }}
        />
      </div>
    </div>
  );
};

export default Signals;
