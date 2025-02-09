/* eslint-disable import/max-dependencies */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { bxPlusCircle } from 'boxicons-quasar';
import { useLastPriceQuery } from 'api';
import { useAccountBalance } from 'api/chains';
import { roundSensible } from 'utils/numbers';
import { ButtonSelect } from 'shared/ButtonSelect';
import AmountInputBox from 'shared/AmountInputBox';
import InfoButton from 'shared/InfoButton';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import { useSymbolInfo } from 'api/symbol';
import useActiveNetwork from 'modules/base/useActiveNetwork';
import DurationInput from './DurationInput';
import PriceVolumeInput from './PriceVolumeInput';
import AIPresets from './AIPressets';
import { type SignalFormState } from './useSignalFormStates';
import QuoteSelector from './QuoteSelector';

const PartOpen: React.FC<{
  data: SignalFormState;
  baseSlug: string;
}> = ({ data, baseSlug }) => {
  const { t } = useTranslation('builder');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const {
    isUpdate: [isUpdate],
    orderType: [orderType, setOrderType],
    amount: [amount, setAmount],
    quote: [quote, setQuote],
    price: [price, setPrice],
    priceUpdated: [priceUpdated, setPriceUpdated],
    volume: [volume, setVolume],
    exp: [exp, setExp],
    orderExp: [orderExp, setOrderExp],
  } = data;

  const { data: quoteInfo } = useSymbolInfo(quote);
  const net = useActiveNetwork();
  const isNativeQuote =
    (net === 'the-open-network' && quote === 'the-open-network') ||
    (net === 'solana' && quote === 'wrapped-solana');

  const { data: assetPrice } = useLastPriceQuery({
    slug,
    quote,
    convertToUsd: true,
  });
  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);

  useEffect(() => {
    if (!priceUpdated && assetPrice && !isUpdate) {
      setPrice(String(assetPrice));
    }
  }, [assetPrice, isUpdate, priceUpdated, setPrice]);

  return (
    <div>
      {false && (
        <ButtonSelect
          className="mb-3 w-full"
          value={orderType}
          options={[
            {
              label: t('common:order-type.limit'),
              value: 'limit',
              disabled: isUpdate,
            },
            {
              label: t('common:order-type.market'),
              value: 'market',
              disabled: isUpdate,
            },
          ]}
          onChange={setOrderType}
        />
      )}

      <AmountInputBox
        label={
          <div className="flex items-center justify-between">
            <span>Amount</span>
            {balanceLoading ? (
              <div className="flex items-center text-sm text-v1-content-secondary">
                <Spin />
                Reading Balance
              </div>
            ) : (
              quoteBalance != null && (
                <div
                  className="flex items-center gap-1"
                  onClick={() =>
                    !isUpdate &&
                    !isNativeQuote &&
                    setAmount(String(quoteBalance))
                  }
                >
                  {quoteBalance ? (
                    <>
                      <span className="text-sm text-white/40">
                        Balance: {String(quoteBalance)}{' '}
                        {quoteInfo?.abbreviation}
                      </span>
                      {!isUpdate && !isNativeQuote && (
                        <Icon name={bxPlusCircle} size={16} />
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-v1-content-negative">
                      No Balance
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        }
        max={quoteBalance || 0}
        value={amount}
        onChange={setAmount}
        noSuffixPad
        suffix={
          <QuoteSelector
            baseSlug={slug}
            value={quote}
            onChange={setQuote}
            disabled={isUpdate}
          />
        }
        className="mb-3"
        disabled={isUpdate || balanceLoading || !quoteBalance}
      />

      <AIPresets data={data} baseSlug={baseSlug} quoteSlug={quote} />

      <div className="my-4 border-b border-white/5" />

      <PriceVolumeInput
        label={t('signal-form.open.title')}
        price={
          orderType === 'market' && !isUpdate
            ? assetPrice === undefined
              ? '-'
              : '~ ' + roundSensible(assetPrice)
            : price ?? assetPrice ?? '-'
        }
        onPriceChange={p => {
          setPrice(p);
          setPriceUpdated(true);
        }}
        disabledPrice={isUpdate || orderType === 'market'}
        volume={volume}
        onVolumeChange={setVolume}
        disabledVolume={isUpdate}
        className="mb-5 grow"
      />

      {false && (
        <div className="flex items-end gap-2">
          <DurationInput
            className="grow"
            label={
              <div className="flex items-center">
                {t('signal-form.expiration-time.title')}
                <InfoButton
                  className="ml-1 !opacity-50"
                  title={t('signal-form.expiration-time.info-title')}
                  text={t('signal-form.expiration-time.info-text')}
                />
              </div>
            }
            value={exp}
            onChange={setExp}
            disabled={isUpdate}
          />
          {orderType === 'limit' && (
            <DurationInput
              className="grow"
              label={
                <div className="flex items-center">
                  {t('signal-form.order-expiration-time.title')}
                  <InfoButton
                    className="ml-1 !opacity-50"
                    title={t('signal-form.order-expiration-time.info-title')}
                    text={t('signal-form.order-expiration-time.info-text')}
                  />
                </div>
              }
              value={orderExp}
              onChange={setOrderExp}
              disabled={isUpdate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PartOpen;
