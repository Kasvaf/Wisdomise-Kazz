import { Collapse, notification } from 'antd';
import type { LibraryWallet } from 'api/library';
import { useTrackerUnsubscribeMutation } from 'api/tracker';
import { bxCopy, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { Table } from 'shared/v1-components/Table';
import { shortenAddress } from 'utils/address';
import { useSelectedLibraries } from './useSelectedLibraries';

export default function WalletsManager({ className }: { className?: string }) {
  const selectedLibs = useSelectedLibraries();
  const { settings } = useUserSettings();

  return (
    <div className={clsx('px-3 pb-3', className)}>
      <h2 className="my-3 text-xs">Wallet Manager</h2>
      <Collapse
        defaultActiveKey="manual"
        items={[
          {
            key: 'manual',
            label: 'Manual List',
            children: (
              <WalletGroup
                hasActions={true}
                wallets={settings.wallet_tracker.imported_wallets}
              />
            ),
          },
          ...selectedLibs
            .filter(lib => lib.type === 'wallet')
            .map(lib => ({
              key: lib.key,
              label: `${lib.name} (${lib.wallets.length} Wallets)`,
              children: <WalletGroup wallets={lib.wallets} />,
            })),
        ]}
        size="small"
      />
    </div>
  );
}

function WalletGroup({
  wallets,
  hasActions,
}: {
  wallets: LibraryWallet[];
  hasActions?: boolean;
}) {
  const { deleteImportedWallet, deleteAllImportedWallets } = useUserSettings();
  const { mutate } = useTrackerUnsubscribeMutation();
  const [copy, notif] = useShare('copy');

  const deleteWallet = (address: string) => {
    deleteImportedWallet(address);
    mutate({ addresses: [address] });
    notification.success({
      message: 'Wallet Removed Successfully',
    });
  };

  const deleteAllWallets = () => {
    deleteAllImportedWallets();
    mutate({ addresses: wallets.map(w => w.address) });
    notification.success({
      message: 'All Wallets Removed Successfully',
    });
  };

  return (
    <div className="-mb-2">
      <Table
        columns={[
          {
            key: 'name',
            title: 'Name',
            render: row => (
              <div className="flex items-center gap-3">
                <div className="text-lg">{row.emoji}</div>
                <div>
                  <div className="text-xs">{row.name}</div>
                  <button
                    className="flex items-center gap-1 text-v1-content-secondary text-xxs"
                    onClick={() => copy(row.address)}
                  >
                    {shortenAddress(row.address)}
                    <Icon name={bxCopy} size={10} />
                  </button>
                  {notif}
                </div>
              </div>
            ),
          },
          {
            key: 'actions',
            align: 'end',
            title: hasActions && (
              <div className="flex w-full justify-end">
                <Button
                  className="!text-v1-content-negative"
                  onClick={deleteAllWallets}
                  size="3xs"
                  surface={2}
                  variant="ghost"
                >
                  Remove All
                </Button>
              </div>
            ),
            render: row =>
              hasActions ? (
                <div>
                  <Button
                    className="text-white/70"
                    fab
                    onClick={() => deleteWallet(row.address)}
                    size="xs"
                    surface={2}
                    variant="ghost"
                  >
                    <Icon name={bxTrash} />
                  </Button>
                </div>
              ) : (
                ''
              ),
          },
        ]}
        dataSource={wallets}
        surface={2}
      />
    </div>
  );
}
