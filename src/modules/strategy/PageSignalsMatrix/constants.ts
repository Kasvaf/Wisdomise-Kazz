import { type LastPosition } from 'api/types/signalResponse';
import { type BadgeColors } from 'shared/Badge';

export type Suggestions = LastPosition['suggested_action'];

export const SUGGESTIONS: Record<
  Suggestions,
  {
    label: string;
    color: BadgeColors;
    greyTitle?: boolean;
  }
> = {
  OPEN: {
    color: 'green',
    label: 'Open',
  },
  OPEN_DELAYED: {
    color: 'green',
    label: 'Open',
  },
  CLOSE: {
    color: 'red',
    label: 'Close',
  },
  CLOSE_DELAYED: {
    color: 'grey',
    label: 'Close',
    greyTitle: true,
  },
  NO_ACTION: {
    color: 'white',
    label: 'No Action',
    greyTitle: true,
  },
};
