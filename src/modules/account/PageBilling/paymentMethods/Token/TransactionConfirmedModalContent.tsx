import { ReactComponent as WisdomiseLogo } from '../../images/wisdomise-logo.svg';

export default function TransactionConfirmedModalContent() {
  return (
    <div className="flex flex-col items-center p-6 text-center">
      <WisdomiseLogo className="animate-pulse" />
      <h3 className="my-5 text-2xl text-white">
        Do not refresh or close your browser
      </h3>
      <p>
        Your transaction has been successfully submitted and is being processed.
        Please wait for the transaction to complete.
      </p>
    </div>
  );
}
