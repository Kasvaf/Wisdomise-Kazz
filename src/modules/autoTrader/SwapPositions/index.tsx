import { Pagination } from 'antd';
import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import SwapSharingModal from 'modules/autoTrader/SwapSharingModal';
import {
  calcHold,
  calcPnl,
  calcPnlPercent,
} from 'modules/autoTrader/TokenActivity/utils';
import type { TradeSettingsSource } from 'modules/base/auth/UserSettingsProvider';
import React, { useMemo, useState } from 'react';
import { useSwap } from 'services/chains';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useLastPriceStream } from 'services/price';
import {
  type SwapPosition,
  type SwapPositionStatus,
  useSwapPositionsQuery,
} from 'services/rest';
import type { Wallet } from 'services/rest/wallets';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import Skeleton from 'shared/v1-components/Skeleton';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import type { Surface } from 'utils/useSurface';

const PAGE_SIZE = 30;
export default function Positions({
  wallet,
  slug,
  status,
}: {
  wallet?: Wallet;
  status: SwapPositionStatus;
  slug?: string;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSwapPositionsQuery({
    symbolSlug: slug,
    status,
    page,
    pageSize: PAGE_SIZE,
    walletAddress: wallet?.address,
  });

  const columns = useMemo<Array<TableColumn<SwapPosition>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => {
          return <Token autoFill showAddress={false} slug={row.symbol_slug} />;
        },
      },
      {
        key: 'bought',
        title: 'Bought',
        render: row => (
          <DirectionalNumber
            label="$"
            showIcon={false}
            showSign={false}
            value={Number(row.total_bought_usd)}
          />
        ),
      },
      {
        key: 'sold',
        title: 'Sold',
        render: row => (
          <DirectionalNumber
            direction="down"
            label="$"
            showIcon={false}
            showSign={false}
            value={Number(row.total_sold_usd)}
          />
        ),
      },
      {
        hidden: status === 'CLOSED',
        key: 'remaining',
        title: 'Remaining',
        render: row => (
          <PositionRemaining
            balance={Number(row.balance)}
            slug={row.symbol_slug}
          />
        ),
      },
      {
        key: 'pnl',
        title: 'Pnl',
        render: row => <PositionPnl position={row} />,
      },
      {
        key: 'actions',
        title: 'Actions',
        render: row => (
          <div className="flex items-center">
            {+row.balance !== 0 && (
              <BtnQuickSell amount={row.balance} slug={row.symbol_slug} />
            )}
            <ShareButton position={row} />
          </div>
        ),
      },
    ],
    [status],
  );

  return (
    <Table
      chunkSize={5}
      columns={columns}
      dataSource={data?.results}
      emptyMessage={
        status === 'ACTIVE' ? 'No Active Position Found' : undefined
      }
      footer={
        <Pagination
          current={+page}
          hideOnSinglePage
          onChange={x => setPage(x)}
          pageSize={PAGE_SIZE}
          responsive
          total={data?.count}
        />
      }
      loading={isLoading}
      rowClassName="text-xs"
      rowKey={r => r.key}
      scrollable
      surface={1}
    />
  );
}

const PositionRemaining = ({
  slug,
  balance,
}: {
  slug: string;
  balance: number;
}) => {
  const { data: usdPrice, isLoading } = useLastPriceStream({
    network: 'solana',
    slug,
    quote: WRAPPED_SOLANA_SLUG,
    convertToUsd: true,
  });
  const hold = calcHold(balance, usdPrice);

  return isLoading ? (
    <Skeleton />
  ) : (
    <ReadableNumber format={{ decimalLength: 2 }} label="$" value={hold} />
  );
};

const PositionPnl = ({ position }: { position: SwapPosition }) => {
  const { data: usdPrice, isLoading } = useLastPriceStream({
    network: 'solana',
    slug: position.symbol_slug,
    quote: WRAPPED_SOLANA_SLUG,
    convertToUsd: true,
  });
  const pnl = calcPnl(
    +position.total_bought_usd,
    +position.total_sold_usd,
    +position.balance,
    usdPrice,
  );
  const pnlPercent = calcPnlPercent(+position.total_bought_usd, pnl);

  return isLoading ? (
    <Skeleton />
  ) : (
    <span className="text-v1-content-secondary text-xs">
      <DirectionalNumber
        format={{ decimalLength: 2 }}
        label="$"
        showIcon={false}
        showSign={true}
        value={pnl}
      />{' '}
      <DirectionalNumber
        format={{ decimalLength: 0 }}
        prefix="("
        showIcon={false}
        showSign={true}
        suffix="%)"
        value={pnlPercent}
      />
    </span>
  );
};

const ShareButton: React.FC<{ position: SwapPosition }> = ({ position }) => {
  const { data: usdPrice } = useLastPriceStream({
    network: 'solana',
    slug: position.symbol_slug,
    quote: WRAPPED_SOLANA_SLUG,
    convertToUsd: true,
    enabled: +position.balance !== 0,
  });
  const { data: price } = useLastPriceStream({
    network: 'solana',
    slug: position.symbol_slug,
    quote: WRAPPED_SOLANA_SLUG,
    convertToUsd: false,
    enabled: +position.balance !== 0,
  });
  const [openShare, setOpenShare] = useState(false);

  const pnl = calcPnl(
    +position.total_bought,
    +position.total_sold,
    +position.balance,
    price,
  );
  const pnlPercent = calcPnlPercent(+position.total_bought, pnl);
  const pnlUsd = calcPnl(
    +position.total_bought_usd,
    +position.total_sold_usd,
    +position.balance,
    usdPrice,
  );
  const pnlUsdPercent = calcPnlPercent(+position.total_bought_usd, pnl);

  return (
    <>
      <Button
        className="text-v1-content-primary/70"
        fab
        onClick={() => setOpenShare(true)}
        size="2xs"
        variant="ghost"
      >
        <Icon className="[&>svg]:!size-4" name={bxShareAlt} size={16} />
      </Button>

      <SwapSharingModal
        bought={+position.total_bought}
        boughtUsd={+position.total_bought_usd}
        onClose={() => setOpenShare(false)}
        open={openShare}
        pnl={pnl}
        pnlPercent={pnlPercent}
        pnlUsd={pnlUsd}
        pnlUsdPercent={pnlUsdPercent}
        slug={position.symbol_slug}
        sold={+position.total_sold}
        soldUsd={+position.total_sold_usd}
      />
    </>
  );
};

const BtnQuickSell = React.memo(function BtnQuickBuy({
  source = 'terminal',
  slug,
  tokenAddress,
  className,
  size = '2xs',
  surface = 1,
  amount,
}: {
  source?: TradeSettingsSource;
  slug: string;
  tokenAddress?: string;
  className?: string;
  size?: ButtonSize;
  surface?: Surface;
  amount: string;
}) {
  const quote = WRAPPED_SOLANA_SLUG;
  const swapAsync = useSwap({ slug, quote, source, tokenAddress });

  const swap = async () => {
    await swapAsync('SHORT', amount);
  };

  return (
    <Button
      className={clsx(className, '!text-v1-content-negative')}
      onClick={swap}
      size={size}
      surface={surface}
      variant="ghost"
    >
      Sell All
    </Button>
  );
});
