import { bxPlus } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import {
  useAccountQuery,
  useExchangeAccountsQuery,
  useInvestorAssetStructuresQuery,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import useModalAddExchangeAccount from 'modules/account/useModalAddExchangeAccount';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Spinner from 'shared/Spinner';
import useIsMobile from 'utils/useIsMobile';
import MinMaxInfo from './MinMaxInfo';
import ExchangeButton from './ExchangeButton';
import BinanceApiIntroVideo from './BinanceApiIntroVideo';

const StepChooseWallet: React.FC<{
  financialProduct: FinancialProduct;
  selected?: string;
  onSelect: (val: string) => void;
  onContinue: () => void;
}> = ({ financialProduct: fp, selected, onSelect, onContinue }) => {
  const { t } = useTranslation('products');
  const { data: account } = useAccountQuery();
  const { data: wallets, isLoading } = useExchangeAccountsQuery();
  const { data: ias } = useInvestorAssetStructuresQuery();
  const mea = !!ias?.[0]?.main_exchange_account;
  const wisdomiseBalance = ias?.[0]?.total_equity || 0;

  const isMine = fp.owner.key === account?.key;
  const market = isMine
    ? fp.market_names?.[0]
    : (fp.config.can_use_external_account &&
        fp.config.external_account_market_type) ||
      undefined;

  const [ModalAddExchange, showAddExchange] = useModalAddExchangeAccount(
    market,
    { introStyle: true },
  );

  const onAddExchange = async () => {
    const newWalletKey = await showAddExchange();
    if (newWalletKey) onSelect(newWalletKey);
  };

  const isMobile = useIsMobile();

  return (
    <div>
      <MinMaxInfo min={fp.min_deposit} max={fp.max_deposit} />

      <section className="mt-9">
        <div className="mb-3 flex items-center justify-between">
          <div>{t('fp-activation.choose-your-wallet')}</div>
          {!isMobile && <BinanceApiIntroVideo />}
        </div>

        <div className="-mx-6 overflow-x-scroll py-3">
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex h-[84px] shrink-0 items-center gap-2 pl-6">
                {wallets
                  ?.filter(w => w.market_name === market)
                  .map(w => (
                    <ExchangeButton
                      key={w.key}
                      selected={selected === w.key}
                      walletType="Binance"
                      walletName={w.title}
                      available={w.total_equity}
                      onClick={() => onSelect(w.key)}
                    />
                  ))}
                {!wallets?.length && !!market && (
                  <ExchangeButton
                    walletType="Binance"
                    selected={true}
                    onClick={onAddExchange}
                  />
                )}

                {mea && (
                  <ExchangeButton
                    walletType="Wisdomise"
                    walletName="Internal Wallet"
                    selected={selected === 'wisdomise'}
                    onClick={() => onSelect('wisdomise')}
                    available={wisdomiseBalance}
                  />
                )}

                {!!market && (
                  <Button
                    variant="alternative"
                    className="h-full !px-4"
                    onClick={onAddExchange}
                  >
                    <Icon name={bxPlus} />
                  </Button>
                )}
                <div className="h-full w-4 shrink-0" />
              </div>
            </>
          )}
        </div>
      </section>

      {isMobile && (
        <div className="my-3 flex justify-center">
          <BinanceApiIntroVideo />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          variant="primary"
          className="w-[280px] mobile:w-full"
          onClick={onContinue}
          disabled={!selected}
        >
          {t('fp-activation.btn-continue')}
        </Button>
      </div>

      {ModalAddExchange}
    </div>
  );
};

export default StepChooseWallet;
