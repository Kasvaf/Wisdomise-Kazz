import Delta from "containers/dashboard/common/Delta";
import { ChangeEvent, FunctionComponent, useState } from "react";

export interface GainCalculatorProps {
  label: string;
  mainTitle: string;
  compareTitle: string;
  mainRatio: number;
  compareRatio: number;
}

const GainCalculator: FunctionComponent<GainCalculatorProps> = ({
  label,
  mainTitle,
  compareTitle,
  mainRatio,
  compareRatio,
}) => {
  const [amount, setAmount] = useState<string | undefined>("1000");

  const updateAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const data = [
    {
      title: mainTitle,
      ratio: mainRatio,
    },
    { title: compareTitle, ratio: compareRatio },
  ];
  return (
    <div className="dashboard-panel md:space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <div className="w-full md:w-1/3">
          <span className="text-sm text-nodata md:text-base">{label}</span>
          <div className="relative mt-4 w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="absolute top-0 z-10 ml-4 mt-3 text-xs  uppercase text-nodata/40">
              Amount
            </label>
            <input
              value={amount}
              onChange={updateAmount}
              type="number"
              className="horos-input setting"
              name="amount"
              placeholder="Enter the amount"
              disabled
            />
          </div>
        </div>

        <div className="flex w-full flex-row space-x-4 md:w-2/3 md:space-x-8">
          {data.map(({ title, ratio }) => (
            <div
              className="h-fill flex w-1/2 flex-row items-center justify-center rounded-md bg-bgcolor py-4 md:py-0"
              key={title}
            >
              <div className="flex flex-col items-center space-y-3 md:space-y-6">
                <span className="text-xs text-nodata md:text-base">
                  {title}
                </span>
                <div className="flex flex-row items-center justify-center space-x-2">
                  <span className="font-campton text-base text-white md:text-2xl">
                    ${((Number(amount) * (100 + ratio)) / 100).toFixed(0)}
                  </span>
                  <Delta value={ratio} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GainCalculator;
