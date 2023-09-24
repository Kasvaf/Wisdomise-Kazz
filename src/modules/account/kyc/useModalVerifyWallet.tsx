import { bxInfoCircle, bxLinkExternal } from 'boxicons-quasar';
import React from 'react';
import Button from 'shared/Button';
import Banner from 'shared/Banner';
import useModal from 'shared/useModal';
import Icon from 'modules/shared/Icon';
import screenshot from './screenshot.png';

const ModalVerifyWallet: React.FC<{ onResolve?: () => void }> = () => (
  <div className="text-white">
    <h1 className="mb-8 text-center text-sm font-semibold text-white">
      Wallet Verification
    </h1>

    <Banner icon={bxInfoCircle} className="mb-10">
      <span className="text-white/60">
        Please be aware that we currently only support{' '}
        <span className="text-white">USDT</span> as a cryptocurrency.
      </span>
    </Banner>

    <div className="flex flex-col gap-2 md:flex-row">
      <div className="md:basis-1/2">
        <div className="text-xs text-white/60">
          To send us your USDT wallet address and network, you need to follow
          these steps in your Trust wallet:
        </div>

        <ol className="ml-6 mt-6 list-decimal">
          <li>
            Select USDT coin on your preferred network (
            {['TRC20', 'ERC20', 'BEP20'].map((x, i) => (
              <React.Fragment key={x}>
                <span className="rounded-full bg-black/50 px-1">{x}</span>
                {i < 2 && ', '}
              </React.Fragment>
            ))}
            ).
          </li>
          <li>Choose receive button.</li>
          <li>
            Take a screenshot of the page that shows your deposit wallet address
            and network for USDT.
          </li>
          <li>
            Attach the screenshot to an email and send it to our support email:{' '}
            <a
              href="mailto:support@wisdomise.io"
              target="_blank"
              className="font-bold underline"
              rel="noreferrer noopener"
            >
              support@wisdomise.io
            </a>
            .
          </li>
        </ol>
      </div>
      <div className="flex flex-col justify-center rounded-3xl bg-[#4C5059] p-4 pt-2 text-[12px] md:basis-1/2">
        <div className="mb-2 text-center font-normal">
          <strong className="font-medium">Example</strong>: USDT Wallet Address
        </div>
        <img src={screenshot} />
      </div>
    </div>

    <div className="mt-6 flex justify-center md:-mt-12 md:justify-start">
      <Button
        variant="primary"
        to="mailto:support@wisdomise.io"
        target="_blank"
        className="items-center justify-between"
      >
        Send Email
        <Icon name={bxLinkExternal} className="ml-2" />
      </Button>
    </div>
  </div>
);

const useModalVerifyWallet = (): [JSX.Element, () => void] => {
  const [Component, update] = useModal(ModalVerifyWallet, { width: 590 });
  return [Component, async () => Boolean(await update({}))];
};
export default useModalVerifyWallet;
