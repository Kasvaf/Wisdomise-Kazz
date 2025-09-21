import { Collapse, notification } from 'antd';
import {
  type Library,
  type LibraryWallet,
  useLibrariesQuery,
} from 'api/library';
import { bxCopy, bxTrash } from 'boxicons-quasar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useMemo } from 'react';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { Table } from 'shared/v1-components/Table';
import { shortenAddress } from 'utils/shortenAddress';

const useSelectedLibs = () => {
  const { settings } = useUserSettings();
  const { data: libs } = useLibrariesQuery();

  return useMemo(() => {
    return settings.wallet_tracker.selected_libraries
      .map(({ key }) => libs?.results.find(l => l.key === key))
      .filter(Boolean) as Library[];
  }, [settings.wallet_tracker.selected_libraries, libs]);
};

export default function WalletManager({ className }: { className?: string }) {
  const selectedLibs = useSelectedLibs();
  const { settings } = useUserSettings();

  return (
    <div className={className}>
      <Collapse
        className="!bg-v1-surface-l0 !-mx-3"
        defaultActiveKey={1}
        items={[
          {
            key: '1',
            label: 'Wallet Manager',
            children: (
              <div>
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
                    ...selectedLibs.map(lib => ({
                      key: lib.key,
                      label: `${lib.name} (${lib.wallets.length} Wallets)`,
                      children: <WalletGroup wallets={lib.wallets} />,
                    })),
                  ]}
                  size="small"
                />
              </div>
            ),
          },
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
  const [copy, notif] = useShare('copy');

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
                  onClick={() => {
                    deleteAllImportedWallets();
                    notification.success({
                      message: 'All Wallets Removed Successfully',
                    });
                  }}
                  size="3xs"
                  surface={3}
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
                    onClick={() => {
                      deleteImportedWallet(row.address);
                      notification.success({
                        message: 'Wallet Removed Successfully',
                      });
                    }}
                    size="xs"
                    surface={3}
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
