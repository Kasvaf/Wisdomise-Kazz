import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';
import { bxGlobe } from 'boxicons-quasar';
import {
  type TransactionOrder,
  type TransactionWithdraw,
  type TransactionOpenClose,
  type TransactionStatus,
} from 'api';
import Button from 'shared/Button';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';
import { useSymbolInfo } from 'api/symbol';
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
        'whitespace-pre rounded-xl bg-v1-surface-l2 px-4 py-6 text-xs',
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
        <AssetIcon slug={assetSlug} className="ml-1" />
      </div>
    </div>
  );
};

export const TonViewer: React.FC<{ link?: string | null }> = ({ link }) => {
  if (!link) return null;
  return (
    <div className="mt-6 flex justify-center">
      <Button
        variant="secondary"
        size="small"
        className="!text-xs"
        to={link}
        target="_blank"
      >
        <Icon name={bxGlobe} className="mr-2" size={16} />
        View on Tonviewer
      </Button>
    </div>
  );
};

export const AssetIcon: React.FC<{ slug: string; className?: string }> = ({
  slug,
  className,
}) => {
  const { data } = useSymbolInfo(slug);
  if (!data?.logo_url) return null;
  return <img src={data?.logo_url} className={clsx('size-4', className)} />;
};
