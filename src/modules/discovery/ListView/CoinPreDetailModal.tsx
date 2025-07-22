/* eslint-disable import/max-dependencies */
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
import { bxShareAlt, bxSlider } from 'boxicons-quasar';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { CoinLabels } from 'shared/CoinLabels';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type Coin as CoinType } from 'api/types/shared';
import {
  type CoinNetwork,
  type MiniMarketData,
  type NetworkSecurity,
} from 'api/discovery';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Dialog } from 'shared/v1-components/Dialog';
import { usePromise } from 'utils/usePromise';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import useIsMobile from 'utils/useIsMobile';
import { PriceAlertButton } from '../DetailView/CoinDetail/PriceAlertButton';
import TechnicalRadarSharingModal from './TechnicalRadar/TechnicalRadarSharingModal';
import SocialRadarSharingModal from './SocialRadar/SocialRadarSharingModal';

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
            variant="ghost"
            size="sm"
            className="!px-2"
            onClick={async () => {
              const isLoggedIn = await ensureAuthenticated();
              if (isLoggedIn) {
                setOpenShareModal(true);
              }
            }}
          >
            <Icon name={bxShareAlt} />
          </Button>
        )}
        <Coin
          coin={coin}
          imageClassName="size-8"
          nonLink={true}
          truncate={260}
          abbrevationSuffix={
            <DirectionalNumber
              className="ms-1"
              value={marketData?.price_change_percentage_24h}
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
        <div className="ml-auto flex flex-col items-end gap-px">
          <ReadableNumber
            value={marketData?.current_price}
            label="$"
            className="text-sm"
          />
          <CoinMarketCap
            marketData={marketData}
            singleLine
            className="text-xs"
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
  const isMobile = useIsMobile();
  const { getUrl, params } = useDiscoveryRouteMeta();

  return (
    <Dialog
      open={open}
      mode="drawer"
      drawerConfig={{
        position: 'bottom',
        closeButton: true,
      }}
      onClose={onClose}
      className="bg-v1-surface-l4"
      contentClassName="p-3"
      surface={4}
      footer={
        coin && (
          <div className="flex flex-col items-stretch gap-4">
            <div className="flex gap-3">
              <NavLink
                to={getUrl({
                  detail: 'coin',
                  slug: coin.slug,
                  view:
                    isMobile || params.view === 'detail' ? 'detail' : 'both',
                })}
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
                slug={coin.slug}
              />
            </div>
            <BtnAutoTrade slug={coin.slug} variant="primary" />
          </div>
        )
      }
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
  const { getUrl, params } = useDiscoveryRouteMeta();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { run: openModal, ...rest } = usePromise<T, boolean>();

  const action = useCallback(
    (r: T) => {
      if (directNavigate && slug) {
        const href = getUrl({
          view: isMobile || params.view === 'detail' ? 'detail' : 'both',
          detail: 'coin',
          slug: slug?.(r),
        });
        navigate(href);
        return Promise.resolve();
      }
      return openModal(r);
    },
    [directNavigate, getUrl, isMobile, navigate, openModal, params.view, slug],
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
    [action, rest],
  );
}
