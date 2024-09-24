import { clsx } from 'clsx';
import { type Alert, type AlertDataSource } from 'api/alert';
import { useDataSources } from '../DataSourceSelectForm';

export function AlertType<D extends AlertDataSource>({
  value,
  className,
}: {
  value: Alert<D>;
  className?: string;
}) {
  const dataSources = useDataSources();
  const dataSource = dataSources.find(dt => dt.value === value.dataSource);
  if (!dataSource) return null;
  const { icon: DtIcon, title } = dataSource;
  return (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      <DtIcon className="size-10 rounded-full" />
      {title}
    </span>
  );
}
