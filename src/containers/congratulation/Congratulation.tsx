import { ReactComponent as TickCircleIcon } from "@images/tickCircle.svg";
import { BUTTON_TYPE } from "utils/enums";
import Button from "components/Button";

const Congratulation = (props: {
  onGoToDeposit: any;
  onGoToDashboard: any;
  loading?: boolean;
}) => {
  return (
    <div className="mx-auto mt-[50px] flex  flex-col items-center justify-center">
      <TickCircleIcon />
      <h1 className="mb-7 mt-10 text-3xl text-white">Congratulations! </h1>
      <p className="mb-7 text-center text-lg text-gray-light">
        Thank you for trusting us. You can now deposit any amount to your
        account and activate any of the AI-powered strategies
      </p>
      <div className="mx-5 flex w-full flex-row justify-between gap-5 px-5 pb-10">
        <Button
          type={BUTTON_TYPE.FILLED}
          className="!w-full"
          text="GO to Deposit"
          onClick={() => props.onGoToDeposit()}
          disabled={props.loading}
        />
        <Button
          type={BUTTON_TYPE.OUTLINED}
          className="!w-full"
          text="dashboard"
          disabled={props.loading}
          onClick={() => props.onGoToDashboard()}
        />
      </div>
    </div>
  );
};

export default Congratulation;
