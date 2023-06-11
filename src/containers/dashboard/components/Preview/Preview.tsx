import Button from "components/Button";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BUTTON_TYPE } from "utils/enums";
import { gaClick } from "utils/ga";
import Signals from "../Signals";

const Preview: React.FC = () => {
  const navigate = useNavigate();

  const renderHeader = (
    title: string | ReactNode,
    description: string | ReactNode
  ) => (
    <div className="flex flex-col space-y-2">
      <p className="text-lg text-white md:text-xl">{title}</p>
      <p className="text-sm text-white/70 md:text-base">{description}</p>
    </div>
  );

  return (
    <>
      <div className="mt-5 flex w-full flex-col space-y-5 rounded bg-gray-dark p-5 max-sm:mb-16">
        {renderHeader("Predictions", "Last open predictions")}
        <Signals {...{ previewMode: true }} />
        <Button
          text="Show More"
          onClick={() => {
            gaClick("show signals click");
            navigate("/app/signals");
          }}
          type={BUTTON_TYPE.FILLED}
          className="mx-auto w-fit uppercase"
        />
      </div>
    </>
  );
};

export default Preview;
