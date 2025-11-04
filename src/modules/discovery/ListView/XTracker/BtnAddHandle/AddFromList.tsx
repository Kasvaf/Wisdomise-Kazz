import useNotification from 'antd/es/notification/useNotification';
import {
  type TwitterAccount,
  type TwitterFollowedAccount,
  useTwitterFollowedAccounts,
  useTwitterSuggestedAccounts,
} from 'api/discovery';
import { bxPlus, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
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
  const isLoggedIn = useIsLoggedIn();
  const [loginModal, open] = useModalLogin();

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
              onClick={() => {
                if (!isLoggedIn) open();
                else {
                  !followings.isLoading &&
                    (followed
                      ? followings
                          .unFollow(asFollowedAccount.user_id)
                          .then(() =>
                            notif.success({
                              message: `@${asFollowedAccount.username} removed from your list.`,
                            }),
                          )
                      : followings.follow(asFollowedAccount).then(() =>
                          notif.success({
                            message: `@${asFollowedAccount.username} added to your list.`,
                          }),
                        ));
                }
              }}
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
    [followings, notif, isLoggedIn, open],
  );

  return (
    <div
      className={clsx(className, 'flex h-full flex-col gap-3 overflow-auto')}
    >
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            if (!isLoggedIn) open();
            else {
              !followings.isLoading && followings.follow(true);
            }
          }}
          size="xs"
          variant="outline"
        >
          Select All
        </Button>
        <Button
          className="!text-v1-content-negative"
          onClick={() => {
            if (!isLoggedIn) open();
            else {
              !followings.isLoading && followings.unFollow(true);
            }
          }}
          size="xs"
          variant="outline"
        >
          Remove All
        </Button>
      </div>
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
      {loginModal}
    </div>
  );
};
