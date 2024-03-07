import { bxRefresh } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { INVESTMENT_FE } from 'config/constants';
import { ReactComponent as WSDMIcon } from './icons/wsdm-token.svg';

export default function Balance() {
  const { t } = useTranslation('wisdomise-token');
  const { data: wsdmBalance, refetch, isLoading } = useWsdmBalance();

  const openInvestmentPanel = () => {
    window.location.href = INVESTMENT_FE;
  };

  return (
    <Card className="relative flex flex-col items-start justify-between gap-8">
      <WSDMIcon className="absolute right-0 top-0" />
      <div>
        <h2 className="mb-2 text-2xl font-medium">WSDM Token</h2>
        <p className="text-white/40">Use tokens for premium access</p>
      </div>
      <Button
        variant="alternative"
        disabled={isLoading}
        onClick={() => refetch()}
        className="!px-4 !py-2"
      >
        <Icon name={bxRefresh} className="me-2" />
        {t('billing:token-modal.refresh')}
      </Button>
      <div className="flex w-full items-end justify-between gap-4">
        <div>
          <div>Balance</div>
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-3xl">
              {addComma(Number(wsdmBalance?.value ?? 0n) / 10 ** 6)}
            </span>
            <span className="text-xl text-green-400">WSDM</span>
          </div>
        </div>
        <Button variant="primary-purple" onClick={openInvestmentPanel}>
          Add WSDM
        </Button>
      </div>
    </Card>
  );
}
