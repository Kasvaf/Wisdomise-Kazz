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
  mini?: boolean;
}> = ({ label, color, mini }) => {
  return (
    <div className="flex w-1/4 flex-col items-center gap-1">
      {!mini && <div className={colorClasses[color].text}>{label}</div>}
      <div
        className={clsx(
          mini ? 'h-1' : 'h-1.5',
          'w-full rounded-sm',
          colorClasses[color].bg,
        )}
      />
    </div>
  );
};

const make = (color: Color, label: string) => ({
  componentGen: (mini?: boolean) => (
    <StatusItem label={label} color={color} mini={mini} />
  ),
  key: color + label,
});

const GREY_STARTED = make('grey', 'Started');
const GREEN_STARTED = make('green', 'Started');
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
    const currentLabel = 'Canceled';
    return {
      items: [
        make('red', currentLabel),
        GREY_OPENED,
        GREY_CLOSED,
        GREY_WITHDRAWN,
      ],
      currentLabel,
    };
  }

  if (ds === 'PENDING') {
    const currentLabel = 'Starting';
    return {
      items: [
        make('yellow', currentLabel),
        GREY_OPENED,
        GREY_CLOSED,
        GREY_WITHDRAWN,
      ],
      currentLabel,
    };
  }

  if (status === 'OPENING' || (ds === 'PAID' && status === 'PENDING')) {
    const currentLabel = 'Opening';
    return {
      items: [
        GREEN_STARTED,
        make('yellow', currentLabel),
        GREY_CLOSED,
        GREY_WITHDRAWN,
      ],
      currentLabel,
    };
  }

  if (status === 'OPEN') {
    const currentLabel = 'Opened';
    return {
      items: [GREEN_STARTED, GREEN_OPENED, GREY_CLOSED, GREY_WITHDRAWN],
      currentLabel,
    };
  }

  if (status === 'CLOSING') {
    const currentLabel = 'Closing';
    return {
      items: [
        GREEN_STARTED,
        GREEN_OPENED,
        make('yellow', currentLabel),
        GREY_WITHDRAWN,
      ],
      currentLabel,
    };
  }

  if (status === 'CLOSED') {
    const currentLabel = ws === 'PAID' ? 'Withdrawn' : 'Withdrawing';
    return {
      items: [
        GREEN_STARTED,
        GREEN_OPENED,
        GREEN_CLOSED,
        ws === 'PAID'
          ? make('green', currentLabel)
          : make('yellow', currentLabel),
      ],
      currentLabel,
    };
  }

  return {
    items: [GREY_STARTED, GREY_OPENED, GREY_CLOSED, GREY_WITHDRAWN],
    currentLabel: null,
  };
}

const StatusWidget: React.FC<{ position: Position; mini?: boolean }> = ({
  position,
  mini,
}) => {
  const { items, currentLabel } = getItemsByStatus(position);
  return (
    <div>
      {mini && <div className="mb-1 text-center">{currentLabel}</div>}
      <div className="flex items-end gap-1">
        {items?.map(x => (
          <React.Fragment key={x.key}>{x.componentGen(mini)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusWidget;
