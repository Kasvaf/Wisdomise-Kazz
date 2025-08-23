import type {
  CoinNetwork,
  MiniMarketData,
  NetworkSecurity,
} from 'api/discovery';
import type { Coin as CoinType } from 'api/types/shared';
import { bxShareAlt, bxSlider } from 'boxicons-quasar';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import {
  Children,
  cloneElement,
  type FC,
  isValidElement,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { Coin } from 'shared/Coin';
import { CoinLabels } from 'shared/CoinLabels';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button } from 'shared/v1-components/Button';
import { Dialog } from 'shared/v1-components/Dialog';
import { usePromise } from 'utils/usePromise';
import { PriceAlertButton } from '../DetailView/CoinDetail/PriceAlertButton';
import SocialRadarSharingModal from './SocialRadar/SocialRadarSharingModal';
import TechnicalRadarSharingModal from './TechnicalRadar/TechnicalRadarSharingModal';

interface PreDetailModalBaseProps {
  coin: CoinType;
  marketData?: MiniMarketData | null;
  labels?: string[] | null;
  networks?: CoinNetwork[] | null;
  categories?: CoinType['categories'] | null;
  security?: NetworkSecurity[] | null;
  hasShare?: boolean;
}

const CoinPreDetailsContent: FC<
  PreDetailModalBaseProps & {
    children?: ReactNode;
  }
> = ({
  coin,
  marketData,
  labels,
  categories,
  networks,
  security,
  children,
  hasShare,
}) => {
  const { t } = useTranslation('insight');
  const [openShareModal, setOpenShareModal] = useState(false);
  const [LoginModal, ensureAuthenticated] = useEnsureAuthenticated();

  const modifiedChildren = Children.map(children, child => {
    if (
      isValidElement(child) &&
      (child.type === TechnicalRadarSharingModal ||
        child.type === SocialRadarSharingModal)
    ) {
      return cloneElement<any>(child, {
        open: openShareModal,
        onClose: () => setOpenShareModal(false),
      });
    }
    return child;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {hasShare && (
          <Button
            className="!px-2"
            onClick={async () => {
              const isLoggedIn = await ensureAuthenticated();
              if (isLoggedIn) {
                setOpenShareModal(true);
              }
            }}
            size="sm"
            variant="ghost"
          >
            <Icon name={bxShareAlt} />
          </Button>
        )}
        <Coin
          abbrevationSuffix={
            <DirectionalNumber
              className="ms-1"
              direction="auto"
              format={{
                decimalLength: 1,
                minifyDecimalRepeats: true,
              }}
              label="%"
              showIcon
              showSign={false}
              value={marketData?.price_change_percentage_24h}
            />
          }
          coin={coin}
          imageClassName="size-8"
          nonLink={true}
          truncate={260}
        />
        <div className="ml-auto flex flex-col items-end gap-px">
          <ReadableNumber
            className="text-sm"
            label="$"
            value={marketData?.current_price}
          />
          <CoinMarketCap
            className="text-xs"
            marketData={marketData}
            singleLine
          />
        </div>
      </div>
      {modifiedChildren}

      <div className="flex flex-col items-start justify-end overflow-auto">
        <p className="mb-2 text-xs">{t('pre_detail_modal.wise_labels')}</p>
        <CoinLabels
          categories={categories}
          labels={labels}
          networks={networks}
          security={security}
          size="md"
        />
      </div>
      {LoginModal}
    </div>
  );
};

export const CoinPreDetailModal: FC<
  Partial<PreDetailModalBaseProps> & {
    open?: boolean;
    onClose: () => unknown;
    children?: ReactNode;
  }
> = ({ open, onClose, children, coin, ...props }) => {
  const { t } = useTranslation('insight');

  return (
    <Dialog
      className="bg-v1-surface-l1"
      contentClassName="p-3"
      drawerConfig={{
        position: 'bottom',
        closeButton: true,
      }}
      footer={
        coin && (
          <div className="flex flex-col items-stretch gap-4">
            <div className="flex gap-3">
              <NavLink className="block basis-1/2" to={`/token/${coin.slug}`}>
                <Button
                  block
                  className="w-full"
                  size="sm"
                  surface={2}
                  variant="outline"
                >
                  <Icon name={bxSlider} />
                  {t('pre_detail_modal.details')}
                </Button>
              </NavLink>
              <PriceAlertButton
                className="basis-1/2"
                size="sm"
                slug={coin.slug}
                surface={2}
                variant="outline"
              />
            </div>
            <BtnAutoTrade slug={coin.slug} variant="primary" />
          </div>
        )
      }
      mode="drawer"
      onClose={onClose}
      open={open}
    >
      {coin && open && (
        <CoinPreDetailsContent coin={coin} {...props}>
          {children}
        </CoinPreDetailsContent>
      )}
    </Dialog>
  );
};

export function useCoinPreDetailModal<T>({
  directNavigate,
  slug,
}: {
  directNavigate?: boolean;
  slug?: (r: T) => string;
}) {
  const navigate = useNavigate();
  const { run: openModal, ...rest } = usePromise<T, boolean>();

  const action = useCallback(
    (r: T) => {
      if (directNavigate && slug) {
        navigate(`/token/${slug(r)}`);
        return Promise.resolve();
      }
      return openModal(r);
    },
    [directNavigate, navigate, openModal, slug],
  );

  return useMemo(
    () =>
      [
        action,
        {
          isModalOpen: rest.isRunning,
          closeModal: () => rest.resolve(true),
          selectedRow: rest.params,
        },
      ] as const,
    // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
    [action, rest],
  );
}
