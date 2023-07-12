import _ from "lodash";

import { IFilter } from "./common/Filters/types";

export const checkAllFiltersFilled = (filters: IFilter) => {
  return Object.keys(filters).reduce((_prev, next) => {
    const filter = filters[next];
    if (_.isEmpty(filter)) {
      return true;
    } else if (Object.keys(filter).some((key) => !!filter[key])) {
      return _prev || false;
    }
    return true;
  }, false);
};

export const displayActiveTab = (tab: { id: string }, selectedTab: { id: string }, firstTime?: boolean) =>
  selectedTab.id !== tab.id || firstTime ? "none" : "";
