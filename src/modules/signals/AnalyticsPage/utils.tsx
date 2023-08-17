import { isEmpty } from 'lodash';

import { type IFilter } from './Filters/types';

export const checkAllFiltersFilled = (filters: IFilter) => {
  return Object.keys(filters).reduce((_prev, next) => {
    const filter = filters[next];
    if (isEmpty(filter)) {
      return true;
    } else if (Object.values(filter).some(Boolean)) {
      return _prev || false;
    }
    return true;
  }, false);
};

export const displayActiveTab = (
  tabId: string,
  selectedTab: { id: string },
  firstTime?: boolean,
) => (selectedTab.id !== tabId || firstTime ? 'none' : '');
