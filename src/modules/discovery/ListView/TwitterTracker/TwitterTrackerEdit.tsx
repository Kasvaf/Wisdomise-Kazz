import { type ComponentProps, useState, type FC, useMemo } from 'react';
import { bxPlus, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type TwitterAccount,
  type TwitterFollowedAccount,
  useTwitterFollowedAccounts,
  useTwitterSuggestedAccounts,
} from 'api/discovery';
import { TableRank } from 'shared/TableRank';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { Checkbox } from 'shared/v1-components/Checkbox';
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
        label: 'My List',
        value: 'followings',
      },
      {
        label: 'Top Subs',
        value: 'suggestions',
      },
    ]}
    {...props}
  />
);

export const TwitterTrackerEdit: FC = () => {
  const [tab, setTab] =
    useState<NonNullable<ComponentProps<typeof SubTab>['value']>>('followings');

  const followings = useTwitterFollowedAccounts();
  const suggestions = useTwitterSuggestedAccounts();

  const suggestionsColumns = useMemo<Array<TableColumn<TwitterAccount>>>(
    () => [
      {
        key: 'index',
        title: '',
        width: 40,
        render: (_, index) => <TableRank>{index + 1}</TableRank>,
      },
      {
        key: 'username',
        title: 'Sub',
        width: 150,
        render: row => <>@{row.username}</>,
      },
      {
        key: 'followers',
        title: 'Subscribers',
        render: row => <ReadableNumber value={row.followers_count} />,
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
                followed
                  ? followings.unFollow(asFollowedAccount)
                  : followings.follow(asFollowedAccount)
              }
              size="xs"
              variant="ghost"
              surface={2}
            >
              <Icon
                name={followed ? bxTrash : bxPlus}
                className={clsx(followed && 'opacity-60')}
              />
            </Button>
          );
        },
      },
    ],
    [followings],
  );

  const followingsColumns = useMemo<Array<TableColumn<TwitterFollowedAccount>>>(
    () => [
      {
        key: 'index',
        title: '',
        width: 40,
        render: (_, index) => <TableRank>{index + 1}</TableRank>,
      },
      {
        key: 'username',
        title: 'Sub',
        width: 150,
        render: row => <>@{row.username}</>,
      },
      {
        key: 'toggle_tweets',
        title: 'Tweets',
        render: row => (
          <Checkbox
            value={row.hide_from_list}
            size="md"
            label="Hide"
            onChange={newVal =>
              followings.follow({
                ...row,
                hide_from_list: newVal,
              })
            }
          />
        ),
      },
      {
        key: 'action',
        title: (
          <>
            <button
              className="text-v1-content-negative hover:underline"
              onClick={() => followings.unFollow(true)}
            >
              {'Remove All'}
            </button>
          </>
        ),
        align: 'end',
        render: row => (
          <Button
            fab
            onClick={() => followings.unFollow(row)}
            size="xs"
            variant="ghost"
            surface={2}
          >
            <Icon name={bxTrash} className="opacity-60" />
          </Button>
        ),
      },
    ],
    [followings],
  );

  return (
    <div>
      <SubTab
        variant="tab"
        size="md"
        surface={1}
        value={tab}
        onChange={setTab}
        className="mb-3"
      />
      {tab === 'suggestions' && (
        <Table
          columns={suggestionsColumns}
          dataSource={suggestions.data}
          rowKey={r => r.user_id}
          loading={suggestions.isLoading}
          surface={2}
          scrollable={false}
        />
      )}
      {tab === 'followings' && (
        <>
          {followings.value.length === 0 &&
          followings.rawValue !== undefined ? (
            <div className="flex flex-col items-center py-10">
              <EmptyIcon />
              <h3 className="mb-2 text-xs font-semibold">
                {'No Subscription Added'}
              </h3>
              <p className="max-w-[220px] text-center text-xs text-v1-content-secondary">
                {'You can create a Customized List by adding Subscriptions'}
              </p>
            </div>
          ) : (
            <Table
              columns={followingsColumns}
              dataSource={followings.value}
              loading={!followings.rawValue && followings.value.length === 0}
              rowKey={r => r.user_id}
              surface={2}
              scrollable={false}
            />
          )}
        </>
      )}
    </div>
  );
};
