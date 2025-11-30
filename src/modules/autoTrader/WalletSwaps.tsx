import { Pagination } from 'antd';
import { type Swap, useTraderSwapsQuery } from 'api';
import type { Wallet } from 'api/wallets';
import { bxLinkExternal, bxShareAlt } from 'boxicons-quasar';
import dayjs from 'dayjs';
import SwapSharingModal from 'modules/autoTrader/SwapSharingModal';
import { useMemo, useState } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import { roundSensible } from 'utils/numbers';

const PAGE_SIZE = 30;
export default function WalletSwaps({ wallet }: { wallet: Wallet }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTraderSwapsQuery({
    page,
    pageSize: PAGE_SIZE,
    address: wallet.address,
  });

  const columns = useMemo<Array<TableColumn<Swap>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => {
          return <Token autoFill slug={row.base_slug} />;
        },
      },
      {
        key: 'type',
        title: 'Type',
        render: row => (
          <Badge color={row.side === 'SHORT' ? 'negative' : 'positive'}>
            {row.side === 'SHORT' ? 'Sell' : 'Buy'}
          </Badge>
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        render: row => (
          <span className="text-xs">${roundSensible(row.trading_volume)}</span>
        ),
      },
      {
        key: 'pnl',
        title: 'Pnl',
        render: row =>
          row.pnl_usd ? (
            <span className="text-v1-content-secondary text-xs">
              <DirectionalNumber
                label="$"
                showIcon={false}
                showSign={true}
                value={Number(row.pnl_usd)}
              />{' '}
              (
              <DirectionalNumber
                showIcon={false}
                showSign={true}
                suffix="%"
                value={Number(row.pnl_usd_percent)}
              />
              )
            </span>
          ) : null,
      },
      {
        key: 'age',
        title: 'Age',
        className: 'text-xs',
        render: row => dayjs(row.created_at).fromNow(false),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: row => (
          <div>
            <Button
              className="text-v1-content-primary/70"
              fab
              onClick={() => window.open(row.transaction_link, '_blank')}
              size="xs"
              variant="ghost"
            >
              <Icon name={bxLinkExternal} />
            </Button>
            <ShareButton swap={row} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <Table
      chunkSize={5}
      columns={columns}
      dataSource={data?.results}
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
      rowKey={r => r.key}
      scrollable
      surface={1}
    />
  );
}

const ShareButton: React.FC<{ swap: Swap }> = ({ swap }) => {
  const [openShare, setOpenShare] = useState(false);

  return (
    <>
      {swap.side === 'SHORT' && (
        <Button
          className="text-v1-content-primary/70"
          fab
          onClick={() => setOpenShare(true)}
          size="xs"
          variant="ghost"
        >
          <Icon name={bxShareAlt} size={16} />
        </Button>
      )}

      <SwapSharingModal
        bought={+swap.to_amount - +swap.pnl_quote}
        boughtUsd={+swap.trading_volume - +swap.pnl_usd}
        onClose={() => setOpenShare(false)}
        open={openShare}
        pnl={+swap.pnl_quote}
        pnlPercent={+swap.pnl_quote_percent}
        pnlUsd={+swap.pnl_usd}
        pnlUsdPercent={+swap.pnl_usd_percent}
        slug={swap.base_slug}
        sold={+swap.to_amount}
        soldUsd={+swap.trading_volume}
      />
    </>
  );
};
