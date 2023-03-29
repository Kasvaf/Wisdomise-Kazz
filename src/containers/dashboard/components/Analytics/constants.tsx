import dayjs from "dayjs";

export const AatFilterDates = {
  min: dayjs("10/01/2022", "MM/DD/YYYY").toDate(),
  max: new Date(),
};

export const SpoFilterDates = {
  min: dayjs("01/01/2022", "MM/DD/YYYY").toDate(),
  max: new Date(),
};
