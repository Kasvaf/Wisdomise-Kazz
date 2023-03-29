import { FunctionComponent } from "react";

interface DeltaProps {
  value: number;
}

const Delta: FunctionComponent<DeltaProps> = ({ value }) => {
  return (
    <div
      className={`-mt-2 w-full  rounded-md p-1 text-center text-xs font-bold text-bgcolor md:p-2  md:text-sm ${
        Number(value) > 0 ? "bg-success" : "bg-error"
      } ${Number(value) === 0 ? "bg-nodata" : ""}`}
    >
      {value > 0 ? "+" : ""}
      {value?.toFixed(2)}%
    </div>
  );
};

export default Delta;
