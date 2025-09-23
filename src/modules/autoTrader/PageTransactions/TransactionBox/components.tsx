import type {
  SupportedNetworks,
  TransactionOpenClose,
  TransactionOrder,
  TransactionStatus,
  TransactionWithdraw,
} from 'api';
import { useSymbolInfo } from 'api/symbol';
import { bxGlobe } from 'boxicons-quasar';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { PropsWithChildren, ReactNode } from 'react';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { roundSensible } from 'utils/numbers';

export const Box: React.FC<
  PropsWithChildren<{
    title: string;
    info?: string | ReactNode;
    className?: string;
    contentClassName?: string;
  }>
> = ({ title, info, children, className, contentClassName }) => {
  const hasChildren =
    children && (!Array.isArray(children) || children.some(Boolean));

  return (
    <div
      className={clsx(
        'whitespace-pre rounded-xl bg-v1-surface-l1 px-4 py-6 text-xs',
        className,
      )}
    >
      <div className="flex justify-between">
        <div className="font-medium">{title}</div>
        <div className="font-normal text-v1-content-secondary">{info}</div>
      </div>

      {hasChildren && (
        <div
          className={clsx(
            'mt-5 border-t border-t-white/5 pt-5',
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const StatusLabel: React.FC<{
  t: { data: { time: string; status: TransactionStatus } };
}> = ({ t }) => {
  return {
    processing: <Badge color="orange" label="Processing" />,
    failed: <Badge color="red" label="Failed" />,
    completed: <>{dayjs(t.data.time).fromNow()}</>,
  }[t.data.status];
};

export const GasFee: React.FC<{
  t: TransactionWithdraw | TransactionOrder | TransactionOpenClose;
  className?: string;
}> = ({
  t: {
    data: {
      gas_fee_amount: amount,
      gas_fee_asset_slug: assetSlug,
      gas_fee_asset_name: assetName,
    },
  },
  className,
}) => {
  if (amount == null) return null;

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div>Fee</div>
      <div className="flex shrink-0 items-center">
        {roundSensible(amount)} {assetName}
        <AssetIcon className="ml-1" slug={assetSlug} />
      </div>
    </div>
  );
};

export const SCANNERS: Record<
  Exclude<SupportedNetworks, 'polygon'>,
  { name: string; baseUrl: string; txPath?: string; addressPath?: string }
> = {
  'the-open-network': {
    name: 'TonViewer',
    baseUrl: 'https://tonviewer.com/',
  },
  solana: {
    name: 'SolScan',
    baseUrl: 'https://solscan.io/',
    txPath: 'tx/',
    addressPath: 'account/',
  },
};

export const openInScan = (
  network: 'solana' | 'the-open-network',
  { tx }: { tx?: string },
) => {
  if (network === 'solana' && tx) {
    window.open(`${SCANNERS.solana.baseUrl}tx/${tx}`);
  }
};

export const TonViewer: React.FC<{
  link?: string | null;
  network: string;
}> = ({ link, network }) => {
  if (!link) return null;
  return (
    <div className="mt-6 flex justify-center">
      <Button
        className="!text-xs"
        onClick={() => window.open(link, '_blank')}
        size="sm"
        variant="outline"
      >
        <Icon className="mr-2" name={bxGlobe} size={16} />
        View
        {network in SCANNERS
          ? ' on ' +
            SCANNERS[network as Exclude<SupportedNetworks, 'polygon'>].name
          : ''}
      </Button>
    </div>
  );
};

export const AssetIcon: React.FC<{ slug: string; className?: string }> = ({
  slug,
  className,
}) => {
  const { data } = useSymbolInfo({ slug });
  if (!data?.logo_url) return null;
  return <img className={clsx('size-4', className)} src={data?.logo_url} />;
};
