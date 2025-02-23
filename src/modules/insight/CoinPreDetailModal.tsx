import { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { bxSlider } from 'boxicons-quasar';
import { useCoinDetails } from 'api';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { PriceAlertButton } from 'modules/insight/PageCoinDetails/components/PriceAlertButton';
import { CoinLabels } from 'shared/CoinLabels';
import Spinner from 'shared/Spinner';
import { DrawerModal } from 'shared/DrawerModal';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { ReadableNumber } from 'shared/ReadableNumber';

const CoinPreDetailsContent: FC<{
  slug: string;
  children?: ReactNode;
}> = ({ slug, children }) => {
  const coinDetails = useCoinDetails({ slug });
  const { t } = useTranslation('insight');
  if (!coinDetails.data || coinDetails.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Coin
          coin={coinDetails.data.symbol}
          imageClassName="size-8"
          nonLink={true}
          truncate={260}
          abbrevationSuffix={
            <DirectionalNumber
              className="ms-1"
              value={coinDetails.data.data?.price_change_percentage_24h}
              label="%"
              direction="auto"
              showIcon
              showSign={false}
              format={{
                decimalLength: 1,
                minifyDecimalRepeats: true,
              }}
            />
          }
        />
        <div className="flex flex-col items-end gap-px">
          <ReadableNumber
            value={coinDetails.data.data?.current_price}
            label="$"
            className="text-sm"
          />
          <CoinMarketCap
            marketData={coinDetails.data.data}
            singleLine
            className="text-xs"
          />
        </div>
      </div>
      <>{children}</>

      <div className="flex flex-col items-start justify-end overflow-auto">
        <p className="mb-2 text-xs">{t('pre_detail_modal.wise_labels')}</p>
        <CoinLabels
          categories={coinDetails.data.symbol.categories}
          labels={coinDetails.data.symbol_labels}
          networks={coinDetails.data.networks}
          security={coinDetails.data.security_data?.map(x => x.symbol_security)}
          coin={coinDetails.data.symbol}
        />
      </div>

      <div className="flex flex-col items-stretch gap-4">
        <div className="flex gap-3">
          <NavLink
            to={`/coin/${coinDetails.data.symbol.slug}`}
            className="block basis-1/2"
          >
            <Button
              variant="outline"
              surface={2}
              size="sm"
              block
              className="w-full"
            >
              <Icon name={bxSlider} />
              {t('pre_detail_modal.details')}
            </Button>
          </NavLink>
          <PriceAlertButton
            variant="outline"
            surface={2}
            size="sm"
            className="basis-1/2"
            slug={coinDetails.data.symbol.slug}
          />
        </div>
        <BtnAutoTrade slug={coinDetails.data.symbol.slug} variant="primary" />
      </div>
    </div>
  );
};

export const CoinPreDetailModal: FC<{
  slug?: string | null;
  open?: boolean;
  onClose: () => unknown;
  children?: ReactNode;
}> = ({ slug, open, onClose, children }) => {
  return (
    <DrawerModal
      open={open}
      onClose={onClose}
      closeIcon={null}
      className="[&_.ant-drawer-header]:hidden"
    >
      {slug && (
        <CoinPreDetailsContent slug={slug}>{children}</CoinPreDetailsContent>
      )}
    </DrawerModal>
  );
};
