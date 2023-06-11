import { ReactComponent as PositionIcon } from "@images/icons/position-open.svg";
import { PositionType } from "api/types/signal";
import Delta from "containers/dashboard/common/Delta";
import { FunctionComponent } from "react";

interface PositionProps {
  position: PositionType;
  delta: number;
}

const Position: FunctionComponent<PositionProps> = ({ position, delta }) => {
  if (!position) return <span className="text-nodata">-</span>;
  return (
    <div className="flex flex-row items-center justify-between space-x-2 ">
      <span
        className={`position-${
          (delta || 0) < 0 ? "negative" : "positive"
        } position-${position} flex w-16 flex-row items-center space-x-1 capitalize`}
      >
        <PositionIcon />
        <span className="w-11">{position}</span>
      </span>
      <div className="-mb-2 w-full max-w-[6rem]">
        {delta !== null && <Delta value={delta} />}
      </div>
    </div>
  );
};

export default Position;
