import { Collapse } from 'antd';
import {
  type TwitterFollowedAccount,
  useTwitterFollowedAccounts,
} from 'api/discovery';
import { bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { useSelectedLibraries } from '../WalletTracker/useSelectedLibraries';
import { ReactComponent as EmptyIcon } from './empty.svg';

export function HandlesManager({ className }: { className?: string }) {
  const selectedLibs = useSelectedLibraries();
  const { value } = useTwitterFollowedAccounts();

  return (
    <div className={clsx('px-3 pb-3', className)}>
      <h2 className="my-3 text-xs">Handles</h2>
      <Collapse
        defaultActiveKey="manual"
        items={[
          {
            key: 'manual',
            label: `Manual List (${value.length})`,
            children: <XTrackerEdit hasAction={true} users={value} />,
          },
          ...selectedLibs
            .filter(lib => lib.type === 'x-account')
            .map(lib => ({
              key: lib.key,
              label: `${lib.name} (${lib.accounts.length})`,
              children: <XTrackerEdit users={lib.accounts} />,
            })),
        ]}
        size="small"
      />
    </div>
  );
}

export const XTrackerEdit: FC<{
  className?: string;
  hasAction?: boolean;
  users: Partial<TwitterFollowedAccount>[];
}> = ({ className, hasAction, users }) => {
  const followings = useTwitterFollowedAccounts();

  const followingsColumns = useMemo<
    Array<TableColumn<Partial<TwitterFollowedAccount>>>
  >(
    () => [
      {
        key: 'username',
        title: 'Handle',
        render: row => (
          <a
            className="text-xs"
            href={`https://x.com/${row.username}`}
            referrerPolicy="no-referrer"
            rel="noreferrer"
            target="_blank"
          >
            @{row.username}
          </a>
        ),
      },
      {
        key: 'toggle_tweets',
        title: 'Tweets',
        hidden: !hasAction,
        render: row => (
          <Checkbox
            label="Hide"
            onChange={newVal =>
              followings.follow({
                ...(row as TwitterFollowedAccount),
                hide_from_list: newVal,
              })
            }
            size="md"
            value={row.hide_from_list}
          />
        ),
      },
      {
        key: 'action',
        hidden: !hasAction,
        title: (
          <>
            <button
              className="text-v1-content-negative hover:underline"
              onClick={() => !followings.isLoading && followings.unFollow(true)}
            >
              {'Remove All'}
            </button>
          </>
        ),
        align: 'end',
        render: row => (
          <Button
            fab
            onClick={() => {
              if (row.user_id) {
                !followings.isLoading && followings.unFollow(row.user_id);
              }
            }}
            size="xs"
            surface={2}
            variant="ghost"
          >
            <Icon className="opacity-60" name={bxTrash} />
          </Button>
        ),
      },
    ],
    [followings, hasAction],
  );

  return (
    <div className={className}>
      {users.length === 0 &&
      followings.value.length === 0 &&
      !followings.isLoading ? (
        <div className="flex flex-col items-center py-10">
          <EmptyIcon />
          <h3 className="mb-2 font-semibold text-xs">{'No Handles Added'}</h3>
          <p className="max-w-[220px] text-center text-v1-content-secondary text-xs">
            {'You can create a customized list by adding handles'}
          </p>
        </div>
      ) : (
        <Table
          columns={followingsColumns}
          dataSource={users}
          rowKey={r => r.username!}
          scrollable={false}
          surface={2}
        />
      )}
    </div>
  );
};
