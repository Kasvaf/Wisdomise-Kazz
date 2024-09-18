import { SUPPORT_EMAIL } from 'config/constants';
import useConfirm from 'shared/useConfirm';

export default function useModalApiKey() {
  return useConfirm({
    noTitle: '',
    yesTitle: 'OK',
    message: (
      <div>
        <p>
          In order to continue with setting up your account, please send your
          Binance API Key and Secret Key to{' '}
          <a href="mailto:support@wisdomise.io" className="underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <p className="mt-2">
          {' '}
          Please also make sure during the creation of your API key, enable Spot
          trading and whitelist the following IPs:
        </p>
        <ul className="ml-4 mt-2 list-disc">
          <li>3.28.0.105</li>
          <li>3.28.99.117</li>
          <li>3.29.176.241</li>
          <li>3.29.188.184</li>
          <li>3.29.69.223</li>
        </ul>
      </div>
    ),
  });
}
