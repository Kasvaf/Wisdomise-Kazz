import { clsx } from 'clsx';
import { type Alert } from 'api';
import { useAlertForm } from '../forms';

export function AlertType({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  const alertForm = useAlertForm(value);
  if (!alertForm) return null;
  const { icon: DtIcon, title } = alertForm;

  return (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      <DtIcon className="size-10 rounded-full" />
      {title}
    </span>
  );
}
