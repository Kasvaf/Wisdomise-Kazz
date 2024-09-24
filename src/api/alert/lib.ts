import {
  type Alert,
  type AlertDataSource,
  type AlertParams,
  type RawAlert,
} from './types';

export const transformRawAlert = <D extends AlertDataSource>(
  data: RawAlert<D>,
): Alert<D> => {
  const {
    params,
    conditions,
    data_source: dataSource,
    created_at: createdAt,
    updated_at: updatedAt,
    ...rest
  } = data;
  return {
    ...(dataSource?.name && {
      dataSource: dataSource.name,
    }),
    ...(params && {
      params: Object.fromEntries(
        params.map(({ field_name: fieldName, value }) => [fieldName, value]),
      ) as AlertParams<D>,
    }),
    ...(conditions && {
      condition: conditions[0],
    }),
    createdAt,
    updatedAt,
    ...rest,
  } satisfies Alert<D>;
};

export const transformAlertToPayload = <D extends AlertDataSource>(
  data: Partial<Alert<D>>,
) => {
  const { params, condition, dataSource, ...rest } = data;
  return {
    data_source: dataSource,
    params: params
      ? // eslint-disable-next-line @typescript-eslint/naming-convention
        Object.entries(params).map(([field_name, value]) => ({
          field_name,
          value,
        }))
      : [],
    conditions: [condition],
    ...rest,
  };
};
