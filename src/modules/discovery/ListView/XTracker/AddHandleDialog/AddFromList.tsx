import useNotification from 'antd/es/notification/useNotification';
import {
  type TwitterAccount,
  type TwitterFollowedAccount,
  useTwitterFollowedAccounts,
  useTwitterSuggestedAccounts,
} from 'api/discovery';
import { bxPlus, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';

export const AddFromList: FC<{ className?: string; onClose: () => void }> = ({
  className,
  onClose,
}) => {
  const [notif, notifContent] = useNotification({});

  const followings = useTwitterFollowedAccounts();
  const suggestions = useTwitterSuggestedAccounts();

  const suggestionsColumns = useMemo<Array<TableColumn<TwitterAccount>>>(
    () => [
      {
        key: 'username',
        title: 'Handle',
        render: row => (
          <a
            className="max-w-32 overflow-hidden truncate text-xs"
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
        key: 'followers',
        title: 'Followers',
        render: row => (
          <ReadableNumber
            className="text-xs"
            format={{
              decimalLength: 1,
            }}
            value={row.followers_count}
          />
        ),
      },
      {
        key: 'action',
        title: 'Action',
        align: 'end',
        render: row => {
          const followed = followings.value.some(
            x => x.user_id === row.user_id,
          );

          const asFollowedAccount: TwitterFollowedAccount = {
            hide_from_list: false,
            user_id: row.user_id,
            username: row.username,
          };

          return (
            <Button
              fab
              onClick={() =>
                !followings.isLoading &&
                (followed
                  ? followings.unFollow(asFollowedAccount).then(() =>
                      notif.success({
                        message: `@${asFollowedAccount.username} removed from your list.`,
                      }),
                    )
                  : followings.follow(asFollowedAccount).then(() =>
                      notif.success({
                        message: `@${asFollowedAccount.username} added to your list.`,
                      }),
                    ))
              }
              size="xs"
              surface={2}
              variant="ghost"
            >
              <Icon
                className={clsx(followed && 'opacity-60')}
                name={followed ? bxTrash : bxPlus}
              />
            </Button>
          );
        },
      },
    ],
    [followings, notif],
  );

  return (
    <div className={(className, 'h-full overflow-auto flex flex-col gap-3')}>
      <Table
        columns={suggestionsColumns}
        dataSource={suggestions.data}
        loading={suggestions.isLoading}
        rowKey={r => r.user_id}
        scrollable={false}
        surface={2}
      />
      <Button className="shrink-0" onClick={onClose}>
        Done
      </Button>
      {notifContent}
    </div>
  );
};
