import { type LastPosition } from 'api/types/signalResponse';

export type Colors = 'green' | 'red' | 'white' | 'grey';
export type Suggestions = LastPosition['suggested_action'];

export const SUGGESTIONS: Record<
  Suggestions,
  {
    label: string;
    color: Colors;
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
