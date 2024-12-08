import { clsx } from 'clsx';
import React from 'react';
import { type Position } from 'api';

type Color = 'green' | 'red' | 'yellow' | 'grey';

const colorClasses = {
  green: {
    bg: clsx('bg-v1-border-positive'),
    text: clsx('text-v1-border-positive'),
  },
  red: {
    bg: clsx('bg-v1-border-negative'),
    text: clsx('text-v1-border-negative'),
  },
  yellow: {
    bg: clsx('bg-v1-border-notice'),
    text: clsx('text-v1-border-notice'),
  },
  grey: {
    bg: clsx('bg-v1-border-secondary'),
    text: clsx('text-v1-border-secondary'),
  },
} as const;

const StatusItem: React.FC<{
  label: string;
  color: Color;
}> = ({ label, color }) => {
  return (
    <div className="flex w-1/4 flex-col items-center gap-1">
      <div className={colorClasses[color].text}>{label}</div>
      <div
        className={clsx('h-1.5 w-full rounded-sm', colorClasses[color].bg)}
      />
    </div>
  );
};

const make = (color: Color, label: string) => ({
  component: <StatusItem label={label} color={color} />,
  key: color + label,
});

const GREY_DEPOSITED = make('grey', 'Deposited');
const GREEN_DEPOSITED = make('green', 'Deposited');
const GREY_OPENED = make('grey', 'Opened');
const GREEN_OPENED = make('green', 'Opened');
const GREY_CLOSED = make('grey', 'Closed');
const GREEN_CLOSED = make('green', 'Closed');
const GREY_WITHDRAWN = make('grey', 'Withdrawn');

function getItemsByStatus({
  status,
  deposit_status: ds,
  withdraw_status: ws,
}: Position) {
  if (status === 'CANCELED' || ds === 'EXPIRED' || ds === 'CANCELED') {
    return [make('red', 'Canceled'), GREY_OPENED, GREY_CLOSED, GREY_WITHDRAWN];
  }

  if (ds === 'PENDING') {
    return [
      make('yellow', 'Waiting for Deposit'),
      GREY_OPENED,
      GREY_CLOSED,
      GREY_WITHDRAWN,
    ];
  }

  if (status === 'OPENING' || (ds === 'PAID' && status === 'PENDING')) {
    return [
      GREEN_DEPOSITED,
      make('yellow', 'Opening'),
      GREY_CLOSED,
      GREY_WITHDRAWN,
    ];
  }

  if (status === 'OPEN') {
    return [GREEN_DEPOSITED, GREEN_OPENED, GREY_CLOSED, GREY_WITHDRAWN];
  }

  if (status === 'CLOSING') {
    return [
      GREEN_DEPOSITED,
      GREEN_OPENED,
      make('yellow', 'Closing'),
      GREY_WITHDRAWN,
    ];
  }

  if (status === 'CLOSED') {
    return [
      GREEN_DEPOSITED,
      GREEN_OPENED,
      GREEN_CLOSED,
      ws === 'PAID'
        ? make('green', 'Withdrawn')
        : make('yellow', 'Withdrawing'),
    ];
  }

  return [GREY_DEPOSITED, GREY_OPENED, GREY_CLOSED, GREY_WITHDRAWN];
}

const StatusWidget: React.FC<{ position: Position }> = ({ position }) => {
  const items = getItemsByStatus(position);
  return (
    <div className="flex items-end gap-1">
      {items?.map(x => (
        <React.Fragment key={x.key}>{x.component}</React.Fragment>
      ))}
    </div>
  );
};

export default StatusWidget;
