import useNotification from 'antd/es/notification/useNotification';
import {
  type TwitterAccount,
  type TwitterFollowedAccount,
  useTwitterFollowedAccounts,
  useTwitterSuggestedAccounts,
} from 'api/discovery';
import { bxPlus, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type ComponentProps, type FC, useMemo, useState } from 'react';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReactComponent as EmptyIcon } from './empty.svg';

const SubTab: FC<
  Omit<
    ComponentProps<typeof ButtonSelect<'followings' | 'suggestions'>>,
    'options'
  >
> = props => (
  <ButtonSelect
    options={[
      {
        label: 'Top Accounts',
        value: 'suggestions',
      },
      {
        label: 'My List',
        value: 'followings',
      },
    ]}
    {...props}
  />
);

export const XTrackerEdit: FC<{ className?: string }> = ({ className }) => {
  const [notif, notifContent] = useNotification({});
  const [tab, setTab] =
    useState<NonNullable<ComponentProps<typeof SubTab>['value']>>(
      'suggestions',
    );

  const followings = useTwitterFollowedAccounts();
  const suggestions = useTwitterSuggestedAccounts();

  const suggestionsColumns = useMemo<Array<TableColumn<TwitterAccount>>>(
    () => [
      {
        key: 'username',
        title: 'Handle',
        render: row => (
          <a
            className="max-w-32 overflow-hidden truncate"
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
              surface={1}
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

  const followingsColumns = useMemo<Array<TableColumn<TwitterFollowedAccount>>>(
    () => [
      {
        key: 'username',
        title: 'Handle',
        render: row => (
          <a
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
      <SubTab
        className="mb-3"
        onChange={setTab}
        size="md"
        surface={1}
        value={tab}
        variant="tab"
      />
      {notifContent}
      <div className="p-3">
        {tab === 'suggestions' && (
          <Table
            columns={suggestionsColumns}
            dataSource={suggestions.data}
            loading={suggestions.isLoading}
            rowKey={r => r.user_id}
            scrollable={false}
            surface={1}
          />
        )}
        {tab === 'followings' &&
          (followings.value.length === 0 && !followings.isLoading ? (
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
          ))}
      </div>
    </div>
  );
};
