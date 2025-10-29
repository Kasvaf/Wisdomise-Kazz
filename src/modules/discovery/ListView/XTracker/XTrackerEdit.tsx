import {
  type TwitterFollowedAccount,
  useTwitterFollowedAccounts,
} from 'api/discovery';
import { bxTrash } from 'boxicons-quasar';
import { type FC, useMemo } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReactComponent as EmptyIcon } from './empty.svg';

export const XTrackerEdit: FC<{ className?: string }> = ({ className }) => {
  const followings = useTwitterFollowedAccounts();

  const followingsColumns = useMemo<Array<TableColumn<TwitterFollowedAccount>>>(
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
        render: row => (
          <Checkbox
            label="Hide"
            onChange={newVal =>
              followings.follow({
                ...row,
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
            onClick={() => !followings.isLoading && followings.unFollow(row)}
            size="xs"
            surface={1}
            variant="ghost"
          >
            <Icon className="opacity-60" name={bxTrash} />
          </Button>
        ),
      },
    ],
    [followings],
  );

  return (
    <div className={className}>
      <h2 className="p-3 text-xs">Handles</h2>
      <div className="px-3">
        {followings.value.length === 0 && !followings.isLoading ? (
          <div className="flex flex-col items-center py-10">
            <EmptyIcon />
            <h3 className="mb-2 font-semibold text-xs">
              {'No Subscription Added'}
            </h3>
            <p className="max-w-[220px] text-center text-v1-content-secondary text-xs">
              {'You can create a Customized List by adding Subscriptions'}
            </p>
          </div>
        ) : (
          <Table
            columns={followingsColumns}
            dataSource={followings.value}
            loading={followings.value.length === 0 && followings.isLoading}
            rowKey={r => r.user_id}
            scrollable={false}
            surface={1}
          />
        )}
      </div>
    </div>
  );
};
